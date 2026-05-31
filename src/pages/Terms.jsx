import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div className="page" style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-icon btn-secondary" onClick={() => navigate(-1)}><IoArrowBack size={20} /></button>
        <h1 style={{ fontSize: '1.3rem' }}>Terms of Service</h1>
      </div>
      <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.8 }}>
        <p><strong>Effective Date:</strong> May 21, 2026</p>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>1. Acceptance of Terms</h3>
        <p>By downloading, installing, or using PeptidAI ("the App"), you agree to be bound by these Terms of Service.</p>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>2. Nature of the Service</h3>
        <p><strong>PeptidAI is a mathematical calculation and visualization tool for educational purposes only.</strong> The App performs arithmetic operations based entirely on values that you, the user, manually input. The App does not:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>Provide medical advice, diagnosis, or treatment</li>
          <li>Recommend amounts, treatments, or regimens</li>
          <li>Serve as a substitute for professional medical guidance</li>
          <li>Qualify as a medical device under FDA regulations</li>
        </ul>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>3. User Responsibility</h3>
        <p>You acknowledge and agree that:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>All input values are entered by you at your sole discretion</li>
          <li>You are solely responsible for verifying the accuracy of all calculations</li>
          <li>You will consult a licensed healthcare professional before making any health-related decisions</li>
          <li>The App's visualizations are mathematical representations, not medical instructions</li>
        </ul>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>4. Disclaimer of Warranties</h3>
        <p>THE APP IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE MAKE NO WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF ANY CALCULATIONS OR VISUALIZATIONS.</p>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>5. Limitation of Liability</h3>
        <p>IN NO EVENT SHALL PEPTIDAI BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE APP, INCLUDING BUT NOT LIMITED TO DAMAGES RELATED TO HEALTH OUTCOMES.</p>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>6. Subscriptions</h3>
        <p>Subscriptions are billed through Apple's App Store. Payment is charged at confirmation. Subscriptions auto-renew unless canceled at least 24 hours before the end of the current billing period. Manage subscriptions in your device Settings.</p>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>7. Modifications</h3>
        <p>We reserve the right to modify these terms at any time. Continued use of the App constitutes acceptance of updated terms.</p>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>8. Contact</h3>
        <p>Questions: support@peptidai.com</p>
      </div>
    </div>
  );
}
