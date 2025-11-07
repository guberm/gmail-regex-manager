const { matchesRule } = require('../rules');

describe('matchesRule', () => {
  const baseEmail = {
    from: 'notifications@github.com',
    to: 'user@example.com',
    subject: '[repo] Issue assigned to you',
    body: 'Issue #42 has been assigned.'
  };

  test('matches simple fromPattern', () => {
    const rule = { fromPattern: 'notifications@github.com' };
    expect(matchesRule(baseEmail, rule)).toBe(true);
  });

  test('fails non-matching subjectPattern', () => {
    const rule = { subjectPattern: '^Invoice' };
    expect(matchesRule(baseEmail, rule)).toBe(false);
  });

  test('matches multiple patterns all satisfied', () => {
    const rule = { fromPattern: 'notifications@github.com', subjectPattern: '^\\[repo\\]' };
    expect(matchesRule(baseEmail, rule)).toBe(true);
  });

  test('fails when one of multiple patterns not satisfied', () => {
    const rule = { fromPattern: 'notifications@github.com', subjectPattern: '^Invoice' };
    expect(matchesRule(baseEmail, rule)).toBe(false);
  });

  test('bodyPattern matches body', () => {
    const rule = { bodyPattern: 'Issue #' };
    expect(matchesRule(baseEmail, rule)).toBe(true);
  });

  test('invalid regex returns false gracefully', () => {
    const rule = { subjectPattern: '[' }; // malformed
    expect(matchesRule(baseEmail, rule)).toBe(false);
  });
});
