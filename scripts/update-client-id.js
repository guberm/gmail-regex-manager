#!/usr/bin/env node

/**
 * Helper script to update OAuth Client ID in manifest.json
 * Usage: node scripts/update-client-id.js YOUR_CLIENT_ID
 */

const fs = require('fs');
const path = require('path');

function updateClientId(clientId) {
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  
  // Validate Client ID format
  if (!clientId || !clientId.includes('.apps.googleusercontent.com')) {
    console.error('❌ Error: Invalid Client ID format');
    console.error('   Client ID should end with .apps.googleusercontent.com');
    console.error('');
    console.error('Usage: node scripts/update-client-id.js YOUR_CLIENT_ID');
    console.error('Example: node scripts/update-client-id.js 123456789.apps.googleusercontent.com');
    process.exit(1);
  }
  
  try {
    // Read manifest.json
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Update oauth2 client_id
    if (!manifest.oauth2) {
      console.error('❌ Error: manifest.json does not have an oauth2 section');
      process.exit(1);
    }
    
    const oldClientId = manifest.oauth2.client_id;
    manifest.oauth2.client_id = clientId;
    
    // Write back to manifest.json with proper formatting
    fs.writeFileSync(
      manifestPath,
      JSON.stringify(manifest, null, 2) + '\n',
      'utf8'
    );
    
    console.log('✅ Successfully updated OAuth Client ID in manifest.json');
    console.log('');
    console.log('Old Client ID:', oldClientId);
    console.log('New Client ID:', clientId);
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to chrome://extensions/ in your browser');
    console.log('2. Find "Gmail Regex Rules Manager"');
    console.log('3. Click the refresh/reload icon to reload the extension');
    console.log('4. Click the extension icon and sign in');
    
  } catch (error) {
    console.error('❌ Error updating manifest.json:', error.message);
    process.exit(1);
  }
}

// Get Client ID from command line argument
const clientId = process.argv[2];

if (!clientId) {
  console.log('OAuth Client ID Configuration Helper');
  console.log('=====================================');
  console.log('');
  console.log('This script helps you configure your Google OAuth Client ID');
  console.log('for the Gmail Regex Rules Manager extension.');
  console.log('');
  console.log('Usage: node scripts/update-client-id.js YOUR_CLIENT_ID');
  console.log('');
  console.log('Example:');
  console.log('  node scripts/update-client-id.js 123456789-abc123.apps.googleusercontent.com');
  console.log('');
  console.log('To get your Client ID:');
  console.log('1. Follow the setup guide: OAUTH_SETUP.md');
  console.log('2. Or visit: https://github.com/guberm/gmail-regex-manager/blob/main/OAUTH_SETUP.md');
  process.exit(0);
}

updateClientId(clientId);
