import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { AI_DISCLOSURE_TEXT } from '../lib/aiConsent';

export default function AIConsentModal({ isOpen, onAccept, onDecline }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 200, display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }} onClick={onDecline}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg)', width: '100%', padding: 24,
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
        borderRadius: '24px 24px 0 0',
        animation: 'slideUp 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <IoShieldCheckmarkOutline size={24} color="var(--accent)" />
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>AI Data Disclosure</h2>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
          PeptidAI uses external AI services to generate your personalized wellness plan. Review the disclosure before continuing:
        </p>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, whiteSpace: 'pre-line' }}>
          {AI_DISCLOSURE_TEXT}
        </p>

        <p style={{ fontSize: '0.8rem', marginBottom: 20 }}>
          <a href="#/privacy" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>View our Privacy Policy</a>
        </p>

        <button
          className="btn btn-primary btn-full"
          onClick={onAccept}
          style={{ marginBottom: 10 }}
        >
          I Understand &amp; Agree
        </button>
        <button
          className="btn btn-full"
          onClick={onDecline}
          style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
