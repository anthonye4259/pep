import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  OAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { createUserDoc } from './firestore';

// ─── Email/Password ───
export async function signUp(email, password, name) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  // Create Firestore user document
  await createUserDoc(cred.user.uid, {
    email,
    name,
    createdAt: new Date().toISOString(),
  });
  return cred.user;
}

export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ─── Apple Sign-In ───
export async function signInWithApple() {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  try {
    const result = await signInWithPopup(auth, provider);
    // Create doc if first time
    await createUserDoc(result.user.uid, {
      email: result.user.email,
      name: result.user.displayName || 'PeptidAI User',
      createdAt: new Date().toISOString(),
      provider: 'apple',
    });
    return result.user;
  } catch (err) {
    // On mobile/Capacitor, popup may fail — fall back to redirect
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, provider);
      return null; // will resolve on redirect back
    }
    throw err;
  }
}

// ─── Google Sign-In ───
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    await createUserDoc(result.user.uid, {
      email: result.user.email,
      name: result.user.displayName || 'PeptidAI User',
      createdAt: new Date().toISOString(),
      provider: 'google',
    });
    return result.user;
  } catch (err) {
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
}

// ─── Handle redirect results (for mobile) ───
export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      await createUserDoc(result.user.uid, {
        email: result.user.email,
        name: result.user.displayName || 'PeptidAI User',
        createdAt: new Date().toISOString(),
      });
      return result.user;
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Sign Out ───
export async function signOut() {
  await firebaseSignOut(auth);
}

// ─── Auth State Listener ───
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ─── Get Current User ───
export function getCurrentUser() {
  return auth.currentUser;
}
