// Popup UI logic
let currentRules = [];
let editingRuleId = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadRules();
  setupEventListeners();
  checkAuthStatus();
});

// Setup event listeners
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Auth button
  document.getElementById('authBtn').addEventListener('click', authenticate);

  // Enable/disable toggle
  document.getElementById('enabledToggle').addEventListener('change', (e) => {
    updateSettings({ enabled: e.target.checked });
  });

  // Add rule button
  document.getElementById('addRuleBtn').addEventListener('click', () => {
    switchTab('create');
    resetForm();
  });

  // Rule form
  document.getElementById('ruleForm').addEventListener('submit', saveRule);
  document.getElementById('cancelBtn').addEventListener('click', () => {
    switchTab('rules');
    resetForm();
  });

  // Test rules
  document.getElementById('testRulesBtn').addEventListener('click', testRules);

  // Export rules
  document.getElementById('exportRulesBtn').addEventListener('click', exportRules);
  // Import file selection
  const importFile = document.getElementById('importFile');
  const importBtn = document.getElementById('importRulesBtn');
  importFile.addEventListener('change', () => {
    importBtn.disabled = !importFile.files.length;
    if(importFile.files.length){
      document.getElementById('importStatus').textContent = `${importFile.files[0].name} ready to import`;
    } else {
      document.getElementById('importStatus').textContent = '';
    }
  });
  importBtn.addEventListener('click', importRules);
}

// Switch tabs
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `${tabName}Tab`);
  });
}

// Check authentication status
async function checkAuthStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getAuthToken' });
    
    if (response.success) {
      document.getElementById('authStatus').textContent = 'Authenticated ✓';
      document.getElementById('authBtn').style.display = 'none';
    } else {
      document.getElementById('authStatus').textContent = 'Not authenticated';
      document.getElementById('authBtn').style.display = 'inline-block';
    }
  } catch (error) {
    console.error('Error checking auth:', error);
  }
}

// Authenticate user
async function authenticate() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'authenticate' });
    
    if (response.success) {
      showSuccess('Authentication successful!');
      checkAuthStatus();
    } else {
      showError('Authentication failed: ' + response.error);
    }
  } catch (error) {
    showError('Authentication error: ' + error.message);
  }
}

// Load settings
async function loadSettings() {
  const { settings } = await chrome.storage.local.get(['settings']);
  
  if (settings) {
    document.getElementById('enabledToggle').checked = settings.enabled !== false;
    
    if (settings.lastChecked) {
      const lastCheckedDate = new Date(settings.lastChecked);
      document.getElementById('lastChecked').textContent = formatDate(lastCheckedDate);
    }
  }
}

// Update settings
async function updateSettings(updates) {
  const { settings } = await chrome.storage.local.get(['settings']);
  const newSettings = { ...settings, ...updates };
  
  await chrome.storage.local.set({ settings: newSettings });
  showSuccess('Settings updated');
}

// Load rules
async function loadRules() {
  const { rules } = await chrome.storage.local.get(['rules']);
  currentRules = rules || [];
  renderRules();
}

// Render rules list
function renderRules() {
  const rulesList = document.getElementById('rulesList');
  
  if (currentRules.length === 0) {
    rulesList.innerHTML = `
      <div class="empty-state">
        <p>No rules configured yet</p>
        <p style="margin-top: 8px; font-size: 12px;">Click "New Rule" to create your first regex rule</p>
      </div>
    `;
    return;
  }

  rulesList.innerHTML = currentRules.map((rule, index) => `
    <div class="rule-item" data-rule-id="${rule.id}">
      <div class="rule-header">
        <div class="rule-name">${escapeHtml(rule.name)}</div>
        <div class="rule-actions">
          <button class="btn btn-icon" onclick="editRule('${rule.id}')">✏️</button>
          <button class="btn btn-icon" onclick="toggleRule('${rule.id}')">
            ${rule.enabled ? '⏸️' : '▶️'}
          </button>
          <button class="btn btn-icon" onclick="deleteRule('${rule.id}')">🗑️</button>
        </div>
      </div>
      
      ${renderRulePatterns(rule)}
      ${renderRuleActions(rule)}
      
      <div class="rule-enabled">
        <span class="status-dot ${rule.enabled ? '' : 'disabled'}"></span>
        ${rule.enabled ? 'Active' : 'Disabled'}
      </div>
    </div>
  `).join('');
}

