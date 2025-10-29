#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup for NSS BloodConnect\n');

const envContent = `# Firebase Configuration
# Replace these values with your Firebase project credentials

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
`;

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Please update it manually with your Firebase credentials.');
} else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file');
    console.log('📝 Please update the file with your Firebase project credentials');
}

console.log('\n📋 Next steps:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable Authentication (Email/Password)');
console.log('4. Create Firestore Database');
console.log('5. Get your Firebase config from Project Settings');
console.log('6. Update .env.local with your credentials');
console.log('7. Restart your development server');

console.log('\n📖 See FIREBASE_SETUP.md for detailed instructions');