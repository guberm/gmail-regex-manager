// Background service worker for Gmail Regex Rules Manager
importScripts('logger.js', 'perf.js', 'gmailActions.js');

let authToken = null;
let isMonitoring = false;
const processedMessageIds = new Set();      // global dedup for time-windowed fetch
const ruleProcessedIds = new Map();         // ruleId → Set<messageId> for applyToRead rules

function getRuleProcessedSet(ruleId) {
  if (!ruleProcessedIds.has(ruleId)) ruleProcessedIds.set(ruleId, new Set());
  return ruleProcessedIds.get(ruleId);
}

// Restore processed-ID sets from storage so dedup survives service worker restarts
(async function initPersistedIds() {
  try {
    const { processedIds, ruleMatchedIds } = await chrome.storage.local.get(['processedIds', 'ruleMatchedIds']);
    const cutoff = Date.now() - 32 * 86400000; // 32-day window, slightly > 30d query window
    if (processedIds) {
      for (const [id, ts] of Object.entries(processedIds)) {
        if (ts > cutoff) processedMessageIds.add(id);
      }
    }
    if (ruleMatchedIds) {
      for (const [ruleId, matches] of Object.entries(ruleMatchedIds)) {
        const set = getRuleProcessedSet(ruleId);
        for (const [msgId, ts] of Object.entries(matches)) {
          if (ts > cutoff) set.add(msgId);
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load persisted processed IDs', e);
  }
})();

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

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

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
    // Content script detected new mail — trigger an API-based check immediately
    checkForNewEmails().then(() => sendResponse({ success: true }));
    return true;
  } else if (request.action === 'testRule') {
    testRule(request.rule, request.email).then(sendResponse);
    return true;
  } else if (request.action === 'getAuthToken') {
    getAuthToken().then(sendResponse);
    return true;
  } else if (request.action === 'getGmailLabels') {
    getGmailLabels().then(sendResponse);
    return true;
  } else if (request.action === 'createGmailLabel') {
    createGmailLabel(request.name).then(sendResponse);
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

// Authenticate with Google — uses custom client_id (from uploaded JSON) if stored,
// otherwise falls back to the manifest.json client_id via chrome.identity.getAuthToken.
async function authenticateUser() {
  try {
    const { customOauth } = await chrome.storage.local.get(['customOauth']);
    let token;
    if (customOauth?.clientId) {
      token = await authenticateWithCustomClientId(customOauth.clientId);
    } else {
      token = await new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (t) => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve(t);
        });
      });
    }
    authToken = token;
    if (self.appLogger) self.appLogger.log('info', 'Authentication successful');
    return { success: true, token };
  } catch (error) {
    if (self.appLogger) self.appLogger.log('error', 'Authentication failed', error);
    return { success: false, error: error.message };
  }
}

