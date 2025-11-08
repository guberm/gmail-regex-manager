# Gmail API OAuth Setup Guide

This guide will walk you through creating your own Google Cloud Project and obtaining a Client ID for the Gmail Regex Manager extension.

## 🚀 Quick Start (TL;DR)

**For local/unpacked extension:**
1. Load extension in Chrome → Get Extension ID
2. Google Cloud Console → Create OAuth Client → **Use "Chrome Extension" type**
3. Paste Extension ID into Application ID field
4. Copy Client ID → Configure extension with `npm run config YOUR_CLIENT_ID`
5. Reload extension → Sign in

**Can't find "Chrome Extension" type?** Use "Web Application" instead and add redirect URI: `https://YOUR_EXTENSION_ID.chromiumapp.org/`

---

## Why Do You Need This?

To access Gmail on your behalf, this extension needs OAuth 2.0 credentials. You'll create your own credentials so the extension can safely access your Gmail account.

## Prerequisites

- A Google account
- 10-15 minutes of time

## Step-by-Step Instructions

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** at the top of the page
3. Click **"New Project"**
4. Enter a project name (e.g., "Gmail Regex Manager")
5. Click **"Create"**
6. Wait for the project to be created and select it

### 2. Enable Gmail API

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Gmail API"**
3. Click on **"Gmail API"** in the results
4. Click **"Enable"**

### 3. Configure OAuth Consent Screen

1. In the left sidebar, click **"OAuth consent screen"**
2. Select **"External"** as the User Type
3. Click **"Create"**
4. Fill in the required fields:
   - **App name**: `Gmail Regex Manager` (or your preferred name)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On the **Scopes** page, click **"Add or Remove Scopes"**
7. Add these scopes:
   - `https://www.googleapis.com/auth/gmail.modify`
   - `https://www.googleapis.com/auth/gmail.labels`
8. Click **"Update"** and then **"Save and Continue"**
9. On the **Test users** page, click **"Add Users"**
10. Add your Gmail address (and any other users who will use this extension)
11. Click **"Save and Continue"**
12. Review and click **"Back to Dashboard"**

### 4. Create OAuth Client ID

**IMPORTANT:** For local/unpacked extensions, use **Chrome Extension** type (simplest).

#### Option A: Chrome Extension (Recommended for Local Development)

1. In the left sidebar, click **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Chrome Extension"** as Application type
4. **Application ID**: Enter your extension ID
   - You need to load the extension first to get this ID (see step 5)
   - Leave blank for now, we'll come back to update it
5. Click **"Create"**
6. **Copy the Client ID** - format: `xxxxx.apps.googleusercontent.com`

#### Option B: Web Application (Alternative Method)

If "Chrome Extension" is not available in your Google Cloud Console:

1. Select **"Web application"** as Application type
2. **Name**: `Gmail Regex Manager Extension`
3. **Authorized JavaScript origins**: Leave empty
4. **Authorized redirect URIs**: Add this format:
   ```
   https://<YOUR_EXTENSION_ID>.chromiumapp.org/
   ```
   Example: `https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/`
   
   **Note:** You'll need to get your extension ID first (step 5), then come back and update this.

5. Click **"Create"**
6. **Copy the Client ID** - format: `xxxxx.apps.googleusercontent.com`

**Don't worry if you don't have the extension ID yet - you'll update this in step 6.**

### 5. Get Your Extension ID (First Time Setup)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in the top right)
3. Click **"Load unpacked"** and select the extension folder
4. Your **Extension ID** will be shown under the extension name (long string of letters)
   - Example: `abcdefghijklmnopqrstuvwxyz123456`
5. **Copy this ID** - you'll need it for the next step

### 6. Update OAuth Credentials with Extension ID

Now that you have your extension ID, update your OAuth credentials:

#### If you used Chrome Extension type (Option A):

1. Go back to **"Credentials"** in Google Cloud Console
2. Click on your **OAuth 2.0 Client ID**
3. In the **"Application ID"** field, paste your extension ID
4. Click **"Save"**

#### If you used Web Application type (Option B):

