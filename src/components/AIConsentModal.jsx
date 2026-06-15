import { IoShieldCheckmarkOutline } from 'react-icons/io5';

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
          PeptidAI uses <strong>Google's Gemini AI</strong> to generate your personalized wellness plan. When you use this feature, the following data is sent to Google for processing:
        </p>

        <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: 20, marginBottom: 12 }}>
          <li>Your wellness goals</li>
          <li>Sleep quality and energy level responses</li>
          <li>General health preferences from onboarding</li>
        </ul>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
          This data is processed by Google's Gemini API to generate AI-powered recommendations. Google's Privacy Policy governs how they handle this data. PeptidAI does not sell your personal data to third parties.
        </p>

        <p style={{ fontSize: '0.8rem', marginBottom: 20 }}>
          <a href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>View our Privacy Policy</a>
        </p>

        <button
          className="btn btn-primary btn-full"
          onClick={onAccept}
          style={{ marginBottom: 10 }}
        >
          I Agree &amp; Continue
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
