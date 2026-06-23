import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Share } from '@capacitor/share';

export default function Referrals() {
  const { appState } = useApp();
  const [copied, setCopied] = useState(false);
  // Generate a simple 6-character code from the user's UID
  const inviteCode = appState.user?.uid ? appState.user.uid.substring(0, 6).toUpperCase() : 'PEPTI';

  async function shareLink() {
    const url = `peptidai://invite?code=${inviteCode}`;
    try {
      await Share.share({
        title: 'Join PeptidAI',
        text: 'I use PeptidAI to track my wellness protocols. Use my code to join the community!',
        url: url,
        dialogTitle: 'Share Invite Link'
      });
    } catch (e) {
      console.error(e);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Refer a Friend</h1>
        <p>Share the knowledge</p>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '40px 20px', marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Your Invite Code</h2>
        <div style={{ background: '#fff5f8', color: 'var(--accent)', padding: '16px', borderRadius: '12px', fontSize: '2rem', letterSpacing: '4px', fontWeight: 700, margin: '20px 0' }}>
          {inviteCode}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={copyCode}>{copied ? 'Copied!' : 'Copy Code'}</button>
          <button className="btn btn-primary" onClick={shareLink}>Share Link</button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>How it works</h3>
        <ul style={{ paddingLeft: 20, color: '#666', lineHeight: 1.6, margin: 0 }}>
          <li>Share your unique code or link with a friend.</li>
          <li>When they sign up, they'll get access to PeptidAI's wellness tools!</li>
        </ul>
      </div>
    </div>
  );
}
