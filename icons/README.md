# Icon Setup Instructions

The extension includes SVG icon files, but Chrome requires PNG format.

## Quick Fix: Temporary SVG Support

You can temporarily use SVG files by updating the manifest.json:

Replace the "icons" and "action" sections with:

```json
"action": {
  "default_popup": "popup.html",
  "default_icon": {
    "16": "icons/icon16.svg",
    "48": "icons/icon48.svg",
    "128": "icons/icon128.svg"
  }
},
"icons": {
  "16": "icons/icon16.svg",
  "48": "icons/icon48.svg",
  "128": "icons/icon128.svg"
}
```

**Note**: Some Chrome versions may not display SVG icons properly.

## Recommended: Convert to PNG

### Option 1: Online Converter (Easiest)

1. Go to https://convertio.co/svg-png/ or https://cloudconvert.com/svg-to-png
2. Upload `icons/icon16.svg`
3. Download as PNG
4. Rename to `icon16.png` and save in `icons/` folder
5. Repeat for icon48.svg and icon128.svg

### Option 2: Chrome Screenshot Method

1. Open `icons/icon128.svg` in Chrome browser
2. Right-click on the image
3. Select "Save image as..."
4. Save as PNG format in the `icons/` folder
5. Repeat for other sizes

### Option 3: ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
magick icons/icon128.svg icons/icon128.png
magick icons/icon48.svg icons/icon48.png
magick icons/icon16.svg icons/icon16.png
```

### Option 4: GIMP or Photoshop

1. Open SVG file in GIMP/Photoshop
2. Export as PNG
3. Ensure dimensions match (16x16, 48x48, 128x128)
4. Save in `icons/` folder

### Option 5: VS Code Extension

1. Install "Luna Paint" extension in VS Code
2. Open SVG file
3. Export as PNG
4. Save with correct dimensions

## After Converting

Once you have PNG files:

1. Ensure files are named:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

2. Verify they're in the `icons/` folder

3. The manifest.json already references .png files, so no changes needed

4. Reload the extension in `chrome://extensions/`

## Icon Design

The icons show:
- Blue envelope (Gmail)
- Green circle with ".*" (Regex pattern)
- Clean, professional look

You can customize the colors in the SVG files if desired:
- `#4285f4` - Blue (Gmail color)
- `#34a853` - Green (for regex indicator)
- `white` - Text and envelope

## Troubleshooting

**Icon not showing in Chrome:**
- Make sure PNG files exist
- Check file names match manifest.json exactly
- Reload extension after adding icons
- Clear Chrome cache if needed

**Icon looks blurry:**
- Ensure PNG dimensions are exact (16, 48, 128)
- Use high-quality PNG export settings
- SVG should scale perfectly when converting

**Can't convert SVG:**
- Use the temporary SVG fix above
- Or create simple colored square as placeholder:
  - 16x16 blue square as icon16.png
  - 48x48 blue square as icon48.png  
  - 128x128 blue square as icon128.png
