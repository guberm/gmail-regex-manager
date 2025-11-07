// Simple logging utility with log levels stored in chrome.storage.local settings
const LEVELS = ['error','warn','info','debug'];
function shouldLog(level, current){
  return LEVELS.indexOf(level) <= LEVELS.indexOf(current);
}
async function getLevel(){
  try { const { settings } = await chrome.storage.local.get(['settings']); return settings?.logLevel || 'info'; } catch { return 'info'; }
}
async function log(level, ...args){
  const current = await getLevel();
  if (!LEVELS.includes(level)) level = 'info';
  if (!shouldLog(level, current)) return;
  const prefix = `[${level.toUpperCase()}]`;
  console[level === 'debug' ? 'log' : level === 'info' ? 'log' : level](prefix, ...args);
}
self.appLogger = { log };
