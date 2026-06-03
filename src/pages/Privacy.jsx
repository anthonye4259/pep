import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <div className="page" style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-icon btn-secondary" onClick={() => navigate(-1)}><IoArrowBack size={20} /></button>
        <h1 style={{ fontSize: '1.3rem' }}>Privacy Policy</h1>
      </div>
      <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.8 }}>
        <p><strong>Effective Date:</strong> May 21, 2026</p>
        <p><strong>App:</strong> PeptidAI ("the App")</p>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>1. Information We Collect</h3>
        <p>We collect the following information when you use the App:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li><strong>Account Information:</strong> Email address and display name when you create an account.</li>
          <li><strong>User-Entered Data:</strong> Container configurations, calculation inputs, and usage logs that you voluntarily enter into the App.</li>
          <li><strong>Device Information:</strong> Device type, operating system, and app version for troubleshooting purposes.</li>
        </ul>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>2. How We Use Your Information</h3>
        <p>Your information is used solely to:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>Provide and maintain the calculation service</li>
          <li>Sync your saved configurations across devices</li>
          <li>Process subscription payments through Apple's App Store</li>
          <li>Send optional push notifications if you enable scheduling</li>
        </ul>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>3. Data Storage & Security</h3>
        <p>Your data is stored securely using Google Firebase with encryption at rest and in transit. We do not sell, share, or distribute your personal data to third parties.</p>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>4. Health Information Disclaimer</h3>
        <p>PeptidAI is a mathematical calculation tool. It does not collect, store, or process protected health information (PHI) as defined by HIPAA. All values entered are treated as generic numerical inputs for mathematical computation.</p>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>5. Your Rights</h3>
        <p>You may request deletion of your account and all associated data at any time by contacting support@peptidai.com. Data will be permanently deleted within 30 days of request.</p>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>6. Third-Party Services</h3>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>Google Firebase (authentication, data storage)</li>
          <li>Google Gemini API (container label text extraction)</li>
          <li>Apple App Store (subscription billing)</li>
        </ul>

        <h3 style={{ color: '#1a1a1a', marginTop: 20, marginBottom: 8 }}>7. Contact</h3>
        <p>For privacy inquiries: support@peptidai.com</p>
      </div>
    </div>
  );
}
