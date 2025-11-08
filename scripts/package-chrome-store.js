#!/usr/bin/env node

/**
 * Package extension for Chrome Web Store submission
 * Creates a production-ready zip file excluding development files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.join(__dirname, '..', 'dist');
const OUTPUT_FILE = 'gmail-regex-manager-v1.1.0.zip';
const OUTPUT_PATH = path.join(OUTPUT_DIR, OUTPUT_FILE);

// Files and directories to include in the package
const INCLUDE_PATTERNS = [
  'manifest.json',
  'background.js',
  'content.js',
  'popup.html',
  'popup.js',
  'popup.css',
  'shortcuts.js',
  'rules.js',
  'gmailActions.js',
  'logger.js',
  'perf.js',
  'icons/**',
  'README.md',
  'LICENSE',
  'OAUTH_SETUP.md',
  'QUICKSTART.md',
  'CHANGELOG.md',
  'TROUBLESHOOTING.md',
  'examples/**'
];

// Files and directories to explicitly exclude
const EXCLUDE_PATTERNS = [
  'node_modules/**',
  'tests/**',
  'scripts/**',
  '.github/**',
  '.git/**',
  '.gitignore',
  '.eslintrc.json',
  'package.json',
  'package-lock.json',
  'dist/**',
  '*.bat',
  '*.md.backup',
  'PROJECT_SUMMARY.md',
  'SETUP.md',
  'EXAMPLES.md'
];

console.log('📦 Packaging Gmail Regex Manager for Chrome Web Store');
console.log('=====================================================\n');

// Create dist directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('✓ Created dist directory');
}

// Remove old package if exists
if (fs.existsSync(OUTPUT_PATH)) {
  fs.unlinkSync(OUTPUT_PATH);
  console.log('✓ Removed old package');
}

// Check if zip command is available (Windows PowerShell Compress-Archive or Unix zip)
const isWindows = process.platform === 'win32';

try {
  if (isWindows) {
    // Use PowerShell Compress-Archive on Windows
    console.log('\n📁 Creating package using PowerShell...');
    
    // Build the list of files to include
    const includeFiles = [
      'manifest.json',
      'background.js',
      'content.js',
      'popup.html',
      'popup.js',
      'popup.css',
      'shortcuts.js',
      'rules.js',
      'gmailActions.js',
      'logger.js',
      'perf.js',
      'README.md',
      'OAUTH_SETUP.md',
      'QUICKSTART.md',
      'CHANGELOG.md',
      'TROUBLESHOOTING.md'
    ];
    
    // Check if LICENSE exists
    if (fs.existsSync('LICENSE')) {
      includeFiles.push('LICENSE');
    }
    
    // Copy files to temp directory
    const tempDir = path.join(OUTPUT_DIR, 'temp');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Copy files
    for (const file of includeFiles) {
      const src = path.join(__dirname, '..', file);
      const dest = path.join(tempDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`  ✓ ${file}`);
      }
    }
    
    // Copy icons directory
    const iconsDir = path.join(__dirname, '..', 'icons');
    const iconsDestDir = path.join(tempDir, 'icons');
    if (fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDestDir, { recursive: true });
      const iconFiles = fs.readdirSync(iconsDir);
      for (const iconFile of iconFiles) {
        if (iconFile.endsWith('.png')) {
          fs.copyFileSync(
            path.join(iconsDir, iconFile),
            path.join(iconsDestDir, iconFile)
          );
          console.log(`  ✓ icons/${iconFile}`);
        }
      }
    }
    
    // Copy examples directory
    const examplesDir = path.join(__dirname, '..', 'examples');
    const examplesDestDir = path.join(tempDir, 'examples');
    if (fs.existsSync(examplesDir)) {
      fs.mkdirSync(examplesDestDir, { recursive: true });
      const exampleFiles = fs.readdirSync(examplesDir);
      for (const exampleFile of exampleFiles) {
        fs.copyFileSync(
          path.join(examplesDir, exampleFile),
          path.join(examplesDestDir, exampleFile)
        );
        console.log(`  ✓ examples/${exampleFile}`);
      }
    }
    
    // Create zip using PowerShell
    const psCommand = `Compress-Archive -Path "${tempDir}\\*" -DestinationPath "${OUTPUT_PATH}" -Force`;
    execSync(`powershell -Command "${psCommand}"`, { stdio: 'inherit' });
    
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true });
    
  } else {
    // Use Unix zip command
    console.log('\n📁 Creating package using zip...');
    
    const filesToZip = [
      'manifest.json',
      'background.js',
      'content.js',
      'popup.html',
      'popup.js',
      'popup.css',
      'shortcuts.js',
      'rules.js',
      'gmailActions.js',
      'logger.js',
      'perf.js',
      'icons/*.png',
      'README.md',
      'OAUTH_SETUP.md',
      'QUICKSTART.md',
      'CHANGELOG.md',
      'TROUBLESHOOTING.md',
      'examples/*'
    ];
    
    if (fs.existsSync('LICENSE')) {
      filesToZip.push('LICENSE');
    }
    
    const zipCommand = `zip -r "${OUTPUT_PATH}" ${filesToZip.join(' ')} -x "*.git*" "node_modules/*" "tests/*" "scripts/*" ".github/*"`;
    execSync(zipCommand, { stdio: 'inherit' });
  }
  
  const stats = fs.statSync(OUTPUT_PATH);
  const sizeKB = (stats.size / 1024).toFixed(2);
  
  console.log('\n✅ Package created successfully!');
  console.log(`📦 File: ${OUTPUT_PATH}`);
  console.log(`📏 Size: ${sizeKB} KB`);
  console.log('\n📋 Next steps:');
  console.log('1. Go to https://chrome.google.com/webstore/devconsole');
  console.log('2. Click "New Item" or update existing item');
  console.log('3. Upload the zip file from dist/ folder');
  console.log('4. Fill in the store listing (see STORE_LISTING.md)');
  console.log('5. Submit for review\n');
  
} catch (error) {
  console.error('\n❌ Error creating package:', error.message);
  process.exit(1);
}
