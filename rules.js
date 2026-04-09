// Extracted rule matching logic for testing (kept in sync with background.js)

// Parses /pattern/flags notation or treats raw string as plain pattern
function parsePattern(raw) {
  const m = raw.match(/^\/(.+)\/([gimsuy]*)$/s);
  return m ? new RegExp(m[1], m[2] || 'i') : new RegExp(raw, 'i');
}

function matchesRule(email, rule) {
  try {
    const patterns = {
      from: rule.fromPattern ? parsePattern(rule.fromPattern) : null,
      to: rule.toPattern ? parsePattern(rule.toPattern) : null,
      subject: rule.subjectPattern ? parsePattern(rule.subjectPattern) : null,
      body: rule.bodyPattern ? parsePattern(rule.bodyPattern) : null
    };
    if (patterns.from && !patterns.from.test(email.from || '')) return false;
    if (patterns.to && !patterns.to.test(email.to || '')) return false;
    if (patterns.subject && !patterns.subject.test(email.subject || '')) return false;
    if (patterns.body && !patterns.body.test(email.body || email.snippet || '')) return false;
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = { matchesRule };