// OAuth implicit flow using a custom client_id uploaded by the user.
// Uses chrome.identity.launchWebAuthFlow — no client_secret required.
async function authenticateWithCustomClientId(clientId) {
  const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`;
  const scopes = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.labels'
  ].join(' ');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'token');
  authUrl.searchParams.set('scope', scopes);

  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      { url: authUrl.toString(), interactive: true },
      (responseUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        const hash = new URL(responseUrl).hash.slice(1);
        const params = new URLSearchParams(hash);
        const token = params.get('access_token');
        if (token) resolve(token);
        else reject(new Error('No access_token in OAuth response'));
      }
    );
  });
}

// Get current auth token
async function getAuthToken() {
  if (authToken) {
    return { success: true, token: authToken };
  }
  return authenticateUser();
}

// Check for new emails via Gmail API (no DOM dependency)
async function checkForNewEmails() {
  const { settings } = await chrome.storage.local.get(['settings']);
  if (!settings?.enabled) return;

  if (self.appLogger) self.appLogger.log('info', 'Checking for new emails...');

  const { success, token } = await getAuthToken();
  if (!success || !token) {
    if (self.appLogger) self.appLogger.log('error', 'Cannot check emails: not authenticated');
    return;
  }

  try {
    const { rules: allRules } = await chrome.storage.local.get(['rules']);
    const activeRules = (allRules || []).filter(r => r.enabled);
    const hasReadRule = activeRules.some(r => r.applyToRead);

    // Wide window (30 d) when any rule needs to cover read mail; otherwise since last check
    let query;
    if (hasReadRule) {
      query = encodeURIComponent('in:inbox newer_than:30d');
    } else {
      const afterSec = settings.lastChecked
        ? Math.floor(settings.lastChecked / 1000)
        : Math.floor((Date.now() - 86400000) / 1000);
      query = encodeURIComponent(`in:inbox after:${afterSec}`);
    }

    const listRes = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=50`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const listData = await listRes.json();

    if (listData.error) {
      if (self.appLogger) self.appLogger.log('error', `Gmail API error: ${listData.error.message}`);
      return;
    }

    const allMessages = listData.messages || [];
    const newMessages = allMessages.filter(m => !processedMessageIds.has(m.id));
    if (self.appLogger) self.appLogger.log('info', `Found ${allMessages.length} in window, ${newMessages.length} new`);
    if (newMessages.length === 0) return;

    const newlyAdded = new Set();

    // Fetch metadata for each unseen message
    const emails = (await Promise.all(newMessages.map(async (msg) => {
      try {
        const r = await fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata` +
          `&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const d = await r.json();
        const h = (name) => (d.payload?.headers || [])
          .find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
        processedMessageIds.add(msg.id);
        newlyAdded.add(msg.id);
        return { id: msg.id, from: h('From'), to: h('To'), subject: h('Subject'), body: d.snippet || '', snippet: d.snippet || '' };
      } catch (e) {
        if (self.appLogger) self.appLogger.log('warn', `Failed to fetch message ${msg.id}: ${e.message}`);
        return null;
      }
    }))).filter(Boolean);

    // Cap set size to avoid unbounded growth across restarts
    if (processedMessageIds.size > 2000) processedMessageIds.clear();

    if (emails.length > 0) await processEmailsWithRules(emails);

    // Persist newly seen IDs so dedup survives service worker restarts
    if (newlyAdded.size > 0) {
      try {
        const { processedIds } = await chrome.storage.local.get(['processedIds']);
        const store = processedIds || {};
        const now = Date.now();
        const cutoff = now - 32 * 86400000;
        for (const id of newlyAdded) store[id] = now;
        for (const id of Object.keys(store)) { if (store[id] < cutoff) delete store[id]; }
        await chrome.storage.local.set({ processedIds: store });
      } catch (e) {
        if (self.appLogger) self.appLogger.log('warn', 'Failed to persist processedIds', e);
      }
    }
  } catch (e) {
    if (self.appLogger) self.appLogger.log('error', `checkForNewEmails failed: ${e.message}`);
  }

  chrome.storage.local.set({ settings: { ...settings, lastChecked: Date.now() } });
}

