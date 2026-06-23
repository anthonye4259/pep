import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoPersonCircleOutline, IoChevronForward, IoLogOutOutline, IoTrashOutline, IoShieldCheckmarkOutline, IoDocumentTextOutline, IoMailOutline, IoCardOutline, IoHelpCircleOutline } from 'react-icons/io5';
import { auth } from '../lib/firebase';
import { signOut, deleteUser } from 'firebase/auth';
import { useApp } from '../context/AppContext';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';
import { shouldShowHealthKit } from '../lib/deviceCheck';

export default function Settings() {
  const navigate = useNavigate();
  const { appState, resetApp, scheduleDailyReminder, cancelReminders } = useApp();
  const [showDelete, setShowDelete] = useState(false);
  const [manageUrl, setManageUrl] = useState('https://apps.apple.com/account/subscriptions');
  const [healthAvailable, setHealthAvailable] = useState(false);
  const user = appState.user;

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      Purchases.getCustomerInfo().then(info => {
        if (info?.customerInfo?.managementURL) {
          setManageUrl(info.customerInfo.managementURL);
        }
      }).catch(e => console.error('RC CustomerInfo error:', e));

      // Only show HealthKit on iPhone — iPad reports available but doesn't work
      if (shouldShowHealthKit()) {
        (async () => {
          try {
            const { Health } = await import('@capgo/capacitor-health');
            const result = await Health.isAvailable();
            if (result && result.available) setHealthAvailable(true);
          } catch { /* not available */ }
        })();
      }
    }
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    resetApp();
  }

  async function handleDeleteAccount() {
    try {
      await deleteUser(auth.currentUser);
      resetApp();
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        alert('For security, please sign out and sign back in before deleting your account.');
      } else {
        alert('Error deleting account. Please try again.');
      }
    }
  }

  const menuItems = [
    { label: 'Manage Subscription', icon: IoCardOutline, action: () => window.open(manageUrl, '_blank') },
    { label: 'Privacy Policy', icon: IoShieldCheckmarkOutline, action: () => navigate('/privacy') },
    { label: 'Terms of Service', icon: IoDocumentTextOutline, action: () => navigate('/terms') },
    { label: 'Contact Support', icon: IoMailOutline, action: () => window.open('mailto:support@peptidai.com') },
  ];

  return (
    <div className="page">
      <div className="page-header"><h1>Settings</h1></div>

      {/* Profile card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <IoPersonCircleOutline size={48} color="#ccc" />
        <div>
          <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{user?.displayName || 'User'}</div>
          <div style={{ fontSize: '0.8rem', color: '#999' }}>{user?.email}</div>
          <div style={{ fontSize: '0.72rem', color: '#34c759', marginTop: 2, fontWeight: 600 }}>PRO</div>
        </div>
      </div>

      {/* Preferences Section */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>Preferences</h3>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          
          {/* Apple Health Sync — only show on iPhone */}
          {healthAvailable && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', paddingRight: 12 }}>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>Apple Health Sync</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automatically sync Sleep Analysis and Active Energy Burned to prepopulate your daily journal entries.</span>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '8px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                onClick={async () => {
                  try {
                    const { Health } = await import('@capgo/capacitor-health');
                    await Health.requestAuthorization({
                      read: ['sleepAnalysis', 'activeEnergyBurned'],
                    });
                    alert('Apple Health connected successfully!');
                  } catch (e) {
                    console.error('Health connect error:', e);
                    alert('Could not connect to Apple Health.');
                  }
                }}
              >
                Connect
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>Daily Reminders</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get notified to check your protocol</span>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
              <input 
                type="checkbox" 
                style={{ opacity: 0, width: 0, height: 0 }}
                onChange={async (e) => {
                  const checked = e.target.checked;
                  if (checked) {
                    // Default to 8:00 AM
                    const success = await scheduleDailyReminder(8, 0);
                    if (success) e.target.checked = true;
                    else { e.target.checked = false; alert("Please enable notifications in your phone's Settings."); }
                  } else {
                    await cancelReminders();
                  }
                }} 
              />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', transition: '.4s', borderRadius: 24 }}>
                <span style={{ position: 'absolute', content: '""', height: 18, width: 18, left: 3, bottom: 3, backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }} className="slider-knob"></span>
              </span>
              <style>{`
                input:checked + span { background-color: var(--accent); }
                input:checked + span .slider-knob { transform: translateX(20px); }
              `}</style>
            </label>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {menuItems.map((item, i) => (
          <button key={i} onClick={item.action} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
            background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'Inter',
            fontSize: '0.9rem', color: '#1a1a1a',
          }}>
            <item.icon size={20} color="#999" />
            <span style={{ flex: 1 }}>{item.label}</span>
            <IoChevronForward size={16} color="#ccc" />
          </button>
        ))}
      </div>

      {/* Sign out */}
      <button onClick={handleSignOut} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', padding: 14, marginTop: 32, background: 'none',
        border: '1px solid #e5e5e5', borderRadius: 12, cursor: 'pointer',
        fontFamily: 'Inter', fontSize: '0.9rem', color: '#666', fontWeight: 500,
      }}>
        <IoLogOutOutline size={18} /> Sign Out
      </button>

      {/* Delete account */}
      <button onClick={() => setShowDelete(true)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: '100%', padding: 14, marginTop: 10, background: 'none',
        border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, cursor: 'pointer',
        fontFamily: 'Inter', fontSize: '0.85rem', color: '#ff3b30', fontWeight: 500,
      }}>
        <IoTrashOutline size={16} /> Delete Account
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#ccc', marginTop: 20 }}>PeptidAI v1.0.0</p>

      <div className="settings-group">
        <Link to="/referrals" className="settings-item">
          <div>
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Share PeptidAI with Friends</span>
          </div>
          <IoChevronForward color="#999" />
        </Link>
      </div>

      {/* Delete confirmation */}
      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 8 }}>Delete Account?</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 20 }}>This will permanently delete your account, saved vials, and all data. This cannot be undone.</p>
            <button className="btn btn-full" style={{ background: '#ff3b30', color: 'white', marginBottom: 8 }} onClick={handleDeleteAccount}>Delete Permanently</button>
            <button className="btn btn-secondary btn-full" onClick={() => setShowDelete(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