// Render rule patterns
function renderRulePatterns(rule) {
  const patterns = [];
  
  if (rule.fromPattern) patterns.push(`From: ${rule.fromPattern}`);
  if (rule.toPattern) patterns.push(`To: ${rule.toPattern}`);
  if (rule.subjectPattern) patterns.push(`Subject: ${rule.subjectPattern}`);
  if (rule.bodyPattern) patterns.push(`Body: ${rule.bodyPattern}`);
  
  if (patterns.length === 0) return '';
  
  return `
    <div class="rule-patterns">
      ${patterns.map(p => `<span class="pattern-tag">${escapeHtml(p)}</span>`).join('')}
    </div>
  `;
}

// Render rule actions
function renderRuleActions(rule) {
  const actions = rule.actions || {};
  const actionsList = [];
  
  if (actions.addLabels?.length) {
    actionsList.push(`Add labels: ${actions.addLabels.join(', ')}`);
  }
  if (actions.removeLabels?.length) {
    actionsList.push(`Remove labels: ${actions.removeLabels.join(', ')}`);
  }
  if (actions.markAsRead) actionsList.push('Mark as read');
  if (actions.markAsImportant) actionsList.push('Mark as important');
  if (actions.star) actionsList.push('Star');
  if (actions.archive) actionsList.push('Archive');
  if (actions.trash) actionsList.push('Trash');
  
  if (actionsList.length === 0) return '';
  
  return `
    <div class="rule-details">
      Actions: ${escapeHtml(actionsList.join(', '))}
    </div>
  `;
}

// Save rule
async function saveRule(e) {
  e.preventDefault();
  
  const ruleId = document.getElementById('ruleId').value || generateId();
  const ruleName = document.getElementById('ruleName').value;
  
  const rule = {
    id: ruleId,
    name: ruleName,
    enabled: true,
    fromPattern: document.getElementById('fromPattern').value.trim(),
    toPattern: document.getElementById('toPattern').value.trim(),
    subjectPattern: document.getElementById('subjectPattern').value.trim(),
    bodyPattern: document.getElementById('bodyPattern').value.trim(),
    actions: {
      addLabels: parseCommaSeparated(document.getElementById('addLabels').value),
      removeLabels: parseCommaSeparated(document.getElementById('removeLabels').value),
      markAsRead: document.getElementById('markAsRead').checked,
      markAsImportant: document.getElementById('markAsImportant').checked,
      star: document.getElementById('star').checked,
      archive: document.getElementById('archive').checked,
      trash: document.getElementById('trash').checked
    }
  };

  // Validate at least one pattern
  if (!rule.fromPattern && !rule.toPattern && !rule.subjectPattern && !rule.bodyPattern) {
    showError('Please specify at least one pattern');
    return;
  }

  // Validate regex patterns
  try {
    if (rule.fromPattern) new RegExp(rule.fromPattern);
    if (rule.toPattern) new RegExp(rule.toPattern);
    if (rule.subjectPattern) new RegExp(rule.subjectPattern);
    if (rule.bodyPattern) new RegExp(rule.bodyPattern);
  } catch (error) {
    showError('Invalid regex pattern: ' + error.message);
    return;
  }

  // Save to storage
  const existingIndex = currentRules.findIndex(r => r.id === ruleId);
  
  if (existingIndex >= 0) {
    currentRules[existingIndex] = rule;
  } else {
    currentRules.push(rule);
  }

  await chrome.storage.local.set({ rules: currentRules });
  
  showSuccess('Rule saved successfully');
  await loadRules();
  switchTab('rules');
  resetForm();
}

// Edit rule
window.editRule = function(ruleId) {
  const rule = currentRules.find(r => r.id === ruleId);
  if (!rule) return;

  document.getElementById('formTitle').textContent = 'Edit Rule';
  document.getElementById('ruleId').value = rule.id;
  document.getElementById('ruleName').value = rule.name;
  document.getElementById('fromPattern').value = rule.fromPattern || '';
  document.getElementById('toPattern').value = rule.toPattern || '';
  document.getElementById('subjectPattern').value = rule.subjectPattern || '';
  document.getElementById('bodyPattern').value = rule.bodyPattern || '';
  
  const actions = rule.actions || {};
  document.getElementById('addLabels').value = (actions.addLabels || []).join(', ');
  document.getElementById('removeLabels').value = (actions.removeLabels || []).join(', ');
  document.getElementById('markAsRead').checked = actions.markAsRead || false;
  document.getElementById('markAsImportant').checked = actions.markAsImportant || false;
  document.getElementById('star').checked = actions.star || false;
  document.getElementById('archive').checked = actions.archive || false;
  document.getElementById('trash').checked = actions.trash || false;

  switchTab('create');
};

// Toggle rule
window.toggleRule = async function(ruleId) {
  const rule = currentRules.find(r => r.id === ruleId);
  if (!rule) return;

  rule.enabled = !rule.enabled;
  await chrome.storage.local.set({ rules: currentRules });
  
  await loadRules();
  showSuccess(`Rule ${rule.enabled ? 'enabled' : 'disabled'}`);
};