// Process emails with rules
async function processEmailsWithRules(emails) {
  const { rules } = await chrome.storage.local.get(['rules']);

  if (!rules || rules.length === 0) {
    if (self.appLogger) self.appLogger.log('info', 'No rules configured, skipping');
    return { success: true, processed: 0 };
  }

  const token = authToken || (await getAuthToken()).token;
  if (!token) {
    if (self.appLogger) self.appLogger.log('error', 'processEmailsWithRules: no auth token');
    return { success: false, error: 'Not authenticated' };
  }

  if (self.appLogger) self.appLogger.log('info', `Processing ${emails.length} email(s) against ${rules.filter(r => r.enabled).length} active rule(s)`);
  
  let processedCount = 0;

  const startTime = performance.now();
  let matchChecks = 0;
  let ruleMatches = 0;
  const matchedRuleIdsThisRun = new Set();
  const newRuleMatches = new Map(); // ruleId → Set<msgId> for persistence
  for (const email of emails) {
    if (self.appLogger) self.appLogger.log('info', `Email: subject="${email.subject}" from="${email.from}"`);
    for (const rule of rules) {
      if (!rule.enabled) continue;
      // For applyToRead rules, use per-rule dedup so we don't re-label on every check
      if (rule.applyToRead) {
        const seen = getRuleProcessedSet(rule.id);
        if (seen.has(email.id)) continue;
      }
      matchChecks++;
      const matches = await matchesRule(email, rule);
      if (self.appLogger) self.appLogger.log('debug', `  Rule "${rule.name}": ${matches ? 'MATCH' : 'no match'}`);
      if (matches) {
        ruleMatches++;
        if (rule.applyToRead) {
          getRuleProcessedSet(rule.id).add(email.id);
          if (!newRuleMatches.has(rule.id)) newRuleMatches.set(rule.id, new Set());
          newRuleMatches.get(rule.id).add(email.id);
        }
        if (self.appLogger) self.appLogger.log('info', `Rule "${rule.name}" matched: "${email.subject}" from ${email.from}`);
        // Update per-rule statistics
        if (!rule.stats) rule.stats = { count: 0, lastMatched: null };
        rule.stats.count += 1;
        rule.stats.lastMatched = Date.now();
        matchedRuleIdsThisRun.add(rule.id);
        if (typeof self.applyRuleActions === 'function') {
          await self.applyRuleActions(email, rule, token);
          if (self.appLogger) self.appLogger.log('info', `Actions applied for rule "${rule.name}"`);
        } else {
          if (self.appLogger) self.appLogger.log('warn', 'applyRuleActions helper not found');
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
  // Persist per-rule matched IDs so applyToRead dedup survives service worker restarts
  if (newRuleMatches.size > 0) {
    try {
      const { ruleMatchedIds } = await chrome.storage.local.get(['ruleMatchedIds']);
      const store = ruleMatchedIds || {};
      const now = Date.now();
      const cutoff = now - 32 * 86400000;
      for (const [ruleId, msgIds] of newRuleMatches) {
        if (!store[ruleId]) store[ruleId] = {};
        for (const msgId of msgIds) store[ruleId][msgId] = now;
      }
      // Prune stale entries
      for (const ruleId of Object.keys(store)) {
        for (const msgId of Object.keys(store[ruleId])) {
          if (store[ruleId][msgId] < cutoff) delete store[ruleId][msgId];
        }
        if (Object.keys(store[ruleId]).length === 0) delete store[ruleId];
      }
      await chrome.storage.local.set({ ruleMatchedIds: store });
    } catch (e) {
      if (self.appLogger) self.appLogger.log('warn', 'Failed to persist ruleMatchedIds', e);
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

// Fetch user's Gmail labels
async function getGmailLabels() {
  try {
    const token = authToken || (await getAuthToken()).token;
    if (!token) return { success: false, labels: [] };
    const res = await fetch('https://www.googleapis.com/gmail/v1/users/me/labels', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    const labels = (data.labels || [])
      .filter(l => l.type === 'user')
      .map(l => l.name)
      .sort((a, b) => a.localeCompare(b));
    return { success: true, labels };
  } catch (e) {
    return { success: false, labels: [] };
  }
}

// Create a Gmail label by name
async function createGmailLabel(name) {
  try {
    const token = authToken || (await getAuthToken()).token;
    if (!token) return { success: false, error: 'Not authenticated' };
    const res = await fetch('https://www.googleapis.com/gmail/v1/users/me/labels', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, labelListVisibility: 'labelShow', messageListVisibility: 'show' })
    });
    const data = await res.json();
    if (data.id) {
      if (self.appLogger) self.appLogger.log('info', `Created label "${name}" (id: ${data.id})`);
      return { success: true, label: data };
    }
    const msg = data.error?.message || 'Unknown error';
    if (self.appLogger) self.appLogger.log('error', `Failed to create label "${name}": ${msg}`);
    return { success: false, error: msg };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Test rule function
async function testRule(rule, email) {
  const matches = await matchesRule(email, rule);
  return { matches };
}

