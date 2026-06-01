import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoPersonCircleOutline, IoChevronForward, IoLogOutOutline, IoTrashOutline, IoShieldCheckmarkOutline, IoDocumentTextOutline, IoMailOutline, IoCardOutline, IoHelpCircleOutline } from 'react-icons/io5';
import { auth } from '../lib/firebase';
import { signOut, deleteUser } from 'firebase/auth';
import { useApp } from '../context/AppContext';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

export default function Settings() {
  const navigate = useNavigate();
  const { appState, resetApp } = useApp();
  const [showDelete, setShowDelete] = useState(false);
  const [manageUrl, setManageUrl] = useState('https://apps.apple.com/account/subscriptions');
  const user = appState.user;

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      Purchases.getCustomerInfo().then(info => {
        if (info?.customerInfo?.managementURL) {
          setManageUrl(info.customerInfo.managementURL);
        }
      }).catch(e => console.error('RC CustomerInfo error:', e));
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
    { label: 'Reconstitution Guide', icon: IoHelpCircleOutline, action: () => navigate('/reconstitution-guide') },
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
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Refer a Friend (Get 1 Month Free)</span>
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
