import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

export interface FirebaseConfigKeys {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Default or LocalStorage saved Firebase Configuration
const getSavedFirebaseConfig = (): FirebaseConfigKeys => {
  const saved = localStorage.getItem('krishi_firebase_custom_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved Firebase config', e);
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKrishiCopilotMockKey12345",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "krishi-copilot-dev.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "krishi-copilot-dev",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "krishi-copilot-dev.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
  };
};

export const currentFirebaseConfig = getSavedFirebaseConfig();

export const saveCustomFirebaseConfig = (config: FirebaseConfigKeys) => {
  localStorage.setItem('krishi_firebase_custom_config', JSON.stringify(config));
  window.location.reload();
};

export const clearCustomFirebaseConfig = () => {
  localStorage.removeItem('krishi_firebase_custom_config');
  window.location.reload();
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(currentFirebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const isRealFirebaseConfigured = (): boolean => {
  return (
    Boolean(currentFirebaseConfig.apiKey) && 
    !currentFirebaseConfig.apiKey.includes('DemoKrishi')
  );
};

export const isFirebaseConfigured = isRealFirebaseConfigured;
