# Quick Start Guide

## Installation (5 minutes)

1. **Set up Google Cloud Project** (first time only)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project
   - Enable Gmail API
   - Create OAuth 2.0 credentials (Chrome Extension type)
   - Copy your Client ID

2. **Configure Extension**
   - Edit `manifest.json`
   - Replace `YOUR_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID

3. **Load in Chrome**
   - Go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the extension folder
   - Click the extension icon and sign in

## Your First Rule (2 minutes)

### Example: Auto-archive Newsletters

1. Click extension icon → **Create Rule** tab
2. Fill in:
   - **Name**: Newsletter Auto-Archive
   - **From Pattern**: `.*newsletter@.*`
3. Check actions:
   - ✓ **Mark as read**
   - ✓ **Archive**
4. Click **Save Rule**

Done! Now all newsletter emails will be automatically read and archived.

## Using the Live Regex Helper

1. In Create Rule tab, scroll to **Live Regex Helper**
2. Enter a sample email address in "Sample From": `weekly@newsletter.com`
3. Type your pattern in "From Pattern": `.*newsletter@.*`
4. See ✔ green feedback = pattern matches!

## Common Patterns

### Match specific domain
```regex
.*@example\.com
```

### Match multiple domains
```regex
.*(newsletter|marketing|updates)@.*
```

### Subject starts with [URGENT]
```regex
^\[URGENT\].*
```

### Contains keywords (case-insensitive)
```regex
.*(invoice|receipt|payment).*
```

## Keyboard Shortcuts

- `Ctrl+N` - New rule
- `Ctrl+T` - Test rules
- `Ctrl+S` - Save rule
- `Esc` - Cancel editing

## Import Example Rules

1. Go to **Import/Export** tab
2. Click **Choose File**
3. Select `examples/rules-comprehensive.json`
4. Click **Import Rules**
5. Edit the patterns to match your needs

## Tips

✅ **Test First**: Use Test tab to verify patterns before saving

✅ **Start Simple**: Begin with one rule, test it, then add more

✅ **Check Stats**: View Stats tab to see which rules are working

✅ **Reorder Rules**: Drag rules by ☰ handle to set priority

✅ **Use Tooltips**: Hover over settings for helpful hints

## Troubleshooting

**Rules not working?**
- Ensure you're signed in (green ✓ in header)
- Check "Auto-process emails" is enabled
- Open Gmail in a browser tab
- View Stats tab to see if rules are running

**Pattern not matching?**
- Use Live Regex Helper to test
- Remember: patterns are case-insensitive
- Escape special characters: `\.` for literal dot

## Next Steps

- Explore example rules in `examples/` folder
- Adjust processing interval in settings
- Monitor performance in Stats tab
- Export your rules for backup

Need help? Check the full README.md for detailed documentation.
