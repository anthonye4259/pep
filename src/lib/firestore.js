import { db } from './firebase';
import {
  doc, getDoc, setDoc, updateDoc, onSnapshot,
  collection, addDoc, deleteDoc, query, orderBy, getDocs,
  serverTimestamp
} from 'firebase/firestore';

// ─── User Document ───

export async function createUserDoc(uid, data) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      ...data,
      subscription: { plan: null, status: 'none', expiresAt: null, provider: null },
      settings: { notifications: true, units: 'mcg' },
      onboardingAnswers: data.onboardingAnswers || null,
      createdAt: serverTimestamp(),
    });
  }
  return ref;
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, 'users', uid), data);
}

// Real-time listener on user doc
export function onUserSnapshot(uid, callback) {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback(snap.exists() ? snap.data() : null);
  });
}

// ─── Protocol ───

export async function getProtocol(uid) {
  const snap = await getDocs(
    query(collection(db, 'users', uid, 'protocol'), orderBy('addedAt', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addProtocolItem(uid, item) {
  const ref = await addDoc(collection(db, 'users', uid, 'protocol'), {
    ...item,
    addedAt: item.addedAt || new Date().toISOString(),
  });
  return ref.id;
}

export async function updateProtocolItem(uid, itemId, updates) {
  await updateDoc(doc(db, 'users', uid, 'protocol', itemId), updates);
}

export async function removeProtocolItem(uid, itemId) {
  await deleteDoc(doc(db, 'users', uid, 'protocol', itemId));
}

// ─── Dose Log ───

export async function getDoseLog(uid) {
  const snap = await getDocs(
    query(collection(db, 'users', uid, 'doseLog'), orderBy('timestamp', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addDoseLog(uid, entry) {
  const ref = await addDoc(collection(db, 'users', uid, 'doseLog'), {
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  });
  return ref.id;
}

export async function deleteDoseLog(uid, logId) {
  await deleteDoc(doc(db, 'users', uid, 'doseLog', logId));
}

// ─── Progress Notes ───

export async function getProgress(uid) {
  const snap = await getDocs(
    query(collection(db, 'users', uid, 'progress'), orderBy('timestamp', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addProgress(uid, entry) {
  const ref = await addDoc(collection(db, 'users', uid, 'progress'), {
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  });
  return ref.id;
}

export async function deleteProgress(uid, entryId) {
  await deleteDoc(doc(db, 'users', uid, 'progress', entryId));
}

// ─── Subscription ───

export async function updateSubscription(uid, subscriptionData) {
  await updateDoc(doc(db, 'users', uid), {
    subscription: subscriptionData,
  });
}

export async function getSubscription(uid) {
  const userData = await getUserDoc(uid);
  return userData?.subscription || { plan: null, status: 'none', expiresAt: null };
}

// ─── Onboarding Answers ───

export async function saveOnboardingAnswers(uid, answers) {
  await updateDoc(doc(db, 'users', uid), {
    onboardingAnswers: answers,
  });
}
