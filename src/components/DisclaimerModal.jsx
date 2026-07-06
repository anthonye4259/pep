import { useState } from 'react';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { AI_CONSENT_VERSION, AI_DISCLOSURE_TEXT, acceptAIConsent } from '../lib/aiConsent';

export default function DisclaimerModal() {
  const [show, setShow] = useState(() => {
    const accepted = localStorage.getItem(`peptidai_disclaimer_${AI_CONSENT_VERSION}`);
    return !accepted;
  });

  function handleAccept() {
    localStorage.setItem(`peptidai_disclaimer_${AI_CONSENT_VERSION}`, 'true');
    acceptAIConsent();
    setShow(false);
  }

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: 28,
        maxWidth: 400, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 28,
          background: '#fff5f8', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <IoShieldCheckmarkOutline size={28} color="var(--accent)" />
        </div>

        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 16, color: 'var(--text)', textAlign: 'center' }}>
          Important Notices
        </h2>

        {/* AI Data Sharing */}
        <div style={{ background: '#fff5f8', border: '1px solid #fecdd3', padding: 16, borderRadius: 14, marginBottom: 16 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>AI Data Sharing</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
            {AI_DISCLOSURE_TEXT}
          </p>
        </div>

        {/* Health Disclaimer */}
        <div style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 14, marginBottom: 16 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Health Disclaimer</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            PeptidAI is for tracking and educational purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. Always consult a qualified healthcare professional before making changes to your health routine.
          </p>
        </div>

        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16 }}>
          By tapping "I Understand & Agree", you consent to the AI data sharing described above. <a href="https://peptidai.web.app/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Privacy Policy</a>
        </p>

        <button
          onClick={handleAccept}
          style={{
            width: '100%', padding: 16, borderRadius: 100,
            background: 'linear-gradient(135deg, var(--accent), #c27c8f)',
            color: 'white', border: 'none', fontSize: '1rem',
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
}
