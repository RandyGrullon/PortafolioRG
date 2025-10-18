#!/usr/bin/env node

/**
 * Firebase CORS Configuration Script
 *
 * This script helps configure CORS for Firebase Storage to allow
 * image uploads from localhost and production domains.
 *
 * Usage:
 * 1. Make sure you have gsutil installed (Google Cloud SDK)
 * 2. Run: node setup-cors.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUCKET_NAME = 'studio-7639868049-100f7.firebasestorage.app';
const CORS_CONFIG_FILE = 'cors.json';

function setupCORS() {
  console.log('🚀 Setting up Firebase Storage CORS configuration...\n');

  // Check if cors.json exists
  if (!fs.existsSync(CORS_CONFIG_FILE)) {
    console.error('❌ cors.json file not found. Please make sure it exists in the project root.');
    process.exit(1);
  }

  // Check if gsutil is available
  try {
    execSync('gsutil version', { stdio: 'pipe' });
    console.log('✅ gsutil is available');
  } catch (error) {
    console.error('❌ gsutil is not installed or not in PATH.');
    console.log('\n📋 To install Google Cloud SDK:');
    console.log('1. Download from: https://cloud.google.com/sdk/docs/install');
    console.log('2. Run: gcloud init');
    console.log('3. Authenticate: gcloud auth login');
    process.exit(1);
  }

  // Apply CORS configuration
  try {
    console.log('📤 Applying CORS configuration...');
    const command = `gsutil cors set ${CORS_CONFIG_FILE} gs://${BUCKET_NAME}`;
    console.log(`Running: ${command}`);

    const result = execSync(command, { stdio: 'inherit' });

    console.log('✅ CORS configuration applied successfully!');
    console.log('\n🔍 Verifying configuration...');

    // Verify the configuration
    const verifyCommand = `gsutil cors get gs://${BUCKET_NAME}`;
    console.log(`Running: ${verifyCommand}`);

    const verifyResult = execSync(verifyCommand, { encoding: 'utf8' });
    console.log('\n📋 Current CORS configuration:');
    console.log(verifyResult);

    console.log('\n🎉 Setup complete! You can now upload images to Firebase Storage.');
    console.log('\n🧪 Test it by:');
    console.log('1. Going to /admin');
    console.log('2. Creating a new project with an image');
    console.log('3. Verifying the image uploads successfully');

  } catch (error) {
    console.error('❌ Failed to apply CORS configuration:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you are authenticated: gcloud auth login');
    console.log('2. Verify the bucket name is correct');
    console.log('3. Check that cors.json is valid JSON');
    console.log('4. Try running the command manually: gsutil cors set cors.json gs://studio-7639868049-100f7.firebasestorage.app');
    process.exit(1);
  }
}

// Alternative: Manual setup instructions
function showManualInstructions() {
  console.log('📋 Manual CORS Configuration Instructions:\n');

  console.log('Since gsutil is not available, follow these manual steps:\n');

  console.log('1. Go to Google Cloud Console:');
  console.log('   https://console.cloud.google.com/storage/browser\n');

  console.log('2. Select your project: studio-7639868049-100f7\n');

  console.log('3. Click on the bucket: studio-7639868049-100f7.firebasestorage.app\n');

  console.log('4. Go to the "Configuration" tab\n');

  console.log('5. In "CORS configuration", paste this JSON:\n');

  const corsConfig = fs.readFileSync(CORS_CONFIG_FILE, 'utf8');
  console.log(corsConfig);

  console.log('\n6. Click "Save"\n');

  console.log('7. Wait a few minutes for the changes to take effect\n');

  console.log('8. Test by uploading an image in the admin panel\n');
}

console.log('🔧 Firebase Storage CORS Setup\n');

// Check if running with --manual flag
if (process.argv.includes('--manual')) {
  showManualInstructions();
} else {
  // Try automatic setup first
  try {
    setupCORS();
  } catch (error) {
    console.log('\n❌ Automatic setup failed. Showing manual instructions...\n');
    showManualInstructions();
  }
}