1. Go back to **"Credentials"** in Google Cloud Console
2. Click on your OAuth 2.0 Client ID
3. Update the **Authorized redirect URIs** with your actual extension ID:
   ```
   https://YOUR_ACTUAL_EXTENSION_ID.chromiumapp.org/
   ```
   Example: `https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/`
4. Click **"Save"**

**Important:** After updating, wait 5-10 minutes for Google's servers to propagate the changes.

### 7. Configure the Extension

1. Open the extension folder on your computer
2. Edit the `manifest.json` file
3. Find the `oauth2` section at the bottom
4. Replace `YOUR_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID:
   ```json
   "oauth2": {
     "client_id": "YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com",
     "scopes": [
       "https://www.googleapis.com/auth/gmail.modify",
       "https://www.googleapis.com/auth/gmail.labels"
     ]
   }
   ```
5. Save the file
6. Go to `chrome://extensions/` in Chrome
7. Click the **refresh icon** on the extension card to reload it
8. Click the extension icon and then **"Sign In"** to authenticate

## Required Scopes

The extension requires these Gmail API scopes:

- **`gmail.modify`** - To read emails, apply labels, and modify messages
- **`gmail.labels`** - To create and manage labels

## Troubleshooting

### "I don't see 'Chrome Extension' as an application type"

Some Google Cloud Console versions don't show the "Chrome Extension" option.

**Solution:** Use "Web application" type instead:
1. Select **"Web application"**
2. Add authorized redirect URI: `https://YOUR_EXTENSION_ID.chromiumapp.org/`
3. Replace `YOUR_EXTENSION_ID` with your actual extension ID from `chrome://extensions/`

### "Error 400: redirect_uri_mismatch"

This means the redirect URI doesn't match what's configured in Google Cloud Console.

**Solution:**
1. Check your extension ID in `chrome://extensions/`
   - Should be a 32-character string like: `abcdefghijklmnopqrstuvwxyz123456`
2. Go to Google Cloud Console → Credentials → Click your OAuth Client
3. Verify the redirect URI exactly matches:
   ```
   https://YOUR_EXTENSION_ID.chromiumapp.org/
   ```
   Example: `https://abcdefghijklmnopqrstuvwxyz123456.chromiumapp.org/`
4. No trailing slash, no extra characters
5. Click Save and wait 5-10 minutes

### "Error 401: invalid_client"

Your Client ID doesn't match or isn't configured correctly.

**Solution:**
1. Verify Client ID in `manifest.json` matches Google Cloud Console
2. Check for typos (Client ID ends with `.apps.googleusercontent.com`)
3. Make sure you saved the manifest.json file
4. Reload the extension in `chrome://extensions/`

### "Access blocked: This app's request is invalid"

This usually means the OAuth consent screen isn't properly configured.

**Solution:**
1. Go to **OAuth consent screen** in Google Cloud Console
2. Make sure you've added the required scopes:
   - `https://www.googleapis.com/auth/gmail.modify`
   - `https://www.googleapis.com/auth/gmail.labels`
3. Add yourself as a test user
4. Save and wait a few minutes

### "The app is not verified"

If your app is in "Testing" mode, you'll see a warning screen.

**Solution:**
1. Click **"Advanced"**
2. Click **"Go to [Your App Name] (unsafe)"**
3. This is safe - it's your own app!

Alternatively, you can publish your app (but this isn't necessary for personal use).

### Extension doesn't authenticate

**Solution:**
1. Make sure you've enabled the Gmail API
2. Verify your Client ID is correctly copied
3. Check that your Google account is added as a test user
4. Try removing and re-adding the extension

## Security Notes

- **Your credentials are private** - Don't share your Client ID publicly
- **Store safely** - The extension stores your Client ID locally in Chrome
- **Revoke access anytime** - Go to [Google Account Permissions](https://myaccount.google.com/permissions) to revoke access
- **Test users only** - While in "Testing" mode, only added test users can authenticate

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Chrome Extension OAuth Guide](https://developer.chrome.com/docs/extensions/mv3/tut_oauth/)

## Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review the [extension's GitHub issues](https://github.com/guberm/gmail-regex-manager/issues)
3. Create a new issue with:
   - Error messages
   - Steps you've completed
   - Screenshots (remove any sensitive data)
