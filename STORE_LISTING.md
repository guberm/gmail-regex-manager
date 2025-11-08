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

**identity**
```
Required to authenticate users with their Google account via OAuth 2.0 to access Gmail API with user consent.
```

**alarms**
```
Required to schedule periodic checks for new emails at user-configured intervals (1-60 minutes) for automatic email processing.
```

**host_permissions - mail.google.com**
```
Required to monitor Gmail interface for new emails and provide real-time processing capabilities.
```

**host_permissions - www.googleapis.com**
```
Required to communicate with Gmail API to read email metadata (subject, sender, recipient, body snippets) and perform user-defined actions (add labels, mark as read, star, archive, trash).
```

### Privacy Policy URL
```
https://github.com/guberm/gmail-regex-manager/blob/main/PRIVACY.md
```
*Note: You'll need to create this file - see template below*

### Data Usage

**What data is collected?**
```
None. The extension does not collect, transmit, or store any user data outside of the user's local browser storage. All email processing happens locally.
```

**How is data used?**
```
Email metadata (sender, recipient, subject, body snippets) is read via Gmail API solely to evaluate against user-defined rules and execute automated actions. No data is sent to external servers.
```

**Is data shared with third parties?**
```
No. All data remains on the user's device. The extension requires users to configure their own OAuth credentials, ensuring they maintain full control over API access.
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