// Delete rule
window.deleteRule = async function(ruleId) {
  if (!confirm('Are you sure you want to delete this rule?')) return;

  currentRules = currentRules.filter(r => r.id !== ruleId);
  await chrome.storage.local.set({ rules: currentRules });
  
  await loadRules();
  showSuccess('Rule deleted');
};

// Reset form
function resetForm() {
  document.getElementById('formTitle').textContent = 'Create New Rule';
  document.getElementById('ruleForm').reset();
  document.getElementById('ruleId').value = '';
}

// Test rules
async function testRules() {
  const testEmail = {
    from: document.getElementById('testFrom').value,
    to: document.getElementById('testTo').value,
    subject: document.getElementById('testSubject').value,
    body: document.getElementById('testBody').value
  };

  if (!testEmail.from && !testEmail.to && !testEmail.subject && !testEmail.body) {
    showError('Please fill in at least one field');
    return;
  }

  const resultsDiv = document.getElementById('testResults');
  resultsDiv.innerHTML = '<p>Testing rules...</p>';

  const matchingRules = [];

  for (const rule of currentRules) {
    if (!rule.enabled) continue;

    const response = await chrome.runtime.sendMessage({
      action: 'testRule',
      rule: rule,
      email: testEmail
    });

    if (response.matches) {
      matchingRules.push(rule);
    }
  }

  if (matchingRules.length === 0) {
    resultsDiv.innerHTML = `
      <div class="test-result-item no-match">
        <div class="result-header">No matching rules</div>
        <div class="result-details">The test email doesn't match any active rules</div>
      </div>
    `;
  } else {
    resultsDiv.innerHTML = matchingRules.map(rule => `
      <div class="test-result-item match">
        <div class="result-header">✓ ${escapeHtml(rule.name)}</div>
        <div class="result-details">
          This rule would apply the following actions: ${renderRuleActions(rule)}
        </div>
      </div>
    `).join('');
  }
}

// Utility functions
function generateId() {
  return 'rule_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function parseCommaSeparated(value) {
  return value
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + ' minutes ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
  
  return date.toLocaleString();
}

function showSuccess(message) {
  // Create temporary success message
  const msg = document.createElement('div');
  msg.className = 'success-message show';
  msg.textContent = message;
  document.querySelector('.container').insertBefore(msg, document.querySelector('.container').firstChild);
  
  setTimeout(() => msg.remove(), 3000);
}

function showError(message) {
  // Create temporary error message
  const msg = document.createElement('div');
  msg.className = 'error-message show';
  msg.textContent = message;
  document.querySelector('.container').insertBefore(msg, document.querySelector('.container').firstChild);
  
  setTimeout(() => msg.remove(), 5000);
}

// Export rules to downloadable JSON file
async function exportRules(){
  const { rules } = await chrome.storage.local.get(['rules']);
  const blob = new Blob([JSON.stringify(rules||[], null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rules-export.json';
  a.click();
  URL.revokeObjectURL(url);
  showSuccess('Rules exported');
}

// Import rules from selected JSON file
async function importRules(){
  const fileInput = document.getElementById('importFile');
  const file = fileInput.files[0];
  if(!file){ showError('No file selected'); return; }
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    if(!Array.isArray(imported)) { showError('JSON must be an array'); return; }
    // Basic validation of rule fields
    const sanitized = imported.filter(r => r && typeof r === 'object').map(r => ({
      id: r.id || generateId(),
      name: r.name || 'Imported Rule',
      enabled: r.enabled !== false,
      fromPattern: r.fromPattern || '',
      toPattern: r.toPattern || '',
      subjectPattern: r.subjectPattern || '',
      bodyPattern: r.bodyPattern || '',
      actions: {
        addLabels: Array.isArray(r.actions?.addLabels) ? r.actions.addLabels : [],
        removeLabels: Array.isArray(r.actions?.removeLabels) ? r.actions.removeLabels : [],
        markAsRead: !!r.actions?.markAsRead,
        markAsImportant: !!r.actions?.markAsImportant,
        star: !!r.actions?.star,
        archive: !!r.actions?.archive,
        trash: !!r.actions?.trash
      }
    }));
    const { rules } = await chrome.storage.local.get(['rules']);
    const existing = rules || [];
    const merged = [...existing, ...sanitized];
    await chrome.storage.local.set({ rules: merged });
    showSuccess(`Imported ${sanitized.length} rules`);
    document.getElementById('importStatus').textContent = 'Import complete';
    await loadRules();
    switchTab('rules');
  } catch(e){
    showError('Failed to import: ' + e.message);
  }
}
