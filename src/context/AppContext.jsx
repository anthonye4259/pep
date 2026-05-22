import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [appState, setAppState] = useState(() => {
    try {
      const saved = localStorage.getItem('peptidai_app_state');
      return saved ? JSON.parse(saved) : { step: 'onboarding', user: null };
    } catch { return { step: 'onboarding', user: null }; }
  });
  const [vials, setVials] = useState([]);
  const [schedules, setSchedules] = useState(() => {
    try { return JSON.parse(localStorage.getItem('peptidai_schedules') || '[]'); } catch { return []; }
  });

  // Persist app state
  useEffect(() => {
    localStorage.setItem('peptidai_app_state', JSON.stringify(appState));
  }, [appState]);

  // Listen to auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && appState.step === 'app') {
        setAppState(prev => ({ ...prev, user: { uid: user.uid, email: user.email, displayName: user.displayName } }));
      }
    });
    return unsub;
  }, [appState.step]);

  // Listen to vials from Firestore
  useEffect(() => {
    if (!appState.user?.uid) return;
    const vialsRef = collection(db, 'users', appState.user.uid, 'vials');
    const q = query(vialsRef, orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setVials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error('Firestore vials error:', err);
    });
    return unsub;
  }, [appState.user?.uid]);

  async function saveVial(vialData) {
    if (!appState.user?.uid) return;
    const vialsRef = collection(db, 'users', appState.user.uid, 'vials');
    // Check if this vial already exists (same peptide name)
    const existing = vials.find(v => v.peptideName === vialData.peptideName);
    const docRef = existing ? doc(vialsRef, existing.id) : doc(vialsRef);
    await setDoc(docRef, { ...vialData, updatedAt: new Date().toISOString() }, { merge: true });
  }

  async function deleteVial(vialId) {
    if (!appState.user?.uid || !vialId) return;
    await deleteDoc(doc(db, 'users', appState.user.uid, 'vials', vialId));
  }

  function saveSchedule(schedule) {
    setSchedules(prev => {
      const updated = [...prev.filter(s => s.id !== schedule.id), schedule];
      localStorage.setItem('peptidai_schedules', JSON.stringify(updated));
      return updated;
    });
  }

  function deleteSchedule(id) {
    setSchedules(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('peptidai_schedules', JSON.stringify(updated));
      return updated;
    });
  }

  function completeOnboarding() { setAppState(prev => ({ ...prev, step: 'auth' })); }
  function completeAuth(user) { setAppState(prev => ({ ...prev, step: 'paywall', user: { uid: user.uid, email: user.email, displayName: user.displayName } })); }
  function completePaywall() { setAppState(prev => ({ ...prev, step: 'app' })); }
  function resetApp() {
    localStorage.removeItem('peptidai_app_state');
    localStorage.removeItem('peptidai_schedules');
    setAppState({ step: 'onboarding', user: null });
    setVials([]);
    setSchedules([]);
  }

  return (
    <AppContext.Provider value={{
      appState, vials, schedules,
      saveVial, deleteVial, saveSchedule, deleteSchedule,
      completeOnboarding, completeAuth, completePaywall, resetApp,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
