# Gmail Regex Rules Manager

![Validate Extension](https://github.com/guberm/gmail-regex-manager/actions/workflows/validate.yml/badge.svg)
![CI Tests](https://github.com/guberm/gmail-regex-manager/actions/workflows/ci.yml/badge.svg)

A powerful Chrome extension that automatically manages your Gmail emails using regex-based rules. Set up custom patterns to automatically label, archive, mark as read, and perform other actions on incoming emails.

## Features

✨ **Regex Pattern Matching**
- Match emails by sender (From), recipient (To), subject, or body/snippet
- **Live Regex Helper** — test patterns in real-time as you type
- All patterns are case-insensitive

🎯 **Automated Actions**
- Add or remove labels (with autocomplete from your existing labels)
- Mark as read/unread, mark as important, star
- Archive or move to trash
- **Apply to already-read emails** — optionally scan the last 30 days, not just new mail

⚡ **Reliable Email Processing**
- Fetches emails via **Gmail API** — not fragile DOM scraping
- Processes new mail automatically on a configurable interval (1-60 min)
- **▶ Run Now** button for instant manual trigger
- Works in the background even when Gmail isn't the active tab
- Retry logic with exponential backoff

🎨 **User-Friendly Side Panel**
- Opens as a **Chrome side panel** — stays visible while you use Gmail
- Easy rule creation, editing, and drag & drop reordering
- **Label autocomplete** — pick from existing labels or create new ones (with sub-label support) right from the rule form
- Test rules before applying; enable/disable individually
- **Per-rule match statistics** (count & last matched)

📊 **Observability**
- **Log tab** — live activity log with color-coded entries (error/warn/info/debug), up to 300 entries
- **Stats tab** — processing metrics per run (emails scanned, matches, duration)
- Adjustable log levels and configurable retention
- Import/export rules for backup/sharing

## Installation

> **📋 Important:** This extension requires your own Google OAuth credentials to access Gmail. Follow the setup guide below.

### Quick Setup

1. **Get OAuth Credentials** - Follow our [detailed OAuth setup guide](OAUTH_SETUP.md)
2. **Configure the extension** - Upload your JSON file in the popup (easiest) or edit manually
3. **Load in Chrome** - Install as an unpacked extension

### Method 1: Upload OAuth JSON in the Popup (Recommended — no file editing)

1. Download or clone this repository and load it in Chrome (see [Load Extension in Chrome](#load-extension-in-chrome) below)
2. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/) — see [OAUTH_SETUP.md](OAUTH_SETUP.md)
3. When downloading the credentials, click **"Download JSON"** (the `client_secret_*.json` file)
4. Click the extension icon, then click the **⚙️** button in the header
5. Under **"Upload OAuth Client JSON"**, select the downloaded JSON file
6. The Client ID is saved automatically — click **Sign In** to authenticate

No manifest.json editing or extension reload required.

### Method 2: Using the Helper Script

```bash
# Install dependencies
npm install

# Configure your OAuth Client ID
npm run config YOUR_CLIENT_ID.apps.googleusercontent.com
```

### Method 3: Manual Configuration

1. Download or clone this repository
2. Open `manifest.json` in a text editor
3. Find the `oauth2` section at the bottom
4. Replace `YOUR_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID

```json
"oauth2": {
  "client_id": "YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.labels"
  ]
}
```

### Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the extension folder
5. Click the extension icon and **Sign In** to authenticate

### Need Help?

- 📖 [Complete OAuth Setup Guide](OAUTH_SETUP.md) - Step-by-step instructions with troubleshooting
- 🚀 [Quick Start Guide](QUICKSTART.md) - Get started in 5 minutes
- ❓ Check the [Troubleshooting Guide](TROUBLESHOOTING.md) for common issues

---

### Old Installation Section (For Reference)

<details>
<summary>Click to expand detailed manual setup</summary>

### Step 1: Set up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Gmail API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Chrome Extension" as application type
   - Copy your Chrome Extension ID (you'll get this after loading the extension)
   - Add authorized redirect URIs:
     - `https://<extension-id>.chromiumapp.org/`
   - Click "Create"
   - Copy the **Client ID**

### Step 2: Configure the Extension

1. Download or clone this repository
2. Open `manifest.json`
3. Replace `YOUR_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID from Step 1

```json
"oauth2": {
  "client_id": "YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com",
  "scopes": [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.labels"
  ]
}
```

</details>

### Step 3: Load the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `gmail-regex-manager` folder
5. Note the Extension ID shown on the extension card
6. Go back to Google Cloud Console and update your OAuth credentials with this Extension ID

### Step 4: Authenticate

1. Click the extension icon in Chrome
2. Click "Sign In" button
3. Authorize the extension to access your Gmail
4. You're ready to create rules!

## Usage

### Creating a Rule

1. Click the extension icon
2. Go to the "Create Rule" tab
3. Give your rule a name (e.g., "Newsletter Filter")
4. Set up patterns:
   - **From Pattern**: Regex to match sender email
   - **Subject Pattern**: Regex to match subject line
   - **Body Pattern**: Regex to match email content
   - **Live Regex Helper**: Type sample values below each pattern to see live matches
5. Choose actions:
   - Add labels (comma-separated)
   - Mark as read
   - Archive
   - etc.
6. Click "Save Rule"

### Live Regex Helper

The Create Rule tab includes a live testing panel:
- Enter sample From, To, Subject, and Body values
- As you type patterns, see instant feedback
- ✔ Green = pattern matches sample
- ✖ Red = pattern doesn't match
- Yellow = regex syntax error
- Empty pattern fields show as gray "—"

This helps you validate patterns before saving the rule.

### Rule Priority & Ordering

Rules are evaluated in the order shown on the Rules tab. **Drag and drop** rules using the ☰ handle to reorder them. Higher priority rules run first. Reordering is saved automatically.

### Per-Rule Statistics

Each rule card displays:
- **Matches**: Total number of times the rule has matched
- **Last**: Timestamp of the most recent match

Statistics help you understand which rules are actively processing emails.

### Example Rules

#### Filter Newsletters
```
Name: Newsletter Filter
From Pattern: .*@newsletter\.com|.*@marketing\..*
Actions: Add Label "Newsletters", Mark as Read, Archive
```

#### Urgent Emails
```
Name: Urgent Marker
Subject Pattern: ^\[URGENT\].*|^URGENT:.*
Actions: Add Label "Urgent", Mark as Important, Star
```

#### Invoice Tracker
```
Name: Invoice Detector
Subject Pattern: .*(invoice|receipt|payment).*
Body Pattern: .*(invoice|payment|bill).*
Actions: Add Label "Finance/Invoices"
```

#### GitHub Notifications
```
Name: GitHub Filter
From Pattern: notifications@github\.com
Subject Pattern: ^\[.*\].*
Actions: Add Label "GitHub", Archive
```

### Regex Tips

- `.` - matches any character
- `.*` - matches any characters (zero or more)
- `^` - start of string
- `$` - end of string
- `|` - OR operator
- `\` - escape special characters
- `[abc]` - matches a, b, or c
- `[a-z]` - matches any lowercase letter
- `\d` - matches any digit
- `\w` - matches word characters

**Case Insensitive**: All patterns are automatically case-insensitive.

### Testing Rules

1. Go to the "Test" tab
2. Enter sample email data (from, to, subject, body)
3. Click "Test Against All Rules"
4. See which rules would match your test email

### Settings

The top of the popup includes configuration options:

- **Auto-process emails**: Toggle to enable/disable automatic processing
- **Log Level**: Choose verbosity (error, warn, info, debug)
- **Processing Interval**: Set scan frequency in minutes (minimum 1 minute due to Chrome alarm API limits)
  - Lower values = more responsive but higher CPU/network usage
  - Default: 1 minute
- **Perf Retention**: Maximum number of performance entries to store (5-500)
  - Default: 50 entries

Interval changes take effect immediately and reschedule the background alarm.

### OAuth Configuration (⚙️ button)

Click the **⚙️** button next to "Sign In" to open the OAuth Configuration modal:

- **Current Configuration Status** — shows whether a Client ID is configured
- **Upload OAuth Client JSON** — select the `client_secret_*.json` file downloaded from Google Cloud Console; the Client ID is extracted and saved automatically, and used on the next Sign In click
- **View Full Setup Guide** — opens the detailed OAuth setup guide

## How It Works

1. **Content Script**: Watches for inbox row-count changes and signals the background worker when new mail arrives
2. **Background Service Worker**: On each alarm tick (or manual ▶ trigger), fetches recent inbox messages via Gmail API, matches them against active rules, and applies actions — no DOM parsing involved
3. **Gmail API**: Used for all email fetching (`messages.list` + `messages.get`) and actions (`messages.modify`, label create/add/remove); ensures correct message IDs and accurate headers
4. **Storage**: Rules, settings, and the activity log are stored locally using Chrome's storage API
5. **Performance Tracking**: Records metrics for each processing run (configurable retention, visible in Stats tab)
6. **Logging**: Structured, persistent log (up to 300 entries) with adjustable verbosity, visible in the Log tab

## Permissions

The extension requires the following permissions:

- `storage` - Store rules and settings locally
- `identity` - Authenticate with Google
- `alarms` - Periodic email checking
- Gmail API scopes:
  - `gmail.modify` - Modify emails (labels, read status, etc.)
  - `gmail.labels` - Manage labels

## Troubleshooting

### Extension not processing emails
- Make sure the extension is authenticated (click "Sign In")
- Check that auto-process is enabled in the extension popup
- Verify that Gmail is open in at least one tab

### Rules not matching
- Use the "Test" tab to verify your regex patterns
- Check that patterns are properly escaped
- Remember patterns are case-insensitive

### Authentication fails
- Verify Client ID is correctly configured in manifest.json
- Make sure Gmail API is enabled in Google Cloud Console
- Check that OAuth consent screen is properly configured

### Labels not appearing
- Labels are created automatically if they don't exist
- Refresh Gmail to see newly created labels
- Check browser console for any errors

## File Structure

```
gmail-regex-manager/
├── manifest.json          # Extension configuration
├── background.js          # Service worker (email processing logic)
├── content.js            # Gmail page monitor
├── popup.html            # Extension popup UI
├── popup.css             # Popup styles
├── popup.js              # Popup logic (includes drag & drop, stats, regex helper)
├── gmailActions.js       # Gmail API action helpers with retry logic
├── perf.js               # Performance tracking utilities
├── logger.js             # Structured logging utility
├── rules.js              # Rule matching logic (testable)
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── tests/unit/           # Jest unit tests
│   ├── perf.test.js
│   └── gmailActions.test.js
├── scripts/              # Build and automation scripts
│   ├── test-rules.js     # Offline rule testing harness
│   └── release.js        # Version bump & release helper
├── examples/             # Sample data for testing
│   ├── rules-sample.json
│   └── emails-sample.json
├── .github/workflows/    # CI/CD workflows
│   ├── validate.yml      # Extension validation
│   ├── ci.yml            # Test & lint
│   └── package.yml       # Package & release
└── README.md             # This file
```

## Privacy & Security

- All rules are stored locally on your device
- No data is sent to external servers (except Google APIs)
- Extension only accesses Gmail when authenticated
- You can revoke access anytime in your Google Account settings

## Development

### Local Testing

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Debugging
### Offline Rule Testing
### Automated Tests

Jest tests live under `tests/unit/`. Run (after installing dev dependencies locally):
```powershell
npm install
npm test
```

Tests cover:
- Performance entry creation and storage
- Gmail API retry logic with exponential backoff
- Label creation and retrieval
- Rule matching logic

CI runs tests automatically on push/PR via `.github/workflows/ci.yml`.

### Import / Export Rules

Use the popup's Import/Export tab:
- Export: Downloads `rules-export.json` (current rules)
- Import: Select a JSON array of rules, they are validated and appended

Rule object shape:
```json
{
  "id": "rule_id",
  "name": "Readable name",
  "enabled": true,
  "fromPattern": "regex",
  "toPattern": "regex",
  "subjectPattern": "regex",
  "bodyPattern": "regex",
  "actions": {
    "addLabels": ["Label"],
    "removeLabels": ["Label"],
    "markAsRead": true,
    "markAsImportant": false,
    "star": false,
    "archive": false,
    "trash": false
  }
}
```

### Performance Metrics & Stats Tab

Processing performance entries are stored in `chrome.storage.local` under `perfStats` (configurable retention: 5-500 entries, default 50). Each entry:
```json
{
  "timestamp": 1730956800000,
  "emails": 10,
  "rules": 12,
  "matchChecks": 120,
  "ruleMatches": 4,
  "processedCount": 4,
  "durationMs": 37.5
}
```
You can inspect via the DevTools console in the service worker: 
```js
chrome.storage.local.get(['perfStats'], x => console.log(x.perfStats));
```

#### Stats Tab

Open the Stats tab in the popup to view a table of recent runs with:
- Time of run
- Emails scanned
- Rules count
- Match checks performed
- Rule matches
- Emails processed (actions applied)
- Duration (ms)

Buttons:
- **Refresh**: Reload data
- **Clear**: Remove all stored performance entries

Summary line shows entry count, average duration, and total processed across runs.

#### Release Script

Use the release helper to bump version, update `manifest.json`, update `package.json`, append a CHANGELOG entry, commit, and tag:
```powershell
npm run release -- patch "Improve stats UI and dedupe imports"
git push && git push --tags
```
Levels: `major | minor | patch`.
```

### Packaging Workflow

GitHub Actions workflow `package.yml` zips the extension when you push a tag (e.g., `v1.1.0`) or run manually. Artifact name: `gmail-regex-rules-manager.zip`.

Manual trigger: GitHub UI → Actions → Package Extension → Run workflow.

Tag trigger example:
```powershell
git tag -a v1.1.0 -m "v1.1.0"
git push origin v1.1.0
```

You can evaluate rules against sample emails outside Chrome using the Node test harness.

Sample data lives in `examples/`:
- `examples/rules-sample.json`
- `examples/emails-sample.json`

Run harness (JSON output):
```powershell
node scripts/test-rules.js --rules examples/rules-sample.json --emails examples/emails-sample.json
```

Compact summary:
```powershell
node scripts/test-rules.js --rules examples/rules-sample.json --emails examples/emails-sample.json --compact
```

Single inline email:
```powershell
node scripts/test-rules.js --rules examples/rules-sample.json --email '{"from":"billing@vendor.com","subject":"Payment Receipt"}' --compact
```

Version bump helper:
```powershell
npm run bump -- 1.1.0
```

Add `--tag` to auto commit & tag:
```powershell
npm run bump -- 1.1.0 --tag
git push && git push --tags
```

- Background script: `chrome://extensions/` > Click "service worker"
- Content script: Open Gmail, press F12, check Console
- Popup: Right-click extension icon > "Inspect popup"

## Limitations

- Body matching uses the Gmail snippet (~100 chars), not the full message body
- Maximum 100 rules recommended for performance
- Per-rule processed-ID tracking (for "apply to read" rules) resets on service worker restart; labels already applied are idempotent so re-applying is harmless
- `newer_than:30d` window for "apply to read" rules; older emails require a manual API query

## Future Enhancements

- [x] Import/export rules
- [x] Rule execution statistics (Stats tab)
- [x] Rule priority/ordering (drag & drop)
- [x] Live regex helper
- [x] Configurable processing interval
- [x] Retry logic with exponential backoff
- [x] Per-rule match statistics
- [x] Structured logging
- [x] In-popup OAuth client JSON upload (no file editing required)
- [x] Side panel (replaces popup — stays open while using Gmail)
- [x] Gmail API-based email fetching (reliable, no DOM dependency)
- [x] Label autocomplete with in-UI label creation and sub-label support
- [x] Activity log tab (persistent, color-coded, up to 300 entries)
- [x] Apply rules to already-read emails (30-day lookback, per-rule)
- [x] Manual run button (▶)
- [ ] Advanced regex builder UI
- [ ] Email templates for responses
- [ ] Scheduled rule execution (time-based)
- [ ] Full email body search via API
- [ ] Rule groups/folders
- [ ] Conditional actions (if/then logic)

## License

MIT License - Feel free to modify and distribute

## Support

For issues, questions, or contributions, please visit the GitHub repository.

---

**Note**: This extension requires proper Google Cloud OAuth setup. Make sure to follow the installation instructions carefully.
