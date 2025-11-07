// Background service worker for Gmail Regex Rules Manager

let authToken = null;
let isMonitoring = false;

// Helper: schedule alarm based on settings
async function scheduleAlarmFromSettings() {
  try {
    const { settings } = await chrome.storage.local.get(['settings']);
    const interval = Math.max(1, settings?.processingIntervalMinutes || settings?.checkInterval || 1); // Chrome minimum 1 minute
    await chrome.alarms.clear('checkGmail');
    chrome.alarms.create('checkGmail', { periodInMinutes: interval });
    if (self.appLogger) self.appLogger.log('info', `Alarm scheduled every ${interval} min`);
  } catch(e) {
    if (self.appLogger) self.appLogger.log('warn','Failed scheduling alarm', e);
  }
}

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Gmail Regex Manager installed');
  
  // Initialize default settings
  chrome.storage.local.get(['rules', 'settings'], async (result) => {
    if (!result.rules) {
      chrome.storage.local.set({ rules: [] });
    }
    if (!result.settings) {
      chrome.storage.local.set({ 
        settings: { 
          enabled: true,
          checkInterval: 1, // legacy
          processingIntervalMinutes: 1,
          perfRetentionLimit: 50,
          lastChecked: null
        } 
      });
    }
    await scheduleAlarmFromSettings();
  });
});

// Also schedule on service worker startup (fresh session)
scheduleAlarmFromSettings();

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
  } else if (request.action === 'rescheduleInterval') {
    // Update settings then reschedule
    chrome.storage.local.get(['settings'], async ({ settings }) => {
      const updated = { ...settings, processingIntervalMinutes: Math.max(1, request.minutes) };
      await chrome.storage.local.set({ settings: updated });
      await scheduleAlarmFromSettings();
      sendResponse({ success: true });
    });
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
  if (self.appLogger) self.appLogger.log('info','Authentication successful');
    return { success: true, token };
  } catch (error) {
  if (self.appLogger) self.appLogger.log('error','Authentication failed', error);
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
  const matchedRuleIdsThisRun = new Set();
  for (const email of emails) {
    for (const rule of rules) {
      if (!rule.enabled) continue;
      matchChecks++;
      const matches = await matchesRule(email, rule);
      if (matches) {
        ruleMatches++;
        // Update per-rule statistics
        if (!rule.stats) rule.stats = { count: 0, lastMatched: null };
        rule.stats.count += 1;
        rule.stats.lastMatched = Date.now();
        matchedRuleIdsThisRun.add(rule.id);
        // applyRuleActions now provided by gmailActions.js (attached to global scope)
        if (typeof self.applyRuleActions === 'function') {
          await self.applyRuleActions(email, rule, token);
        } else {
        if (self.appLogger) self.appLogger.log('warn','applyRuleActions helper not found');
        }
        processedCount++;
      }
    }
  }
  const durationMs = performance.now() - startTime;
  if (typeof self.createPerfEntry === 'function' && typeof self.storePerfEntry === 'function') {
    const entry = self.createPerfEntry({ emailsCount: emails.length, rulesCount: rules.length, matchChecks, ruleMatches, processedCount, durationMs });
    await self.storePerfEntry(entry);
  }
  // Persist updated rule stats if any rule matched
  if (matchedRuleIdsThisRun.size > 0) {
    try {
      await chrome.storage.local.set({ rules });
    } catch (e) {
    if (self.appLogger) self.appLogger.log('warn','Failed to persist updated rule stats', e);
    }
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

// Test rule function
async function testRule(rule, email) {
  const matches = await matchesRule(email, rule);
  return { matches };
}

