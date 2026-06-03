import { useState, useEffect } from 'react';
import { IoWarningOutline } from 'react-icons/io5';

export default function DisclaimerModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('peptidai_disclaimer_v2');
    if (!accepted) setShow(true);
  }, []);

  function handleAccept() {
    localStorage.setItem('peptidai_disclaimer_v2', 'true');
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
        background: 'white', borderRadius: 24, padding: 32,
        maxWidth: 360, width: '100%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 28,
          background: '#f5f5f5', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <IoWarningOutline size={28} color="#666" />
        </div>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, color: '#1a1a1a' }}>
          Health Disclaimer
        </h2>

        <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.6, marginBottom: 24, textAlign: 'left' }}>
          PeptidAI is designed for tracking and educational purposes only. It is not intended to provide medical advice, diagnosis, treatment recommendations, or dosing instructions.
        </p>

        <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.6, marginBottom: 24, textAlign: 'left' }}>
          Always consult with your healthcare provider for any medical decisions or health concerns. All features are for personal record-keeping and educational reference only.
        </p>

        <button
          onClick={handleAccept}
          style={{
            width: '100%', padding: 16, borderRadius: 100,
            background: 'linear-gradient(135deg, var(--accent), #b39ddb)',
            color: 'white', border: 'none', fontSize: '1rem',
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          I understand
        </button>
      </div>
    </div>
  );
}
