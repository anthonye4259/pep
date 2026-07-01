import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { shouldShowHealthKit } from '../lib/deviceCheck';

// === SAFE LAZY PLUGIN LOADING ===
// These plugins MUST NOT be imported at the top level because they crash
// the entire module on devices where the native plugin isn't registered
// (e.g. iPad where HealthKit isn't available, or web builds).
// Instead we load them on first use inside a try/catch.

let _CapApp = null;
async function getCapApp() {
  if (_CapApp) return _CapApp;
  try { const m = await import('@capacitor/app'); _CapApp = m.App; return _CapApp; }
  catch (e) { console.warn('CapApp not available:', e.message); return null; }
}

let _Purchases = null;
async function getPurchases() {
  if (_Purchases) return _Purchases;
  try { const m = await import('@revenuecat/purchases-capacitor'); _Purchases = m.Purchases; return _Purchases; }
  catch (e) { console.warn('RevenueCat not available:', e.message); return null; }
}

let _Health = null;
async function getHealth() {
  if (_Health) return _Health;
  try { const m = await import('@capgo/capacitor-health'); _Health = m.Health; return _Health; }
  catch (e) { console.warn('Health plugin not available:', e.message); return null; }
}

let _LocalNotifications = null;
async function getLocalNotifications() {
  if (_LocalNotifications) return _LocalNotifications;
  try { const m = await import('@capacitor/local-notifications'); _LocalNotifications = m.LocalNotifications; return _LocalNotifications; }
  catch (e) { console.warn('LocalNotifications not available:', e.message); return null; }
}

