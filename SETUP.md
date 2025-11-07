# Setup Instructions for Gmail Regex Rules Manager

## Quick Start Guide

### 1. Create Google Cloud Project (5 minutes)

1. Visit: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it "Gmail Rules Manager"
4. Click "Create"

### 2. Enable Gmail API (2 minutes)

1. In Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click on it and press "Enable"

### 3. Create OAuth Credentials (5 minutes)

1. Go to "APIs & Services" → "Credentials"
2. Click "Configure Consent Screen"
   - Choose "External"
   - Fill in app name: "Gmail Rules Manager"
   - Add your email as developer contact
   - Click "Save and Continue"
   - Skip scopes section
   - Add yourself as test user
   - Click "Save and Continue"

3. Back to "Credentials" tab
4. Click "Create Credentials" → "OAuth client ID"
5. Application type: "Chrome Extension"
6. Name: "Gmail Rules Manager"
7. For now, use placeholder ID: `abcdefghijklmnopqrstuvwxyz123456`
8. Click "Create"
9. **Copy the Client ID** (looks like: `xxxxx-xxxxx.apps.googleusercontent.com`)

### 4. Install Extension (3 minutes)

1. Open `manifest.json` in this folder
2. Find line with `YOUR_CLIENT_ID.apps.googleusercontent.com`
3. Replace with your actual Client ID from step 3
4. Save the file

5. Open Chrome browser
6. Go to: `chrome://extensions/`
7. Toggle "Developer mode" ON (top-right)
8. Click "Load unpacked"
9. Select this folder (`gmail-regex-manager`)
10. **Copy the Extension ID** shown on the card (looks like: `abcdefghijklmnopqrstuvwxyz123456`)

### 5. Update OAuth Credentials (2 minutes)

1. Go back to Google Cloud Console
2. Go to "APIs & Services" → "Credentials"
3. Click on your OAuth 2.0 Client ID
4. In "Authorized redirect URIs", click "Add URI"
5. Add: `https://YOUR_EXTENSION_ID.chromiumapp.org/`
   - Replace YOUR_EXTENSION_ID with the ID from step 4
6. Click "Save"

### 6. Test the Extension (2 minutes)

1. Open Gmail: https://mail.google.com/
2. Click the extension icon in Chrome toolbar
3. Click "Sign In" button
4. Grant permissions when prompted
5. Status should change to "Authenticated ✓"

## Creating Your First Rule

### Example: Filter Marketing Emails

1. Click extension icon
2. Click "Create Rule" tab
3. Fill in:
   - **Name**: Marketing Filter
   - **From Pattern**: `.*@marketing\..*|.*newsletter.*`
   - **Actions**: Add label "Marketing", Archive
4. Click "Save Rule"
5. Toggle "Auto-process emails" ON

Now all emails from marketing domains will be automatically labeled and archived!

## Common Issues

### "Authentication failed"
- Check that Gmail API is enabled
- Verify Client ID in manifest.json is correct
- Make sure you added yourself as test user in OAuth consent

### "Extension not processing emails"
- Open Gmail in a browser tab
- Click extension icon and ensure toggle is ON
- Check that you're signed in (green checkmark)

### "Invalid Client ID"
- Double-check the Client ID in manifest.json
- Make sure there are no extra spaces
- Format should be: `xxxxx-xxxxx.apps.googleusercontent.com`

### Extension icon not showing
- Go to `chrome://extensions/`
- Check if extension is enabled
- Click the puzzle icon in toolbar to pin the extension

## Testing Without Real Emails

1. Click extension icon
2. Go to "Test" tab
3. Enter sample data:
   - From: `newsletter@marketing.com`
   - Subject: `Special Offer Inside`
4. Click "Test Against All Rules"
5. See which rules match!

## Next Steps

- Create more rules for different email types
- Use the Test tab to refine your regex patterns
- Monitor which rules are triggering most often
- Adjust patterns based on results

## Need Help?

Check the main README.md file for:
- Detailed regex examples
- All available actions
- Troubleshooting guide
- Privacy information

---

**Estimated Total Setup Time**: 15-20 minutes

**Once configured, the extension works automatically in the background!**
