// Content script for Gmail page
console.log('Gmail Regex Manager content script loaded');

let lastEmailCount = 0;
let processedEmails = new Set();
let observer = null;

// Initialize when page loads
initialize();

function initialize() {
  console.log('Initializing Gmail monitor...');
  
  // Wait for Gmail to load
  waitForGmailLoad().then(() => {
    console.log('Gmail loaded, starting monitor');
    startMonitoring();
  });
}

// Wait for Gmail interface to load
function waitForGmailLoad() {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const emailElements = document.querySelectorAll('[role="main"] tr[role="row"]');
      if (emailElements.length > 0) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 500);
  });
}

// Start monitoring for new emails
function startMonitoring() {
  // Initial scan
  scanForNewEmails();
  
  // Set up MutationObserver to watch for DOM changes
  const targetNode = document.querySelector('[role="main"]');
  
  if (targetNode) {
    observer = new MutationObserver((mutations) => {
      // Check if new emails were added
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          scanForNewEmails();
          break;
        }
      }
    });
    
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
    
    console.log('Gmail monitoring started');
  }
  
  // Periodic scan every 30 seconds as backup
  setInterval(() => {
    scanForNewEmails();
  }, 30000);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanEmails') {
    scanForNewEmails();
    sendResponse({ success: true });
  }
});

// Scan for new emails
async function scanForNewEmails() {
  try {
    const emailRows = document.querySelectorAll('[role="main"] tr[role="row"]');
    const currentEmailCount = emailRows.length;
    
    // Check if there are new emails
    if (currentEmailCount > lastEmailCount || lastEmailCount === 0) {
      console.log(`Found ${currentEmailCount} emails (was ${lastEmailCount})`);
      
      const newEmails = [];
      
      for (const row of emailRows) {
        const emailData = extractEmailData(row);
        
        if (emailData && !processedEmails.has(emailData.id)) {
          newEmails.push(emailData);
          processedEmails.add(emailData.id);
        }
      }
      
      if (newEmails.length > 0) {
        console.log(`Processing ${newEmails.length} new emails`);
        
        // Send to background script for processing
        chrome.runtime.sendMessage({
          action: 'processEmails',
          emails: newEmails
        }, (response) => {
          if (response && response.success) {
            console.log(`Processed ${response.processed} emails with rules`);
          }
        });
      }
      
      lastEmailCount = currentEmailCount;
    }
  } catch (error) {
    console.error('Error scanning emails:', error);
  }
}

// Extract email data from Gmail DOM element
function extractEmailData(row) {
  try {
    // Get email ID from data attribute or generate one
    const emailId = row.getAttribute('data-message-id') || 
                    row.getAttribute('data-thread-id') || 
                    generateEmailId(row);
    
    // Extract from address
    const fromElement = row.querySelector('[email]');
    const from = fromElement ? 
                 (fromElement.getAttribute('email') || fromElement.textContent.trim()) : 
                 '';
    
    // Extract subject
    const subjectElement = row.querySelector('[data-thread-id] span[data-thread-id]') || 
                          row.querySelector('.bog span') ||
                          row.querySelector('span[data-legacy-thread-id]');
    const subject = subjectElement ? subjectElement.textContent.trim() : '';
    
    // Extract snippet/preview
    const snippetElement = row.querySelector('.y2');
    const snippet = snippetElement ? snippetElement.textContent.trim() : '';
    
    // Check if unread
    const isUnread = row.classList.contains('zE') || 
                     row.querySelector('.zE') !== null ||
                     row.querySelector('font[color="#000000"]') !== null;
    
    // Extract date
    const dateElement = row.querySelector('.xW span');
    const date = dateElement ? dateElement.getAttribute('title') || dateElement.textContent.trim() : '';
    
    return {
      id: emailId,
      from: from,
      to: extractToAddress(),
      subject: subject,
      body: snippet, // Gmail only shows snippet in list view
      snippet: snippet,
      isUnread: isUnread,
      date: date,
      element: row
    };
  } catch (error) {
    console.error('Error extracting email data:', error);
    return null;
  }
}

// Extract "to" address (current user's email)
function extractToAddress() {
  try {
    const profileElement = document.querySelector('[aria-label*="Google Account"]') ||
                          document.querySelector('.gb_d');
    
    if (profileElement) {
      const email = profileElement.getAttribute('aria-label') || '';
      const match = email.match(/[\w.-]+@[\w.-]+\.\w+/);
      return match ? match[0] : '';
    }
    
    return '';
  } catch (error) {
    return '';
  }
}

// Generate a unique email ID
function generateEmailId(row) {
  const from = row.querySelector('[email]');
  const subject = row.querySelector('.bog span');
  
  const fromText = from ? from.textContent : '';
  const subjectText = subject ? subject.textContent : '';
  
  return `${fromText}-${subjectText}-${Date.now()}`.replace(/\s/g, '-');
}

// Function to get full email content when needed
async function getFullEmailContent(emailId) {
  try {
    // Get auth token from background
    const tokenResponse = await chrome.runtime.sendMessage({ action: 'getAuthToken' });
    
    if (!tokenResponse.success) {
      console.error('Failed to get auth token');
      return null;
    }
    
    const token = tokenResponse.token;
    
    // Fetch full email from Gmail API
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}?format=full`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const emailData = await response.json();
    return emailData;
  } catch (error) {
    console.error('Error fetching full email:', error);
    return null;
  }
}

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  if (observer) {
    observer.disconnect();
  }
});
