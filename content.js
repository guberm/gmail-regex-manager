// Content script for Gmail page — signals background when inbox row count changes.
// All email data is fetched via Gmail API in the background; no DOM parsing needed.

let lastEmailCount = 0;
let observer = null;

waitForGmailLoad().then(startMonitoring);

function waitForGmailLoad() {
  return new Promise((resolve) => {
    const id = setInterval(() => {
      if (document.querySelectorAll('[role="main"] tr[role="row"]').length > 0) {
        clearInterval(id);
        resolve();
      }
    }, 500);
  });
}

function startMonitoring() {
  notifyIfChanged();

  const targetNode = document.querySelector('[role="main"]');
  if (targetNode) {
    observer = new MutationObserver(() => notifyIfChanged());
    observer.observe(targetNode, { childList: true, subtree: true });
  }

  // Periodic fallback every 30 s
  setInterval(notifyIfChanged, 30000);
}

function notifyIfChanged() {
  const count = document.querySelectorAll('[role="main"] tr[role="row"]').length;
  if (count !== lastEmailCount) {
    lastEmailCount = count;
    chrome.runtime.sendMessage({ action: 'processEmails' });
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanEmails') {
    notifyIfChanged();
    sendResponse({ success: true });
  }
});

window.addEventListener('beforeunload', () => {
  if (observer) observer.disconnect();
});
