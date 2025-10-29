import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let firebaseApp: any = null
let firebaseAuth: any = null
let firebaseDb: any = null

function initializeFirebase() {
  if (firebaseApp) return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb }

  // Only initialize if we have the required config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    console.warn("[v0] Firebase config incomplete - skipping initialization")
    console.warn("Missing config:", {
      apiKey: !!firebaseConfig.apiKey,
      projectId: !!firebaseConfig.projectId,
      appId: !!firebaseConfig.appId
    })
    return { app: null, auth: null, db: null }
  }

  // Check if Firebase app already exists
  const existingApps = getApps()
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0]
  } else {
    firebaseApp = initializeApp(firebaseConfig)
  }

  firebaseAuth = getAuth(firebaseApp)
  firebaseDb = getFirestore(firebaseApp)

  return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb }
}

// Initialize on first import
const { app: initialApp, auth: initialAuth, db: initialDb } = initializeFirebase()

export const auth = initialAuth
export const db = initialDb
