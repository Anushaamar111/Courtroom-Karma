import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Check if we're in development mode without real Firebase config
const isDevelopmentMode = 
  !import.meta.env.VITE_FIREBASE_API_KEY || 
  import.meta.env.VITE_FIREBASE_API_KEY === "demo-api-key" ||
  import.meta.env.VITE_FIREBASE_API_KEY === "dev-mode";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isDevelopmentMode) {
  console.log("🚀 Running in development mode - Firebase authentication is mocked");
  
  // Create a minimal Firebase config for development
  const devConfig = {
    apiKey: "dev-mode",
    authDomain: "localhost",
    projectId: "dev-project",
    storageBucket: "dev-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "dev-app-id"
  };
  
  app = initializeApp(devConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
} else {
  // Production mode with real Firebase config
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export const googleProvider = new GoogleAuthProvider();
export { auth, db, isDevelopmentMode };
export default app;
