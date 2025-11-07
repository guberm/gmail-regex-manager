# Troubleshooting Guide

## Common Issues and Solutions

### Authentication Issues

#### Problem: "Authentication failed" error

**Causes:**
1. Client ID not configured correctly
2. Gmail API not enabled
3. OAuth consent screen not set up

**Solutions:**
1. Double-check Client ID in `manifest.json`
2. Verify Gmail API is enabled in Google Cloud Console
3. Add yourself as a test user in OAuth consent screen
4. Make sure redirect URI matches your extension ID

#### Problem: "Not authenticated" status doesn't change

**Solutions:**
1. Reload the extension in `chrome://extensions/`
2. Clear browser cache and cookies
3. Try signing out of Gmail and back in
4. Check browser console for errors (F12)

---

### Rule Processing Issues

#### Problem: Rules not triggering

**Checklist:**
- [ ] Extension is authenticated (green checkmark)
- [ ] Auto-process toggle is ON
- [ ] Gmail is open in at least one tab
- [ ] Rule is enabled (not paused)
- [ ] Regex pattern is valid

**Debug Steps:**
1. Use the Test tab to verify pattern matching
2. Check browser console for errors
3. Simplify the regex pattern to test
4. Try manually refreshing Gmail

#### Problem: Wrong emails being matched

**Solutions:**
1. Patterns might be too broad - make them more specific
2. Test pattern at https://regex101.com/
3. Use `^` and `$` for exact matches
4. Escape special characters with `\`

**Example:**
- Too broad: `.*example.*` matches "example-spam.com"
- Better: `.*@example\.com$` matches only "@example.com"

---

### Label Issues

#### Problem: Labels not being created

**Solutions:**
1. Check if you have permission to create labels
2. Verify Gmail API scope includes `gmail.labels`
3. Check label name doesn't contain invalid characters
4. Try creating the label manually first

#### Problem: Labels created but not visible

**Solutions:**
1. Refresh Gmail page
2. Check label is not hidden (Settings → Labels)
3. Look in "More" labels section
4. Check if label was nested (uses "/" in name)

---

### Performance Issues

#### Problem: Extension running slowly

**Causes:**
1. Too many rules (>100)
2. Complex regex patterns
3. Too many emails in Gmail view

**Solutions:**
1. Disable unused rules
2. Simplify regex patterns
3. Avoid body pattern matching when possible
4. Clear processed emails cache:
   - Reload extension in `chrome://extensions/`

#### Problem: Gmail interface lagging

**Solutions:**
1. Reduce check frequency in settings
2. Disable rules temporarily
3. Close other Gmail-related extensions
4. Clear browser cache

---

### Extension Loading Issues

#### Problem: "Failed to load extension"

**Common Causes:**
1. Invalid manifest.json syntax
2. Missing files
3. Invalid icon paths

**Solutions:**
1. Validate JSON syntax: https://jsonlint.com/
2. Check all files are present
3. Verify icon files exist (can use SVG temporarily)
4. Check file paths are correct

#### Problem: Extension icon not showing

**Solutions:**
1. Pin extension from puzzle icon menu
2. Reload extension
3. Check icons are properly referenced in manifest
4. Create PNG versions of icons

---

### Gmail API Issues

#### Problem: "403 Forbidden" errors

**Solutions:**
1. Check Gmail API is enabled
2. Verify OAuth scopes match what's approved
3. Check API quotas in Cloud Console
4. Re-authenticate the extension

#### Problem: "Rate limit exceeded"

**Solutions:**
1. Reduce check frequency
2. Process fewer emails per batch
3. Wait for quota to reset (usually 24 hours)
4. Request quota increase in Cloud Console

---

### Browser Console Errors

#### How to check console:

**Background Script:**
1. Go to `chrome://extensions/`
2. Find "Gmail Regex Manager"
3. Click "service worker" link
4. Check console for errors

**Content Script:**
1. Open Gmail
2. Press F12
3. Go to Console tab
4. Look for errors mentioning the extension

**Popup:**
1. Click extension icon
2. Right-click in popup
3. Select "Inspect"
4. Check Console tab

---

### Data & Storage Issues

#### Problem: Rules disappear after browser restart

**Solutions:**
1. Check Chrome storage permissions
2. Verify extension isn't in Incognito mode
3. Export rules as backup (manual copy from storage)

#### How to manually check stored rules:

1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Expand "Storage" → "Extension Storage"
4. Find your extension
5. Check "rules" key

#### How to manually reset extension:

1. Go to `chrome://extensions/`
2. Click "Remove" on the extension
3. Reload the unpacked extension
4. Re-authenticate

---

### Regex Pattern Issues

#### Problem: Pattern not matching expected emails

**Debugging Steps:**

1. **Test at regex101.com:**
   - Paste your pattern
   - Select "JavaScript" flavor
   - Enable "insensitive" flag
   - Test with sample text

2. **Common mistakes:**
   - Forgetting to escape dots: `example.com` → `example\.com`
   - Wrong anchor position: `@gmail.com^` → `@gmail\.com$`
   - Missing alternation: `com|net` needs `\.(com|net)$`

3. **Use Test tab:**
   - Enter real email data
   - Test against your rule
   - Refine pattern based on results

#### Common Pattern Fixes:

| Issue | Wrong | Right |
|-------|-------|-------|
| Domain match | `@example.com` | `@example\.com` |
| Starts with | `URGENT.*` | `^URGENT.*` |
| Ends with | `.*\.pdf` | `.*\.pdf$` |
| Multiple domains | `@(gmail\|yahoo).com` | `@(gmail\|yahoo)\.com` |
| Any subdomain | `@subdomain.example.com` | `@.*\.example\.com` |

---

### OAuth & Permissions Issues

#### Problem: "Invalid scope" error

**Solutions:**
1. Check scopes in manifest.json match OAuth consent
2. Re-configure OAuth consent screen
3. Delete and recreate OAuth client
4. Clear browser's OAuth cache

#### Problem: Consent screen keeps appearing

**Solutions:**
1. Make sure to click "Allow" not "Deny"
2. Check if app is in testing mode (limit 100 users)
3. Publish OAuth consent screen
4. Add your email as test user

---

### Testing Checklist

When something isn't working, test in this order:

1. [ ] Extension loaded and enabled
2. [ ] Green "Authenticated ✓" status
3. [ ] Gmail open in a tab
4. [ ] Auto-process toggle ON
5. [ ] Rule enabled (not paused)
6. [ ] Test rule in Test tab first
7. [ ] Check browser console for errors
8. [ ] Try with simpler pattern
9. [ ] Verify Gmail API quota not exceeded
10. [ ] Try reload extension and re-auth

---

### Getting Help

If none of these solutions work:

1. **Check browser console** for specific error messages
2. **Test with minimal rule** (simple pattern, one action)
3. **Verify Google Cloud setup** is complete
4. **Try in fresh browser profile** to rule out conflicts
5. **Review the README.md** for setup steps

### Support Resources

- Regex Testing: https://regex101.com/
- Gmail API Docs: https://developers.google.com/gmail/api
- Chrome Extension Docs: https://developer.chrome.com/docs/extensions/
- OAuth 2.0 Guide: https://developers.google.com/identity/protocols/oauth2

---

**Remember**: Most issues are related to:
1. OAuth configuration (50%)
2. Regex pattern problems (30%)
3. Gmail API permissions (20%)

Start with the authentication checklist first!
