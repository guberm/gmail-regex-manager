// Extracted rule matching logic for testing (kept in sync with background.js)
function matchesRule(email, rule) {
  try {
    const patterns = {
      from: rule.fromPattern ? new RegExp(rule.fromPattern, 'i') : null,
      to: rule.toPattern ? new RegExp(rule.toPattern, 'i') : null,
      subject: rule.subjectPattern ? new RegExp(rule.subjectPattern, 'i') : null,
      body: rule.bodyPattern ? new RegExp(rule.bodyPattern, 'i') : null
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