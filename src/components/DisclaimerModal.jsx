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
    <div className="notice-overlay">
      <section className="notice-modal" role="dialog" aria-modal="true" aria-labelledby="important-notices-title">
        <header className="notice-header">
          <div className="notice-icon" aria-hidden="true">
          <IoShieldCheckmarkOutline size={28} color="var(--accent)" />
          </div>
          <div>
            <p className="notice-eyebrow">Before you continue</p>
            <h2 id="important-notices-title">
          Important Notices
            </h2>
          </div>
        </header>

        <div className="notice-scroll">
          <div className="notice-section notice-section-ai">
            <h3>AI Data Sharing</h3>
            <p>{AI_DISCLOSURE_TEXT}</p>
          </div>

          <div className="notice-section">
            <h3>Health Disclaimer</h3>
            <p>
              PeptidAI is for tracking and educational purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. Always consult a qualified healthcare professional before making changes to your health routine.
            </p>
          </div>
        </div>

        <footer className="notice-actions">
          <p>
            By continuing, you consent to the AI data sharing described above. <a href="https://peptidai.web.app/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </p>
          <button onClick={handleAccept} className="btn btn-primary btn-full notice-accept">
            I Understand &amp; Agree
          </button>
        </footer>
      </section>
    </div>
  );
}
