# Chrome Web Store Listing Information

This document contains all the required information for submitting the Gmail Regex Manager extension to the Chrome Web Store.

## Product Details

### Extension Name
```
Gmail Regex Rules Manager
```

### Short Description (132 characters max)
```
Automate Gmail with powerful regex rules. Auto-label, archive, and organize emails as they arrive. Simple setup, powerful results.
```

### Detailed Description (16,000 characters max)

```
Gmail Regex Rules Manager - Powerful Email Automation for Gmail

Take control of your Gmail inbox with intelligent, regex-based automation. Create custom rules to automatically organize, label, and manage your emails as they arrive - no more manual sorting!

✨ KEY FEATURES

🎯 Powerful Pattern Matching
• Match emails by sender (From field)
• Match emails by recipient (To field)
• Match emails by subject line
• Match emails by email body/snippet
• Use regex patterns for precise matching
• Live Regex Helper for testing patterns in real-time

⚡ Automated Actions
• Automatically add or remove labels
• Mark emails as read/unread
• Star important emails
• Mark as important/not important
• Archive emails automatically
• Move to trash
• Combine multiple actions per rule

🔄 Real-Time Processing
• Monitors Gmail for new emails automatically
• Processes emails as they arrive
• Configurable scan interval (1-60 minutes)
• Works silently in the background
• Retry logic with exponential backoff
• Reliable and efficient processing

🎨 User-Friendly Interface
• Clean, intuitive popup interface
• Create rules with visual form builder
• Drag & drop to reorder rule priority
• Enable/disable individual rules
• Test rules before applying them
• Live regex pattern testing
• Import/export rules for backup

📊 Statistics & Performance
• Per-rule match statistics
• See how many emails each rule processed
• View last matched timestamp
• Performance metrics tab
• Processing time tracking
• Configurable data retention
• Copy stats to clipboard (TSV format)

⚙️ Advanced Settings
• Adjustable log levels (error/warn/info/debug)
• Configurable processing interval
• Performance data retention control
• Auto-processing toggle
• Easy OAuth configuration

⌨️ Keyboard Shortcuts
• Ctrl+N - Create new rule
• Ctrl+T - Jump to test tab
• Ctrl+S - Save current rule
• Esc - Cancel editing

🔒 PRIVACY & SECURITY

Your data, your control:
• Extension requires your own Google OAuth credentials
• You maintain full control of API access
• No third-party servers involved
• All processing happens locally in your browser
• Open source - review the code yourself
• You can revoke access anytime

GETTING STARTED

1. Set Up OAuth Credentials
   • Follow our detailed OAUTH_SETUP guide
   • Create your own Google Cloud Project (free)
   • Get your OAuth Client ID
   • Configure the extension with your credentials

2. Create Your First Rule
   • Click the extension icon
   • Go to "Create Rule" tab
   • Enter a name (e.g., "Newsletters")
   • Add regex patterns (e.g., From: ".*newsletter.*")
   • Choose actions (e.g., Add label "Newsletters", Mark as read)
   • Click Save

3. Test Your Rules
   • Use the "Test" tab to verify rules work correctly
   • Live Regex Helper shows real-time pattern matching
   • See which rules match your sample emails

4. Enjoy Automation!
   • Extension monitors Gmail automatically
   • New emails are processed based on your rules
   • Check the Stats tab to see activity

COMMON USE CASES

📰 Newsletter Management
Pattern: From contains "newsletter|subscribe|unsubscribe"
Actions: Label as "Newsletters", Mark as read, Archive

🚨 Urgent Emails
Pattern: Subject contains "urgent|asap|important"
Actions: Star, Mark as important, Label as "Priority"

💼 Work Emails
Pattern: From contains "@yourcompany.com"
Actions: Label as "Work", Keep in inbox

🤖 Automated Notifications
Pattern: From contains "noreply|no-reply|notifications"
Actions: Label as "Automated", Archive, Mark as read

🛍️ Shopping & Receipts
Pattern: Subject contains "receipt|order|invoice|shipment"
Actions: Label as "Shopping", Label as "Receipts"

🗑️ Spam Management
Pattern: Body contains specific spam keywords
Actions: Mark as read, Move to trash

REQUIREMENTS

• Chrome browser (version 88+)
• Gmail account
• Google Cloud Project (free to create)
• OAuth 2.0 credentials (follow our setup guide)

PERMISSIONS EXPLAINED

• Storage - Save your rules and settings locally
• Identity - Authenticate with your Google account
• Alarms - Schedule periodic email checks
• Gmail API - Read and modify your emails (via OAuth)

SUPPORT & DOCUMENTATION

📖 Complete documentation included:
• OAUTH_SETUP.md - Step-by-step credential setup
• QUICKSTART.md - Get started in 5 minutes  
• CHANGELOG.md - Version history
• TROUBLESHOOTING.md - Common issues and solutions
• Example rules - 10 pre-built patterns to import

🐛 Found a bug or have a suggestion?
Visit our GitHub repository to report issues or request features.

TECHNICAL DETAILS

• Built with Chrome Extension Manifest V3
• Uses Gmail API for reliable access
• Service worker architecture for efficiency
• Comprehensive error handling and retry logic
• Structured logging with adjustable verbosity
• Performance tracking and optimization
• 19 automated tests ensuring quality

VERSION HISTORY

v1.1.0 - Latest Release
• OAuth configuration UI with setup guide
• Live regex pattern testing
• Keyboard shortcuts system
• Per-rule statistics tracking
• Drag & drop rule ordering
• Copy stats to clipboard
• Configurable settings (interval, retention, log levels)
• Visual polish and animations
• Comprehensive documentation

v1.0.0 - Initial Release
• Regex-based email matching
• Automated actions (label, read, star, archive, trash)
• Real-time email monitoring
• Rule management UI
• Import/export functionality

OPEN SOURCE

This extension is open source! Review the code, contribute improvements, or fork it for your own needs. We welcome community contributions.

Made with ❤️ for productivity enthusiasts who want to master their inbox.

---

Keywords: gmail, email automation, regex, rules, labels, productivity, inbox management, email filtering, automation, organize
```

