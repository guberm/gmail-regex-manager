// Performance stats utility
function createPerfEntry(context) {
  const { emailsCount, rulesCount, matchChecks, ruleMatches, processedCount, durationMs } = context;
  return {
    timestamp: Date.now(),
    emails: emailsCount,
    rules: rulesCount,
    matchChecks,
    ruleMatches,
    processedCount,
    durationMs: Math.round(durationMs * 100) / 100
  };
}
async function storePerfEntry(entry) {
  try {
    const { perfStats, settings } = await chrome.storage.local.get(['perfStats','settings']);
    const limit = Math.max(5, Math.min(500, settings?.perfRetentionLimit || 50));
    const updated = (perfStats || []).concat(entry).slice(-limit);
    await chrome.storage.local.set({ perfStats: updated });
    return { success: true };
  } catch (e) {
    console.warn('Unable to store perf stats', e);
    return { success: false, error: e.message };
  }
}
self.createPerfEntry = createPerfEntry;
self.storePerfEntry = storePerfEntry;