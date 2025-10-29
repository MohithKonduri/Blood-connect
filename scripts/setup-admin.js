// Admin Setup Script for NSS BloodConnect
// Run this after setting up Firebase to create admin users

const {
    initializeApp
} = require('firebase/app');
const {
    getAuth,
    createUserWithEmailAndPassword
} = require('firebase/auth');
const {
    getFirestore,
    doc,
    setDoc
} = require('firebase/firestore');

// You'll need to replace these with your actual Firebase config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function setupAdmin() {
    try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        // Admin credentials - CHANGE THESE!
        const adminEmail = 'admin@nss-bloodconnect.com';
        const adminPassword = 'AdminPassword123!';

        console.log('🔐 Creating admin user...');

        // Create admin user
        const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        const adminUser = userCredential.user;

        // Add admin role to Firestore
        await setDoc(doc(db, 'admins', adminUser.uid), {
            email: adminEmail,
            role: 'admin',
            name: 'NSS Admin',
            createdAt: new Date(),
        });

        console.log('✅ Admin user created successfully!');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log('⚠️  Please change the password after first login!');

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
    }
}

// Only run if called directly
if (require.main === module) {
    setupAdmin();
}

module.exports = {
    setupAdmin
};