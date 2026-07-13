import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { AI_DISCLOSURE_TEXT } from '../lib/aiConsent';

export default function AIConsentModal({ isOpen, onAccept, onDecline }) {
  if (!isOpen) return null;

  return (
    <div className="ai-consent-overlay" onClick={onDecline}>
      <section className="ai-consent-sheet" role="dialog" aria-modal="true" aria-labelledby="ai-disclosure-title" onClick={e => e.stopPropagation()}>
        <header className="ai-consent-header">
          <IoShieldCheckmarkOutline size={24} color="var(--accent)" />
          <h2 id="ai-disclosure-title">AI Data Disclosure</h2>
        </header>

        <div className="ai-consent-scroll">
          <p>
            PeptidAI uses external AI services to generate your personalized wellness plan. Review the disclosure before continuing:
          </p>

          <p className="ai-disclosure-copy">{AI_DISCLOSURE_TEXT}</p>

          <a href="#/privacy" className="ai-consent-policy">View our Privacy Policy</a>
        </div>

        <footer className="ai-consent-actions">
          <button className="btn btn-primary btn-full" onClick={onAccept}>I Understand &amp; Agree</button>
          <button className="btn btn-secondary btn-full" onClick={onDecline}>Cancel</button>
        </footer>
      </section>
    </div>
  );
}
