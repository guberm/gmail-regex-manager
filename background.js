// Background service worker for Gmail Regex Rules Manager

let authToken = null;
let isMonitoring = false;

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Gmail Regex Manager installed');
  
  // Set up periodic check alarm (every 1 minute)
  chrome.alarms.create('checkGmail', { periodInMinutes: 1 });
  
  // Initialize default settings
  chrome.storage.local.get(['rules', 'settings'], (result) => {
    if (!result.rules) {
      chrome.storage.local.set({ rules: [] });
    }
    if (!result.settings) {
      chrome.storage.local.set({ 
        settings: { 
          enabled: true,
          checkInterval: 1,
          lastChecked: null
        } 
      });
    }
  });
});

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkGmail') {
    checkForNewEmails();
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'authenticate') {
    authenticateUser().then(sendResponse);
    return true;
  } else if (request.action === 'processEmails') {
    processEmailsWithRules(request.emails).then(sendResponse);
    return true;
  } else if (request.action === 'testRule') {
    testRule(request.rule, request.email).then(sendResponse);
    return true;
  } else if (request.action === 'getAuthToken') {
    getAuthToken().then(sendResponse);
    return true;
  }
});

// Authenticate with Google
async function authenticateUser() {
  try {
    const token = await new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
    });
    
    authToken = token;
    console.log('Authentication successful');
    return { success: true, token };
  } catch (error) {
    console.error('Authentication failed:', error);
    return { success: false, error: error.message };
  }
}

// Get current auth token
async function getAuthToken() {
  if (authToken) {
    return { success: true, token: authToken };
  }
  return authenticateUser();
}

// Check for new emails
async function checkForNewEmails() {
  const settings = await chrome.storage.local.get(['settings']);
  
  if (!settings.settings || !settings.settings.enabled) {
    return;
  }
  
  // Send message to content script if Gmail is open
  chrome.tabs.query({ url: 'https://mail.google.com/*' }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { action: 'scanEmails' });
    });
  });
  
  // Update last checked time
  chrome.storage.local.set({
    settings: { ...settings.settings, lastChecked: Date.now() }
  });
}

// Process emails with rules
async function processEmailsWithRules(emails) {
  const { rules } = await chrome.storage.local.get(['rules']);
  
  if (!rules || rules.length === 0) {
    return { success: true, processed: 0 };
  }
  
  const token = authToken || (await getAuthToken()).token;
  if (!token) {
    return { success: false, error: 'Not authenticated' };
  }
  
  let processedCount = 0;
  
  const startTime = performance.now();
  let matchChecks = 0;
  let ruleMatches = 0;
  for (const email of emails) {
    for (const rule of rules) {
      if (!rule.enabled) continue;
      matchChecks++;
      const matches = await matchesRule(email, rule);
      if (matches) {
        ruleMatches++;
        await applyRuleActions(email, rule, token);
        processedCount++;
      }
    }
  }
  const durationMs = performance.now() - startTime;
  try {
    const { perfStats } = await chrome.storage.local.get(['perfStats']);
    const entry = { timestamp: Date.now(), emails: emails.length, rules: rules.length, matchChecks, ruleMatches, processedCount, durationMs };
    const updated = (perfStats || []).concat(entry).slice(-50);
    await chrome.storage.local.set({ perfStats: updated });
  } catch (e) {
    console.warn('Unable to store perf stats', e);
  }
  return { success: true, processed: processedCount, durationMs, matchChecks, ruleMatches };
}

// Check if email matches rule
async function matchesRule(email, rule) {
  try {
    const patterns = {
      from: rule.fromPattern ? new RegExp(rule.fromPattern, 'i') : null,
      to: rule.toPattern ? new RegExp(rule.toPattern, 'i') : null,
      subject: rule.subjectPattern ? new RegExp(rule.subjectPattern, 'i') : null,
      body: rule.bodyPattern ? new RegExp(rule.bodyPattern, 'i') : null
    };
    
    let matches = true;
    
    if (patterns.from && !patterns.from.test(email.from)) {
      matches = false;
    }
    if (patterns.to && !patterns.to.test(email.to)) {
      matches = false;
    }
    if (patterns.subject && !patterns.subject.test(email.subject)) {
      matches = false;
    }
    if (patterns.body && !patterns.body.test(email.body)) {
      matches = false;
    }
    
    return matches;
  } catch (error) {
    console.error('Error matching rule:', error);
    return false;
  }
}

// Apply rule actions to email
async function applyRuleActions(email, rule, token) {
  const actions = rule.actions || {};
  const messageId = email.id;
  
  try {
    // Apply labels
    if (actions.addLabels && actions.addLabels.length > 0) {
      await addLabelsToEmail(messageId, actions.addLabels, token);
    }
    
    // Remove labels
    if (actions.removeLabels && actions.removeLabels.length > 0) {
      await removeLabelsFromEmail(messageId, actions.removeLabels, token);
    }
    
    // Mark as read
    if (actions.markAsRead) {
      await markEmailAsRead(messageId, token);
    }
    
    // Mark as important
    if (actions.markAsImportant) {
      await markEmailAsImportant(messageId, token);
    }
    
    // Archive
    if (actions.archive) {
      await archiveEmail(messageId, token);
    }
    
    // Trash
    if (actions.trash) {
      await trashEmail(messageId, token);
    }
    
    // Star
    if (actions.star) {
      await starEmail(messageId, token);
    }
    
    console.log(`Applied actions to email: ${email.subject}`);
  } catch (error) {
    console.error('Error applying rule actions:', error);
  }
}

// Gmail API functions
async function addLabelsToEmail(messageId, labelNames, token) {
  const labelIds = await getLabelIds(labelNames, token);
  
  return fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      addLabelIds: labelIds
    })
  });
}

async function removeLabelsFromEmail(messageId, labelNames, token) {
  const labelIds = await getLabelIds(labelNames, token);
  
  return fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      removeLabelIds: labelIds
    })
  });
}

async function markEmailAsRead(messageId, token) {
  return fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      removeLabelIds: ['UNREAD']
    })
  });
}

async function markEmailAsImportant(messageId, token) {
  return fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      addLabelIds: ['IMPORTANT']
    })
  });
}

async function archiveEmail(messageId, token) {
  return fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      removeLabelIds: ['INBOX']
    })
  });
}

async function trashEmail(messageId, token) {
  return fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

async function starEmail(messageId, token) {
  return fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      addLabelIds: ['STARRED']
    })
  });
}

async function getLabelIds(labelNames, token) {
  const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/labels', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  const labels = data.labels || [];
  
  const labelIds = [];
  
  for (const labelName of labelNames) {
    let label = labels.find(l => l.name.toLowerCase() === labelName.toLowerCase());
    
    // Create label if it doesn't exist
    if (!label) {
      label = await createLabel(labelName, token);
    }
    
    if (label) {
      labelIds.push(label.id);
    }
  }
  
  return labelIds;
}

async function createLabel(labelName, token) {
  try {
    const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/labels', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show'
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error creating label:', error);
    return null;
  }
}

// Test rule function
async function testRule(rule, email) {
  const matches = await matchesRule(email, rule);
  return { matches };
}
