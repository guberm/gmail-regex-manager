// Gmail API and rule action helpers extracted from background.js
async function addLabelsToEmail(messageId, labelNames, token) {
  const labelIds = await getLabelIds(labelNames, token);
  return retryFetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ addLabelIds: labelIds })
  });
}
async function removeLabelsFromEmail(messageId, labelNames, token) {
  const labelIds = await getLabelIds(labelNames, token);
  return retryFetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ removeLabelIds: labelIds })
  });
}
async function markEmailAsRead(messageId, token) {
  return retryFetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ removeLabelIds: ['UNREAD'] })
  });
}
async function markEmailAsImportant(messageId, token) {
  return retryFetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ addLabelIds: ['IMPORTANT'] })
  });
}
async function archiveEmail(messageId, token) {
  return retryFetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ removeLabelIds: ['INBOX'] })
  });
}
async function trashEmail(messageId, token) {
  return retryFetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
}
async function starEmail(messageId, token) {
  return retryFetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ addLabelIds: ['STARRED'] })
  });
}
async function getLabelIds(labelNames, token) {
  const response = await retryFetch('https://www.googleapis.com/gmail/v1/users/me/labels', { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await response.json();
  const labels = data.labels || [];
  const labelIds = [];
  for (const labelName of labelNames) {
    let label = labels.find(l => l.name.toLowerCase() === labelName.toLowerCase());
    if (!label) label = await createLabel(labelName, token);
    if (label) labelIds.push(label.id);
  }
  return labelIds;
}
async function createLabel(labelName, token) {
  try {
  const response = await retryFetch('https://www.googleapis.com/gmail/v1/users/me/labels', {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: labelName, labelListVisibility: 'labelShow', messageListVisibility: 'show' })
    });
    return await response.json();
  } catch (e) { console.error('Error creating label:', e); return null; }
}
async function applyRuleActions(email, rule, token) {
  const actions = rule.actions || {}; const messageId = email.id;
  try {
    if (actions.addLabels?.length) await addLabelsToEmail(messageId, actions.addLabels, token);
    if (actions.removeLabels?.length) await removeLabelsFromEmail(messageId, actions.removeLabels, token);
    if (actions.markAsRead) await markEmailAsRead(messageId, token);
    if (actions.markAsImportant) await markEmailAsImportant(messageId, token);
    if (actions.archive) await archiveEmail(messageId, token);
    if (actions.trash) await trashEmail(messageId, token);
    if (actions.star) await starEmail(messageId, token);
    console.log(`Applied actions to email: ${email.subject}`);
  } catch (e) { console.error('Error applying rule actions:', e); }
}
// Simple retry with exponential backoff for transient network/server errors
async function retryFetch(url, options, attempts = 3) {
  let delay = 300;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok && res.status >= 500 && i < attempts - 1) throw new Error('Server error ' + res.status);
      return res;
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}
// expose to background.js
self.applyRuleActions = applyRuleActions;