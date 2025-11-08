# Gmail API OAuth Setup Guide

This guide will walk you through creating your own Google Cloud Project and obtaining a Client ID for the Gmail Regex Manager extension.

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

1. In the left sidebar, click **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Chrome App"** or **"Web application"** as Application type
   - For Chrome App: Enter the extension ID (you'll get this after loading the extension)
   - For Web application:
     - **Name**: `Gmail Regex Manager Extension`
     - **Authorized JavaScript origins**: Leave empty
     - **Authorized redirect URIs**: Add:
       ```
       https://<YOUR_EXTENSION_ID>.chromiumapp.org/
       ```
       (Replace `<YOUR_EXTENSION_ID>` with your actual extension ID)
4. Click **"Create"**
5. **Copy the Client ID** - you'll need this for the extension

### 5. Find Your Extension ID

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in the top right)
3. Click **"Load unpacked"** and select the extension folder
4. Your **Extension ID** will be shown under the extension name
5. Copy this ID

### 6. Update OAuth Client (if using Web application type)

If you selected "Web application" in step 4:

1. Go back to **"Credentials"** in Google Cloud Console
2. Click on your OAuth 2.0 Client ID
3. Update the **Authorized redirect URIs** with your actual extension ID:
   ```
   https://<YOUR_ACTUAL_EXTENSION_ID>.chromiumapp.org/
   ```
4. Click **"Save"**

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

### "Error 400: redirect_uri_mismatch"

This means the redirect URI doesn't match what's configured in Google Cloud Console.

**Solution:**
1. Check your extension ID in `chrome://extensions/`
2. Verify the redirect URI in Google Cloud Console matches:
   ```
   https://<YOUR_EXTENSION_ID>.chromiumapp.org/
   ```

### "Access blocked: This app's request is invalid"

This usually means the OAuth consent screen isn't properly configured.

**Solution:**
1. Go to **OAuth consent screen** in Google Cloud Console
2. Make sure you've added the required scopes
3. Add yourself as a test user

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
