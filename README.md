# Gmail Regex Rules Manager

![Validate Extension Workflow](https://github.com/guberm/gmail-regex-manager/actions/workflows/validate.yml/badge.svg)

A powerful Chrome extension that automatically manages your Gmail emails using regex-based rules. Set up custom patterns to automatically label, archive, mark as read, and perform other actions on incoming emails.

## Features

✨ **Regex Pattern Matching**
- Match emails by sender (From)
- Match emails by recipient (To)
- Match emails by subject
- Match emails by body/snippet
- **Live Regex Helper** - Test patterns in real-time as you type

🎯 **Automated Actions**
- Add or remove labels
- Mark as read/unread
- Mark as important
- Star emails
- Archive emails
- Move to trash

⚡ **Real-Time Monitoring**
- Automatically detects new emails in Gmail
- Processes emails as they arrive
- **Configurable scan interval** (1-60 minutes)
- Works in the background with retry logic

🎨 **User-Friendly Interface**
- Easy rule creation and management
- **Drag & drop rule reordering** to set priority
- Test rules before applying
- Enable/disable rules individually
- **Per-rule match statistics** (count & last matched)
- Visual feedback and status

📊 **Performance & Observability**
- **Stats tab** with processing metrics
- **Configurable retention** (5-500 entries)
- **Adjustable log levels** (error/warn/info/debug)
- Import/export rules for backup/sharing

## Installation

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

## How It Works

1. **Content Script**: Monitors Gmail webpage for new emails using DOM observation
2. **Background Service Worker**: Processes emails and applies rules via Gmail API with exponential backoff retry logic
3. **Storage**: Rules and settings are stored locally using Chrome's storage API
4. **Gmail API**: Applies actions (labels, read status, etc.) to matched emails with automatic label creation
5. **Performance Tracking**: Records metrics for each processing run (configurable retention)
6. **Logging**: Structured logging with adjustable verbosity levels

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

- Rules process emails visible in Gmail's current view
- Body matching only works on email snippets (not full content)
- Maximum 100 rules recommended for performance
- Requires Gmail to be open in at least one browser tab

## Future Enhancements

- [x] Import/export rules
- [x] Rule execution statistics (Stats tab)
- [x] Rule priority/ordering (drag & drop)
- [x] Live regex helper
- [x] Configurable processing interval
- [x] Retry logic with exponential backoff
- [x] Per-rule match statistics
- [x] Structured logging
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
