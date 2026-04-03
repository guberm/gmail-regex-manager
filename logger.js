// Logging utility — writes to console and persists to chrome.storage.local (capped at 300 entries)
const LEVELS = ['error', 'warn', 'info', 'debug'];
const MAX_LOGS = 300;

function shouldLog(level, current) {
  return LEVELS.indexOf(level) <= LEVELS.indexOf(current);
}

async function getLevel() {
  try {
    const { settings } = await chrome.storage.local.get(['settings']);
    return settings?.logLevel || 'info';
  } catch { return 'info'; }
}

async function log(level, ...args) {
  if (!LEVELS.includes(level)) level = 'info';
  const current = await getLevel();
  if (!shouldLog(level, current)) return;

  const prefix = `[${level.toUpperCase()}]`;
  console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](prefix, ...args);

  // Persist to storage
  const message = args.map(a => {
    if (a instanceof Error) return a.message;
    if (typeof a === 'object') { try { return JSON.stringify(a); } catch { return String(a); } }
    return String(a);
  }).join(' ');

  try {
    const { appLogs } = await chrome.storage.local.get(['appLogs']);
    const logs = appLogs || [];
    logs.push({ ts: Date.now(), level, message });
    if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);
    await chrome.storage.local.set({ appLogs: logs });
  } catch { /* storage failure should not break anything */ }
}

self.appLogger = { log };
