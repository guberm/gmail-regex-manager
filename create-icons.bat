@echo off
echo ================================
echo Gmail Regex Manager Icon Creator
echo ================================
echo.
echo This script will help you create PNG icons from SVG files.
echo.
echo You need to install ImageMagick or use an online converter.
echo.
echo Option 1: Install ImageMagick
echo -----------------------------
echo Download from: https://imagemagick.org/script/download.php
echo.
echo After installing, run these commands:
echo.
echo magick icons\icon128.svg icons\icon128.png
echo magick icons\icon48.svg icons\icon48.png
echo magick icons\icon16.svg icons\icon16.png
echo.
echo Option 2: Online Converter
echo -------------------------
echo 1. Go to: https://convertio.co/svg-png/
echo 2. Upload each SVG file from the icons folder
echo 3. Download the PNG files
echo 4. Save them back to the icons folder
echo.
echo Option 3: Use Chrome to Create Icons
echo -----------------------------------
echo 1. Open each SVG file in Chrome
echo 2. Right-click and "Save image as..."
echo 3. Save as PNG in the icons folder
echo.
echo The manifest.json expects these files:
echo - icons\icon16.png
echo - icons\icon48.png
echo - icons\icon128.png
echo.
echo ================================
pause
