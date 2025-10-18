#!/usr/bin/env node

/**
 * Quick CORS Setup for Firebase Storage
 *
 * This script provides a quick way to configure CORS for Firebase Storage
 * to allow image uploads from localhost and production domains.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Firebase Storage CORS Quick Setup\n');

// Check if cors.json exists
const corsPath = path.join(__dirname, 'cors.json');
if (!fs.existsSync(corsPath)) {
  console.log('❌ cors.json not found. Creating it...\n');

  const corsConfig = [
    {
      "origin": ["http://localhost:3000", "http://localhost:3001", "http://localhost:9002", "https://studio-7639868049-100f7.web.app", "https://studio-7639868049-100f7.firebaseapp.com"],
      "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
      "maxAgeSeconds": 3600,
      "responseHeader": ["Content-Type", "Authorization", "Content-Length", "Accept-Encoding", "X-CSRF-Token"]
    }
  ];

  fs.writeFileSync(corsPath, JSON.stringify(corsConfig, null, 2));
  console.log('✅ cors.json created successfully\n');
}

console.log('📋 To configure CORS, run one of these commands:\n');

// Option 1: Using gsutil (recommended)
console.log('1️⃣ Using Google Cloud SDK (gsutil):');
console.log('   gsutil cors set cors.json gs://studio-7639868049-100f7.firebasestorage.app\n');

// Option 2: Manual setup
console.log('2️⃣ Manual setup in Google Cloud Console:');
console.log('   1. Go to: https://console.cloud.google.com/storage/browser');
console.log('   2. Select bucket: studio-7639868049-100f7.firebasestorage.app');
console.log('   3. Go to "Configuration" tab');
console.log('   4. Paste the contents of cors.json in "CORS configuration"');
console.log('   5. Click "Save"\n');

// Alternative: Use direct image URLs
console.log('🚀 Quick Fix: Use Direct Image URLs');
console.log('   If CORS setup is too complex, you can:');
console.log('   1. Upload images to a service like Imgur, Cloudinary, or GitHub');
console.log('   2. Use the direct image URLs in the admin panel');
console.log('   3. This bypasses Firebase Storage CORS issues entirely\n');

console.log('📖 For detailed instructions, see FIREBASE_SETUP.md\n');

console.log('🎯 Test your setup:');
console.log('   1. Go to /admin');
console.log('   2. Try creating a project with an image');
console.log('   3. If it works, CORS is configured correctly!\n');