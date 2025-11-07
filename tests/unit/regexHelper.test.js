/**
 * Tests for regex helper evaluation logic
 */

// Pure function extracted from regex helper for testing
function evaluatePattern(pattern, sample) {
  if (!pattern) {
    return { state: 'empty', detail: '—' };
  }
  let re;
  try {
    re = new RegExp(pattern, 'i');
  } catch (e) {
    return { state: 'error', detail: e.message };
  }
  const matched = sample ? re.test(sample) : false;
  return { state: matched ? 'match' : 'no-match', detail: matched ? '✔' : '✖' };
}

describe('Regex Helper Evaluation', () => {
  describe('evaluatePattern', () => {
    test('empty pattern returns empty state', () => {
      const result = evaluatePattern('', 'test@example.com');
      expect(result.state).toBe('empty');
      expect(result.detail).toBe('—');
    });

    test('null pattern returns empty state', () => {
      const result = evaluatePattern(null, 'test@example.com');
      expect(result.state).toBe('empty');
      expect(result.detail).toBe('—');
    });

    test('valid pattern matching sample returns match', () => {
      const result = evaluatePattern('.*@example\\.com', 'test@example.com');
      expect(result.state).toBe('match');
      expect(result.detail).toBe('✔');
    });

    test('valid pattern not matching sample returns no-match', () => {
      const result = evaluatePattern('.*@example\\.com', 'test@other.com');
      expect(result.state).toBe('no-match');
      expect(result.detail).toBe('✖');
    });

    test('case insensitive matching works', () => {
      const result = evaluatePattern('^urgent', 'URGENT: Action Required');
      expect(result.state).toBe('match');
      expect(result.detail).toBe('✔');
    });

    test('invalid regex pattern returns error', () => {
      const result = evaluatePattern('[invalid', 'test');
      expect(result.state).toBe('error');
      expect(result.detail).toContain('Unterminated character class');
    });

    test('empty sample with pattern returns no-match', () => {
      const result = evaluatePattern('.*@example\\.com', '');
      expect(result.state).toBe('no-match');
      expect(result.detail).toBe('✖');
    });

    test('null sample with pattern returns no-match', () => {
      const result = evaluatePattern('.*@example\\.com', null);
      expect(result.state).toBe('no-match');
      expect(result.detail).toBe('✖');
    });

    test('complex regex pattern works correctly', () => {
      const result = evaluatePattern('^\\[URGENT\\].*', '[URGENT] Critical Issue');
      expect(result.state).toBe('match');
      expect(result.detail).toBe('✔');
    });

    test('OR pattern works correctly', () => {
      const result = evaluatePattern('invoice|receipt|payment', 'Here is your receipt');
      expect(result.state).toBe('match');
      expect(result.detail).toBe('✔');
    });

    test('anchored pattern at start', () => {
      const result1 = evaluatePattern('^test', 'test message');
      expect(result1.state).toBe('match');
      
      const result2 = evaluatePattern('^test', 'some test message');
      expect(result2.state).toBe('no-match');
    });

    test('anchored pattern at end', () => {
      const result1 = evaluatePattern('test$', 'this is a test');
      expect(result1.state).toBe('match');
      
      const result2 = evaluatePattern('test$', 'test is here');
      expect(result2.state).toBe('no-match');
    });

    test('special characters properly escaped', () => {
      const result = evaluatePattern('\\*\\*URGENT\\*\\*', '**URGENT** message');
      expect(result.state).toBe('match');
      expect(result.detail).toBe('✔');
    });

    test('character class matching', () => {
      const result = evaluatePattern('[0-9]{3}-[0-9]{4}', 'Call 555-1234');
      expect(result.state).toBe('match');
      expect(result.detail).toBe('✔');
    });
  });
});
