# Firebase Setup Guide for NSS BloodConnect

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `nss-bloodconnect` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" authentication
3. Save the configuration

## Step 3: Create Firestore Database

1. Go to "Firestore Database" in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your region)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon) → "General" tab
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Register app with name: "NSS BloodConnect"
5. Copy the Firebase configuration object

## Step 5: Create Environment File

Create a file named `.env.local` in your project root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

Replace the placeholder values with your actual Firebase configuration.

## Step 6: Set Up Firestore Security Rules

In Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own donor data
    match /donors/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow admins to read all donor data
    match /donors/{document} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow emergency notifications to be created by authenticated users
    match /emergencyNotifications/{document} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Admin collection - only admins can access
    match /admins/{document} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Step 7: Create Admin Users

1. Go to Authentication → Users
2. Add admin users manually or create them programmatically
3. In Firestore, create a collection called "admins"
4. Add documents with admin user IDs and role: "admin"

## Step 8: Test the Connection

1. Restart your development server: `npm run dev`
2. Try registering a new user
3. Check Firestore to see if data is being saved
4. Test admin login functionality

## Collections Structure

Your Firestore will have these collections:

- `donors` - User donor profiles
- `emergencyNotifications` - Emergency contact requests
- `admins` - Admin user roles
- `emergencyRequests` - Public emergency requests

## Security Notes

- Never commit `.env.local` to version control
- Use production security rules for live deployment
- Regularly backup your Firestore data
- Monitor authentication and database usage

## Troubleshooting

- Check browser console for Firebase errors
- Verify environment variables are loaded
- Ensure Firestore rules allow your operations
- Check Firebase project billing and quotas
