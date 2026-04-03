// Gmail API and rule action helpers extracted from background.js
async function addLabelsToEmail(messageId, labelNames, token) {
  const labelIds = await getLabelIds(labelNames, token);
  if (self.appLogger) self.appLogger.log('info', `Adding labels [${labelNames.join(', ')}] (ids: ${labelIds.join(', ')}) to msg ${messageId}`);
  const res = await retryFetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ addLabelIds: labelIds })
  });
  if (!res.ok) {
    const body = await res.clone().text();
    if (self.appLogger) self.appLogger.log('error', `modify API ${res.status}: ${body}`);
  }
  return res;
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
async function getLabelIds(labelNames, token, fetchImpl = fetch) {
  const response = await retryFetch('https://www.googleapis.com/gmail/v1/users/me/labels', { headers: { 'Authorization': `Bearer ${token}` } }, 3, fetchImpl);
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
async function createLabel(labelName, token, fetchImpl = fetch) {
  try {
  const response = await retryFetch('https://www.googleapis.com/gmail/v1/users/me/labels', {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: labelName, labelListVisibility: 'labelShow', messageListVisibility: 'show' })
    }, 3, fetchImpl);
    return await response.json();
  } catch (e) { console.error('Error creating label:', e); return null; }
}
async function applyRuleActions(email, rule, token) {
  const actions = rule.actions || {}; const messageId = email.id;
  try {
    if (actions.addLabels?.length) {
      const res = await addLabelsToEmail(messageId, actions.addLabels, token);
      if (!res.ok && self.appLogger) self.appLogger.log('error', `addLabels failed (${res.status}) for msg ${messageId}`);
    }
    if (actions.removeLabels?.length) await removeLabelsFromEmail(messageId, actions.removeLabels, token);
    if (actions.markAsRead) await markEmailAsRead(messageId, token);
    if (actions.markAsImportant) await markEmailAsImportant(messageId, token);
    if (actions.archive) await archiveEmail(messageId, token);
    if (actions.trash) await trashEmail(messageId, token);
    if (actions.star) await starEmail(messageId, token);
  } catch (e) {
    if (self.appLogger) self.appLogger.log('error', `applyRuleActions error: ${e.message}`);
  }
}
// Simple retry with exponential backoff for transient network/server errors
async function retryFetch(url, options, attempts = 3, fetchImpl = fetch) {
  let delay = 300;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetchImpl(url, options);
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