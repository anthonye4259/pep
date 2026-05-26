// Firebase configuration — REPLACE with your real config from Firebase Console
// Go to: console.firebase.google.com → Project Settings → General → Your apps → Web app
import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getRemoteConfig } from 'firebase/remote-config';

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

// CRITICAL: Use browserLocalPersistence (localStorage) instead of the default
// indexedDBLocalPersistence. IndexedDB deadlocks in WKWebView on iOS/iPadOS,
// causing signIn and createUser to hang indefinitely.
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

export const db = getFirestore(app);
export const remoteConfig = getRemoteConfig(app);
// Set fetch interval to 1 hour (default is 12)
remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

export default app;
