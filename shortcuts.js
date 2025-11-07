// Keyboard shortcuts for Gmail Regex Manager

// Global shortcuts map
const shortcuts = {
  'ctrl+n': () => {
    document.querySelector('[data-tab="create"]')?.click();
    document.getElementById('ruleName')?.focus();
  },
  'ctrl+t': () => {
    document.querySelector('[data-tab="test"]')?.click();
    document.getElementById('testFrom')?.focus();
  },
  'ctrl+s': (e) => {
    e.preventDefault();
    const form = document.getElementById('ruleForm');
    if (form && document.getElementById('createTab').classList.contains('active')) {
      form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  },
  'esc': () => {
    if (document.getElementById('createTab').classList.contains('active')) {
      document.getElementById('cancelBtn')?.click();
    }
  }
};

// Setup keyboard shortcuts
export function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const key = [];
    if (e.ctrlKey) key.push('ctrl');
    if (e.shiftKey) key.push('shift');
    if (e.altKey) key.push('alt');
    key.push(e.key.toLowerCase());
    
    const shortcut = key.join('+');
    const handler = shortcuts[shortcut];
    
    if (handler) {
      handler(e);
    }
  });
}

// Initialize when loaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKeyboardShortcuts);
  } else {
    initKeyboardShortcuts();
  }
}