const REVIEW_EMAIL = 'review@peptidai.com';
const REVIEW_EMAIL_ALT = 'appreview@peptidai.com';

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
  const [journal, setJournal] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // Initialize RevenueCat (async — won't block or crash render)
  useEffect(() => {
    (async () => {
      try {
        const Purchases = await getPurchases();
        if (!Purchases) return;
        const rcKey = import.meta.env.VITE_REVENUECAT_APPLE_KEY || "appl_REPLACE_ME_WHEN_READY";
        Purchases.configure({ apiKey: rcKey });
      } catch (e) { console.warn('RevenueCat config warning', e); }
    })();
  }, []);

  // Listen for Deep Links (Referrals and Templates)
  useEffect(() => {
    let listenerHandle = null;
    (async () => {
      try {
        const CapApp = await getCapApp();
        if (!CapApp) return;
        listenerHandle = await CapApp.addListener('appUrlOpen', (event) => {
          try {
            const url = new URL(event.url);
            if (url.protocol === 'peptidai:') {
              if (url.host === 'invite') {
                const code = url.searchParams.get('code');
                if (code) {
                  localStorage.setItem('peptidai_invite_code', code);
                  alert('Invite code applied!');
                }
              } else if (url.host === 'template') {
                const data = url.searchParams.get('data');
                if (data) {
                  const decoded = JSON.parse(atob(data));
                  if (window.confirm(`Import Protocol Template: ${decoded.name || 'Custom Protocol'}?`)) {
                    saveSchedule({ ...decoded, id: Date.now().toString() });
                    alert('Protocol imported successfully!');
                  }
                }
              }
            }
          } catch (e) {
            console.error('Deep link error', e);
          }
        });
      } catch (e) { console.warn('Deep link listener not available:', e.message); }
    })();
    return () => { if (listenerHandle) listenerHandle.remove(); };
  }, []);

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

  // Listen to vials and journal from Firestore
  useEffect(() => {
    if (!appState.user?.uid) return;
    
    // Vials
    const vialsRef = collection(db, 'users', appState.user.uid, 'vials');
    const qVials = query(vialsRef, orderBy('updatedAt', 'desc'));
    const unsubVials = onSnapshot(qVials, (snap) => {
      setVials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error('Firestore vials error:', err));
    
    // Journal
    const journalRef = collection(db, 'users', appState.user.uid, 'journal');
    const qJournal = query(journalRef, orderBy('date', 'desc'));
    const unsubJournal = onSnapshot(qJournal, (snap) => {
      setJournal(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error('Firestore journal error:', err));

    // User Profile (for usage limits and protocol)
    const profileRef = doc(db, 'users', appState.user.uid);
    const unsubProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) setUserProfile(docSnap.data());
      else setUserProfile({});
    }, (err) => console.error('Firestore profile error:', err));

    return () => { unsubVials(); unsubJournal(); unsubProfile(); };
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

  async function saveJournalEntry(entry) {
    if (!appState.user?.uid) return;
    const docRef = doc(db, 'users', appState.user.uid, 'journal', entry.date);
    await setDoc(docRef, { ...entry, updatedAt: new Date().toISOString() }, { merge: true });
  }

  async function updateProfileData(data) {
    if (!appState.user?.uid) return;
    const profileRef = doc(db, 'users', appState.user.uid);
    await setDoc(profileRef, data, { merge: true });
  }

  function completeOnboarding(answers) { setAppState(prev => ({ ...prev, step: 'auth', onboardingAnswers: answers })); }
  
  async function completeAuth(user) { 
    const userData = { uid: user.uid, email: user.email, displayName: user.displayName };
    
    // Apple reviewer bypass: auto-complete onboarding, force paywall
    const emailLower = user.email?.toLowerCase();
    if (emailLower === REVIEW_EMAIL || emailLower === REVIEW_EMAIL_ALT) {
      console.log('[Review] Reviewer detected, skipping to paywall');
      setAppState(prev => ({ ...prev, step: 'paywall', user: userData, subscribed: false }));
      return;
    }
    
    try {
      const Purchases = await getPurchases();
      if (Purchases) {
        // Race RevenueCat against a 5-second timeout so the app never hangs
        const rcResult = await Promise.race([
          (async () => {
            await Purchases.logIn({ appUserID: user.uid });
            return await Purchases.getCustomerInfo();
          })(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('RC timeout')), 5000))
        ]);
        const active = rcResult.customerInfo.entitlements.active;
        if (active['premium'] || active['peptid ai Premium']) {
          setAppState(prev => ({ ...prev, step: 'app', user: userData }));
          return;
        }
      }
    } catch (e) { console.warn('RevenueCat check skipped:', e.message); }
    
    setAppState(prev => ({ ...prev, step: 'paywall', user: userData })); 
  }
  
  function completePaywall() { setAppState(prev => ({ ...prev, step: 'app' })); }
  function resetApp() {
    localStorage.removeItem('peptidai_app_state');
    localStorage.removeItem('peptidai_schedules');
    setAppState({ step: 'onboarding', user: null });
    setVials([]);
    setSchedules([]);
  }

  // Generic function to sync data from Apple Health
  const syncAppleHealth = async () => {
    try {
      // Guard: Only works on native iPhone (not iPad, not web)
      if (!Capacitor.isNativePlatform() || !shouldShowHealthKit()) {
        return { success: false, error: 'Not available on this device' };
      }
      const Health = await getHealth();
      if (!Health) return { success: false, error: 'Health plugin not available' };

      const available = await Health.isAvailable();
      if (!available || !available.available) {
        return { success: false, error: 'Apple Health is not available on this device.' };
      }

      await Health.requestAuthorization({
        read: ['sleepAnalysis', 'activeEnergyBurned'],
      });

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Fetch sleep analysis for the last 24 hours
      const sleepData = await Health.query({
        sampleType: 'sleepAnalysis',
        startDate: yesterday.toISOString(),
        endDate: today.toISOString(),
      });

      // Calculate total sleep hours
      let totalSleepHours = 0;
      if (sleepData && sleepData.resultData) {
        sleepData.resultData.forEach(entry => {
          if (entry.value === 1) {
            const start = new Date(entry.startDate);
            const end = new Date(entry.endDate);
            totalSleepHours += (end - start) / (1000 * 60 * 60);
          }
        });
      }

      // Fetch active energy burned for the last 24 hours
      const energyData = await Health.query({
        sampleType: 'activeEnergyBurned',
        startDate: yesterday.toISOString(),
        endDate: today.toISOString(),
      });

      // Calculate total active calories
      let totalActiveCalories = 0;
      if (energyData && energyData.resultData) {
        energyData.resultData.forEach(entry => {
          totalActiveCalories += entry.value || 0;
        });
      }

      // Convert sleep hours to a 1-10 rating (assume 8 hours = 10/10)
      let sleepRating = 5;
      if (totalSleepHours > 0) {
        sleepRating = Math.min(10, Math.round((totalSleepHours / 8) * 10));
      }

      return {
        sleepHours: Math.round(totalSleepHours * 10) / 10,
        activeCalories: Math.round(totalActiveCalories),
        sleepRating,
        success: true
      };
    } catch (e) {
      console.error('Apple Health Sync Error:', e);
      return { success: false, error: e.message };
    }
  };

  const scheduleDailyReminder = async (hour, minute) => {
    try {
      const LN = await getLocalNotifications();
      if (!LN) return false;
      const permStatus = await LN.requestPermissions();
      if (permStatus.display !== 'granted') return false;

      await LN.cancel({ notifications: [{ id: 1 }] });
      
      await LN.schedule({
        notifications: [
          {
            title: "PeptidAI Check-In",
            body: "Good morning! Open PeptidAI to check today's protocol and log your biometrics.",
            id: 1,
            schedule: { on: { hour, minute }, allowWhileIdle: true },
            sound: null,
            attachments: null,
            actionTypeId: "",
            extra: null
          }
        ]
      });
      return true;
    } catch (e) {
      console.error("Notification Error:", e);
      return false;
    }
  };

  const cancelReminders = async () => {
    try {
      const LN = await getLocalNotifications();
      if (LN) await LN.cancel({ notifications: [{ id: 1 }] });
    } catch (e) {
      console.error("Cancel Error:", e);
    }
  };

  return (
    <AppContext.Provider value={{
      appState, setAppState,
      vials, setVials, saveVial, deleteVial,
      schedules, saveSchedule, deleteSchedule,
      journal, saveJournalEntry,
      userProfile, updateProfileData,
      completeOnboarding, completeAuth, completePaywall, resetApp,
      syncAppleHealth, scheduleDailyReminder, cancelReminders
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
