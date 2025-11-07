const { createPerfEntry } = require('../../perf.js');

describe('createPerfEntry', () => {
  test('creates entry with rounded duration and correct fields', () => {
    const entry = createPerfEntry({ emailsCount: 5, rulesCount: 3, matchChecks: 15, ruleMatches: 4, processedCount: 4, durationMs: 123.4567 });
    expect(entry.emails).toBe(5);
    expect(entry.rules).toBe(3);
    expect(entry.matchChecks).toBe(15);
    expect(entry.ruleMatches).toBe(4);
    expect(entry.processedCount).toBe(4);
    expect(entry.durationMs).toBeCloseTo(123.46, 2);
    expect(typeof entry.timestamp).toBe('number');
  });
});
