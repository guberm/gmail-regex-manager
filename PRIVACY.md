# Privacy Policy for Gmail Regex Rules Manager

**Last Updated:** November 8, 2025

## Introduction

Gmail Regex Rules Manager ("the Extension") is committed to protecting your privacy. This Privacy Policy explains how the Extension handles your data when you use it to automate email management in Gmail.

## Data Collection and Usage

### What Data Does the Extension Access?

The Extension requires access to the following Gmail data to function:

1. **Email Metadata:**
   - Sender email address (From field)
   - Recipient email address (To field)
   - Email subject line
   - Email body snippet (preview text)
   - Email labels
   - Email flags (read/unread, starred, important)

2. **Gmail Labels:**
   - Existing label names
   - Label IDs

### How Is Data Used?

All accessed data is used exclusively for the following purposes:

1. **Pattern Matching:** Email metadata is evaluated against your user-defined regex rules to determine if actions should be applied
2. **Action Execution:** Based on matching rules, the Extension performs actions like adding labels, marking as read, starring, archiving, or moving to trash
3. **Statistics:** Match counts and timestamps are stored locally to show rule effectiveness

### Data Storage

**Local Storage Only:**
- All user-created rules are stored locally in your browser using Chrome's storage API
- Settings and preferences are stored locally
- Performance statistics are stored locally
- **No data is transmitted to external servers**
- **No data is collected by the developer**

## Data Sharing and Third Parties

### No Third-Party Sharing

The Extension does **NOT**:
- Share any of your email data with third parties
- Send any data to external servers
- Include analytics or tracking code
- Contain advertisements
- Collect personal information for marketing

### Your OAuth Credentials

The Extension requires you to configure your own Google OAuth credentials:
- You create your own Google Cloud Project
- You generate your own OAuth Client ID
- You control API access through your Google account
- You can revoke access at any time through [Google Account Permissions](https://myaccount.google.com/permissions)

## Required Permissions

### Why Each Permission Is Needed

**storage**
- **Purpose:** Save your email rules, settings, and statistics locally in your browser
- **Scope:** Only accesses data created by this Extension

**identity**
- **Purpose:** Authenticate with your Google account to access Gmail API
- **Scope:** OAuth 2.0 authentication with your explicit consent

**alarms**
- **Purpose:** Schedule periodic checks for new emails at intervals you configure (1-60 minutes)
- **Scope:** No data access, only scheduling capability

**Host Permission: mail.google.com**
- **Purpose:** Monitor Gmail interface for new emails to enable real-time processing
- **Scope:** Read-only access to Gmail page to detect new emails

**Host Permission: www.googleapis.com**
- **Purpose:** Communicate with Gmail API to read email metadata and perform actions
- **Scope:** Limited to Gmail API endpoints, only actions you authorize through OAuth

## Gmail API Scopes

The Extension requests the following Gmail API scopes:

**gmail.modify**
- **Purpose:** Read email metadata and modify email properties (labels, read status, starred, etc.)
- **Limitations:** Cannot send emails, delete permanently, or access email content beyond snippets

**gmail.labels**
- **Purpose:** Create, read, update, and delete Gmail labels
- **Limitations:** Only affects labels, not email content

## Data Security

### How We Protect Your Data

1. **Local Processing:** All rule evaluation happens in your browser
2. **No Cloud Storage:** Nothing is stored on external servers
3. **OAuth Control:** You maintain full control through your Google account
4. **Open Source:** Code is publicly available for security review
5. **No External Dependencies:** No third-party services are used

### Your Controls

You have complete control over your data:

1. **Install/Uninstall:** You can remove the Extension at any time
2. **Revoke Access:** Revoke Gmail API access through [Google Account Permissions](https://myaccount.google.com/permissions)
3. **Clear Data:** Remove all locally stored rules and settings through the Extension's UI or Chrome settings
4. **Enable/Disable:** Turn off automatic processing without removing the Extension

## Children's Privacy

The Extension is not directed at children under 13 years of age. We do not knowingly collect information from children under 13. If you are under 13, please do not use this Extension.

## Open Source

This Extension is open source. You can:
- Review the source code: [GitHub Repository](https://github.com/guberm/gmail-regex-manager)
- Verify data handling practices
- Contribute improvements
- Report security concerns

## Changes to Privacy Policy

We may update this Privacy Policy from time to time. Changes will be posted:
- In the Extension's GitHub repository
- In the Chrome Web Store listing
- With an updated "Last Updated" date at the top of this policy

Significant changes will be announced through the Extension's release notes.

## Data Retention

**Local Storage:**
- Rules: Stored until you delete them or uninstall the Extension
- Settings: Stored until you change them or uninstall the Extension
- Statistics: Configurable retention (default: 50 entries, max: 500)

**On Uninstall:**
- All locally stored data is automatically removed by Chrome
- No data remains after uninstallation

## Your Rights (GDPR Compliance)

If you are in the European Union, you have the following rights:

1. **Right to Access:** View all data stored by the Extension (available in Extension UI)
2. **Right to Deletion:** Delete all data by uninstalling the Extension
3. **Right to Rectification:** Modify rules and settings at any time
4. **Right to Data Portability:** Export rules via the Export feature
5. **Right to Object:** Disable automatic processing while keeping rules stored

## California Privacy Rights (CCPA)

If you are a California resident:

1. **Right to Know:** This policy discloses all data accessed and used
2. **Right to Delete:** Uninstall the Extension to delete all local data
3. **Right to Opt-Out:** Disable automatic processing in settings
4. **No Sale of Data:** We do not sell your personal information

## Contact Information

For privacy concerns, questions, or requests:

- **GitHub Issues:** [Report an Issue](https://github.com/guberm/gmail-regex-manager/issues)
- **Email:** [Your support email]
- **Developer:** Michael Guber

## Transparency Commitment

We are committed to transparency:
- Complete source code is available on GitHub
- Privacy practices are clearly documented
- No hidden data collection
- User privacy is our top priority

## Legal Disclaimer

The Extension is provided "as is" without warranty. By using the Extension, you acknowledge:
- You have configured your own OAuth credentials
- You control access to your Gmail data
- The Extension processes emails according to rules you create
- You are responsible for the rules you configure

## Consent

By installing and using Gmail Regex Rules Manager, you consent to this Privacy Policy.

---

**Gmail Regex Rules Manager** is an independent project and is not affiliated with, endorsed by, or sponsored by Google LLC or Gmail.
