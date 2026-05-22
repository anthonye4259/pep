// Firebase configuration — REPLACE with your real config from Firebase Console
// Go to: console.firebase.google.com → Project Settings → General → Your apps → Web app
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCyNKg9JF4GQ-PPLJ0M4o3iUB4n9w_q_CQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pepi-a57da.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pepi-a57da",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pepi-a57da.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID || "631653741356",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:631653741356:web:8dd16c475f86746d3f7289",
  measurementId: "G-HN01ZFS5GM",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence — Firestore caches data locally
// so the app works offline and syncs when reconnected
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open — persistence can only be enabled in one tab
    console.warn('Firestore persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support IndexedDB
    console.warn('Firestore persistence not available in this browser');
  }
});

export default app;