## Store Listing Assets

### Category
```
Productivity
```

### Language
```
English (United States)
```

### Small Promo Tile (440x280 pixels - PNG)
**Description:** Create an image with:
- Background: Gradient blue (#4285f4 to #1a73e8)
- Icon: Large Gmail icon with regex symbol overlay
- Text: "Gmail Regex Manager" in white bold font
- Tagline: "Automate Your Inbox" in smaller white text

### Marquee Promo Tile (1400x560 pixels - PNG) - Optional but recommended
**Description:** Create an image with:
- Left side: Screenshots of the extension popup showing rule creation
- Right side: Large text explaining key features
- Background: Professional gradient
- Include: "Powerful Email Automation" as headline

### Screenshots (1280x800 or 640x400 pixels - PNG or JPEG)

#### Screenshot 1: Main Interface
**Caption:** Clean, intuitive interface for creating and managing email rules
**Content:** Show the main popup with the Rules tab active, displaying several example rules with enable/disable toggles

#### Screenshot 2: Creating a Rule
**Caption:** Create powerful rules with regex patterns for precise email matching
**Content:** Show the Create Rule tab with a form filled out (e.g., newsletter rule with pattern and actions)

#### Screenshot 3: Live Regex Helper
**Caption:** Test your patterns in real-time with the Live Regex Helper
**Content:** Show the regex helper panel with sample email fields and pattern matching feedback

#### Screenshot 4: Statistics Dashboard
**Caption:** Track performance with detailed statistics for each rule
**Content:** Show the Stats tab with processing metrics, per-rule counts, and performance data

#### Screenshot 5: OAuth Configuration
**Caption:** Easy OAuth setup with step-by-step guidance
**Content:** Show the configuration modal with setup instructions and status indicator

### Video (Optional but highly recommended)
**Duration:** 30-60 seconds
**Content:**
1. Problem: Show cluttered Gmail inbox (5 sec)
2. Solution: Open extension, create a simple rule (15 sec)
3. Result: Show emails being automatically organized (10 sec)
4. Features: Quick showcase of drag-drop, stats, regex helper (20 sec)
5. CTA: "Get started today - it's free!" (5 sec)

## Privacy Information

### Single Purpose Description
```
This extension automates Gmail email management using user-defined regex-based rules to automatically label, archive, star, and organize incoming emails.
```

### Permission Justifications

**storage**
```
Required to save user-created email rules, settings, and performance statistics locally in the browser.
```

**Detailed Justification for storage:**
```
The storage permission is used exclusively to store user configuration data locally in the browser using Chrome's storage.local API. Specifically:

1. User-created regex rules (patterns, actions, enabled/disabled state)
2. Extension settings (processing interval, log level, performance retention)
3. Per-rule statistics (match count, last matched timestamp)
4. Performance metrics (processing times, duration tracking)

All data is stored locally on the user's device. No data is transmitted to external servers. The extension does not access any storage from other extensions or websites. Data can be cleared by the user at any time through the extension's UI or by uninstalling the extension.

Storage usage is minimal (typically < 1MB) and contains only configuration data that the user explicitly creates through the extension's interface.
```

**identity**
```
Required to authenticate users with their Google account via OAuth 2.0 to access Gmail API with user consent.
```

**Detailed Justification for identity:**
```
The identity permission is required to use Chrome's chrome.identity.getAuthToken() API for OAuth 2.0 authentication with Google. This is necessary because:

1. The extension needs to access Gmail data via the Gmail API
2. Users must authenticate and explicitly grant permission to access their Gmail
3. OAuth 2.0 is the secure, industry-standard method for API authentication
4. Chrome's identity API handles the OAuth flow securely within the browser

Important: Users must configure their own OAuth Client ID (from Google Cloud Console). The extension does not use a shared or developer-controlled Client ID. This means:
- Each user maintains full control over API access
- Users can revoke access anytime through Google Account settings
- No central authentication server is used
- The developer cannot access user Gmail data

The identity permission is used only for the initial authentication and token refresh. No identity information is stored beyond the OAuth token required for Gmail API access.
```

**alarms**
```
Required to schedule periodic checks for new emails at user-configured intervals (1-60 minutes) for automatic email processing.
```

**Detailed Justification for alarms:**
```
The alarms permission is used to schedule periodic background tasks using Chrome's chrome.alarms API. This is essential for the extension's core functionality:

1. Automatically check Gmail for new emails at regular intervals
2. User configures the check interval (default: 1 minute, range: 1-60 minutes)
3. When alarm triggers, extension processes new emails against user-defined rules
4. Alarms persist across browser sessions for continuous automation

The alarms API is specifically designed for extensions that need to perform periodic tasks efficiently without keeping the service worker constantly active, which would drain system resources.

The extension does not use alarms for any other purpose (no tracking, no telemetry, no external network calls). Alarm frequency is fully under user control via the settings UI. Users can disable automatic processing entirely while keeping their rules stored.

Technical note: Chrome enforces a minimum alarm interval of 1 minute for non-packed extensions, and the extension respects this limitation.
```

**host_permissions - mail.google.com**
```
Required to monitor Gmail interface for new emails and provide real-time processing capabilities.
```

**Detailed Justification for host_permissions (mail.google.com):**
```
This host permission allows the extension to inject a content script into the Gmail web interface. This is required for:

1. Real-time detection of new emails arriving in Gmail
2. Monitoring the Gmail DOM to identify when emails are added to the inbox
3. Triggering rule processing when new emails are detected
4. Providing immediate automation without waiting for the next scheduled alarm

The content script:
- Only runs on mail.google.com domain (Gmail)
- Uses read-only DOM observation (MutationObserver API)
- Does NOT modify Gmail's interface or functionality
- Does NOT intercept or modify email content
- Does NOT inject advertisements or tracking code
- Communicates with the service worker only to trigger rule processing

Without this permission, the extension would have to rely solely on periodic alarms, which would delay email processing by up to 60 minutes. The content script enables near-instant automation when emails arrive.

The content script does not access other Google services or non-Gmail pages.
```

**host_permissions - www.googleapis.com**
```
Required to communicate with Gmail API to read email metadata (subject, sender, recipient, body snippets) and perform user-defined actions (add labels, mark as read, star, archive, trash).
```

**Detailed Justification for host_permissions (www.googleapis.com):**
```
This host permission allows the extension to make API calls to the Gmail API endpoint (www.googleapis.com/gmail/v1/). This is the core functionality of the extension:

API calls made:
1. GET /gmail/v1/users/me/messages - List emails matching search criteria
2. GET /gmail/v1/users/me/messages/{id} - Read email metadata (subject, from, to, snippet)
3. POST /gmail/v1/users/me/messages/{id}/modify - Add/remove labels, read status, star status
4. GET /gmail/v1/users/me/labels - List available labels
5. POST /gmail/v1/users/me/labels - Create new labels when needed

Data accessed from emails:
- Sender email address (From field)
- Recipient email address (To field)  
- Subject line
- Email snippet/preview (first ~200 characters of body)
- Current labels
- Read/unread status
- Star status
- Important flag

Data NOT accessed:
- Full email body (only snippets are retrieved)
- Email attachments
- Email headers beyond From/To/Subject
- Contact information
- Calendar data
- Drive files
- Other Google services

All API calls:
- Use OAuth 2.0 authentication with user-configured credentials
- Are made only when processing rules (on alarm trigger or new email detection)
- Are rate-limited to prevent excessive API usage
- Include retry logic with exponential backoff for reliability
- Do not send data to any server other than Google's official API endpoints

The extension does not use googleapis.com for any purpose other than Gmail API access. No tracking, analytics, or external service integration.

Required Gmail API scopes (explicitly granted by user during OAuth):
- gmail.modify: Read and modify email properties
- gmail.labels: Create and manage labels
```

### Privacy Policy URL
```
https://github.com/guberm/gmail-regex-manager/blob/main/PRIVACY.md
```

### Remote Code Justification (if asked)
```
This extension does NOT use remote code. All code is packaged within the extension and runs locally in the browser. No external scripts, libraries, or code are loaded at runtime.
```

### Data Usage

**What data is collected?**
```
None. The extension does not collect, transmit, or store any user data outside of the user's local browser storage. All email processing happens locally.
```

**Detailed Data Collection Statement:**
```
The extension collects and processes ZERO user data for external purposes. Specifically:

Data NOT collected:
- No personal information (name, email address, phone, etc.)
- No email content beyond what's needed for rule matching
- No browsing history or activity tracking
- No location data
- No device information
- No user credentials (OAuth tokens are managed by Chrome's identity API)
- No analytics, telemetry, or usage statistics
- No crash reports or error logs sent externally

Data that IS accessed (locally only):
- Email metadata (sender, recipient, subject, snippet) - accessed via Gmail API, evaluated against rules, then discarded
- User-created rules - stored locally in browser storage
- Extension settings - stored locally in browser storage
- Rule statistics (match count, timestamp) - stored locally in browser storage

All accessed data remains on the user's device. The extension has no backend server, no database, and no external data collection infrastructure.
```

**How is data used?**
```
Email metadata (sender, recipient, subject, body snippets) is read via Gmail API solely to evaluate against user-defined rules and execute automated actions. No data is sent to external servers.
```

**Detailed Data Usage Statement:**
```
Email data accessed from Gmail API is used exclusively for the following purposes:

1. Pattern Matching:
   - Email metadata is compared against user-defined regex patterns
   - Matching happens entirely in the browser's JavaScript runtime
   - Email data is held in memory only during rule evaluation (seconds)
   - No email content is persisted to storage

2. Action Execution:
   - When rules match, the extension calls Gmail API to perform actions
   - Actions are limited to: add/remove labels, mark read/unread, star/unstar, archive, trash
   - Actions are performed via authenticated API calls using user's OAuth token
   - No email content is modified, only metadata/flags

3. Statistics:
   - Rule match count is incremented (stored locally)
   - Timestamp of last match is recorded (stored locally)
   - Processing performance metrics are tracked (stored locally)
   - No personally identifiable information is included in statistics

Data flow:
Gmail API → Extension Memory → Rule Evaluation → Gmail API (for actions) → Memory Cleared

Data is NEVER:
- Sent to external servers
- Stored permanently (only statistics, not email content)
- Shared with third parties
- Used for advertising or profiling
- Transmitted over network except to/from Gmail API
- Accessible to other extensions or websites
```

**Is data shared with third parties?**
```
No. All data remains on the user's device. The extension requires users to configure their own OAuth credentials, ensuring they maintain full control over API access.
```

**Detailed Data Sharing Statement:**
```
The extension shares ZERO data with third parties. Here's the complete picture:

Third-party services used: NONE
- No analytics services (Google Analytics, etc.)
- No crash reporting services
- No advertising networks
- No social media integrations
- No content delivery networks (all code is packaged)
- No backend APIs or web services

Data transmission:
- ONLY to Google's official Gmail API endpoints (www.googleapis.com/gmail/v1/)
- Uses user's own OAuth credentials (configured by user)
- Encrypted in transit (HTTPS)
- Standard Gmail API authentication and authorization

Developer access:
- Developer has ZERO access to user data
- No central authentication server
- No shared API credentials
- Each user configures their own OAuth Client ID
- Users can revoke access anytime via Google Account settings

Open source transparency:
- Full source code available on GitHub
- Anyone can verify no external data transmission
- No obfuscated or minified code in submission
- All network requests are to Gmail API only

Legal entity data sharing: NONE
- No sale of data
- No rental of data
- No licensing of data
- No data brokers
- No marketing partners
- No affiliate programs involving data

The extension is a purely local tool that interfaces only with Gmail API on behalf of the user.
```

## Certification and Compliance

### Single Purpose Certification
```
This extension has ONE clear purpose: Automate Gmail email management using regex-based rules.

All features directly support this purpose:
✓ Create rules with regex patterns
✓ Match emails against patterns
✓ Execute automated actions (label, archive, star, etc.)
✓ Monitor Gmail for new emails
✓ Track rule statistics
✓ Configure settings

No secondary purposes:
✗ No browsing history tracking
✗ No web scraping or data harvesting
✗ No cryptocurrency mining
✗ No advertising or marketing
✗ No social features or sharing
✗ No unrelated utilities or tools
```

### User Data Handling Certification
```
I certify that:
1. This extension does NOT collect, transmit, or sell user data
2. All data processing happens locally in the user's browser
3. Users configure their own OAuth credentials (no shared credentials)
4. Email data is accessed only for rule evaluation and action execution
5. No email content is stored (only user-created rules and statistics)
6. The extension is open source and independently verifiable
7. Privacy policy accurately describes all data handling practices
8. GDPR and CCPA compliance measures are implemented
9. Users have full control over all data and can delete it anytime
10. No third-party services receive any user data
```

### Prohibited Content Certification
```
I certify that this extension does NOT contain:
✗ Malware, viruses, or malicious code
✗ Deceptive or misleading functionality
✗ Obfuscated or hidden code
✗ Remote code execution
✗ Cryptocurrency mining
✗ Unauthorized data collection
✗ Clickjacking or UI redressing
✗ Spam or unsolicited messaging
✗ Copyright infringing content
✗ Adult or explicit content
✗ Violence or hate speech
✗ Illegal activities or content
```

### Manifest V3 Compliance
```
This extension fully complies with Chrome Extension Manifest V3:
✓ Uses service worker (not background page)
✓ No remotely hosted code
✓ Declarative permissions model
✓ Follows best security practices
✓ Uses chrome.identity for OAuth
✓ Minimal permissions requested
✓ All code is reviewable in package
```

## Developer Information

### Developer Name/Publisher
```
Michael Guber
```

### Developer Email
```
[Your email address for Chrome Web Store verification]
```

### Developer Website
```
https://github.com/guberm/gmail-regex-manager
```

### Support Email
```
[Your support email address]
```

### Support URL
```
https://github.com/guberm/gmail-regex-manager/issues
```

## Pricing & Distribution

### Pricing
```
Free
```

### Visibility
```
Public
```

### Regions
```
All regions (worldwide)
```

## Additional Information

### What's New in This Version (v1.1.0)
```
🎉 Major Feature Update!

✨ New Features:
• OAuth Configuration UI - Easy setup with step-by-step guide
• Live Regex Helper - Test patterns in real-time with visual feedback
• Keyboard Shortcuts - Ctrl+N, Ctrl+T, Ctrl+S for faster workflow
• Per-Rule Statistics - See match counts and last matched timestamps
• Drag & Drop Ordering - Prioritize rules by dragging handles

⚙️ Enhanced Settings:
• Configurable processing interval (1-60 minutes)
• Adjustable log levels (error/warn/info/debug)
• Performance data retention control (5-500 entries)
• Copy statistics to clipboard (TSV format)

📚 Documentation:
• Complete OAuth setup guide (OAUTH_SETUP.md)
• Quick start guide (QUICKSTART.md)
• Comprehensive troubleshooting guide
• 10 example rules ready to import

🐛 Fixes & Improvements:
• Improved error handling and retry logic
• Better performance tracking
• Visual polish with animations and tooltips
• Fixed test suite (19 tests passing)
• CI/CD pipeline improvements

All features work locally - your privacy is protected! 🔒
```

### Mature Content
```
No
```

### Ads
```
No
```

### Cryptocurrency
```
No - This extension does not use, mine, or promote cryptocurrency
```

## Required Files to Create

### 1. PRIVACY.md (Privacy Policy)
Create this file in your repository with standard privacy policy content explaining:
- What data is accessed (email metadata)
- How it's used (local rule evaluation)
- What's stored (rules, settings - all local)
- No third-party sharing
- User control via OAuth
- Right to revoke access

### 2. Promotional Images
You'll need to create:
- **Small tile:** 440x280 PNG
- **Large tile (optional):** 1400x560 PNG  
- **Screenshots:** At least 1, recommended 5 (1280x800 or 640x400)

## Pre-Submission Checklist

- [ ] Zip file created and tested
- [ ] All promotional images prepared
- [ ] Privacy policy published at specified URL
- [ ] Support email configured and monitored
- [ ] OAuth setup guide is accurate and complete
- [ ] Extension tested in fresh Chrome installation
- [ ] Screenshots show actual functionality
- [ ] Description is accurate and complete
- [ ] Version number matches manifest.json
- [ ] All links work correctly

## Submission Steps

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay one-time $5 developer registration fee (if first submission)
4. Click "New Item"
5. Upload the zip file from `dist/gmail-regex-manager-v1.1.0.zip`
6. Fill in all store listing information from this document
7. Upload promotional images and screenshots
8. Fill in privacy information
9. Submit for review
10. Wait for approval (typically 1-3 days)

## Post-Approval

After approval:
- Update README.md with Chrome Web Store link
- Add store badge to GitHub repository
- Announce on relevant communities
- Monitor reviews and support requests
- Plan next version based on user feedback
