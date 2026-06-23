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
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
        <p><strong>Effective Date:</strong> June 15, 2026</p>
        <p><strong>App:</strong> PeptidAI ("the App")</p>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>1. Information We Collect</h3>
        <p>We collect the following information when you use the App:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li><strong>Account Information:</strong> Email address and display name when you create an account.</li>
          <li><strong>Wellness Data:</strong> Your wellness goals, sleep quality ratings, energy level ratings, and health preferences entered during onboarding and journaling.</li>
          <li><strong>User-Entered Data:</strong> Vial configurations, calculation inputs, journal entries, and usage logs that you voluntarily enter into the App.</li>
          <li><strong>Health Data:</strong> If you grant permission, the App may access Sleep Analysis and Active Energy Burned data from Apple Health (HealthKit) on supported devices.</li>
          <li><strong>Device Information:</strong> Device type, operating system, and app version for troubleshooting purposes.</li>
        </ul>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>2. Third-Party AI Services &amp; Data Sharing</h3>
        <p style={{ marginBottom: 8 }}><strong>PeptidAI uses Google's Gemini AI service to generate personalized wellness plans.</strong> This is a core feature of the App. When you use AI-powered features, the following data is sent to Google's Gemini API for processing:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li><strong>Data Sent:</strong> Your wellness goals, sleep quality responses, energy level responses, and general health preferences from onboarding.</li>
          <li><strong>Who Receives It:</strong> This data is transmitted to <strong>Google's Gemini API</strong>, a third-party AI service operated by Google LLC.</li>
          <li><strong>Purpose:</strong> To generate your personalized 12-week AI Wellness Plan with tailored recommendations for sleep, nutrition, exercise, and recovery.</li>
          <li><strong>Google's Policies:</strong> Google processes data sent to the Gemini API according to Google's Privacy Policy and the Gemini API Terms of Service.</li>
        </ul>
        <p style={{ marginTop: 8 }}><strong>Your Consent:</strong> Before any data is sent to Google's AI service, the App will present you with a data disclosure and request your explicit consent. You may decline, in which case no data will be sent to the AI service.</p>
        <p style={{ marginTop: 8 }}><strong>PeptidAI does not sell your personal data to any third party.</strong></p>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>3. How We Use Your Information</h3>
        <p>Your information is used to:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li>Generate AI-powered personalized wellness plans via Google's Gemini AI</li>
          <li>Provide and maintain the calculation and journaling service</li>
          <li>Sync your saved configurations and journal entries across devices</li>
          <li>Import health data from Apple Health on supported devices (with your permission)</li>
          <li>Process subscription payments through Apple's App Store</li>
          <li>Send optional push notifications if you enable scheduling</li>
        </ul>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>4. Data Storage &amp; Security</h3>
        <p>Your data is stored securely using Google Firebase (Firestore) with encryption at rest and in transit. AI queries are processed in real-time by Google's Gemini API and are not stored by PeptidAI beyond generating your wellness plan.</p>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>5. Apple Health (HealthKit)</h3>
        <p>On supported iPhone devices, PeptidAI may request access to Apple Health data (Sleep Analysis and Active Energy Burned) to enrich your daily journal entries. This data is accessed only with your explicit permission and is not shared with any third party, including Google's AI services. HealthKit data stays on your device and in your private Firebase account.</p>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>6. Health Information Disclaimer</h3>
        <p>PeptidAI is a wellness education and calculation tool. It does not collect, store, or process protected health information (PHI) as defined by HIPAA. All values entered are treated as general wellness inputs. AI-generated wellness plans are for informational purposes only and do not constitute medical advice.</p>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>7. Third-Party Services</h3>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li><strong>Google Gemini API</strong> — AI-powered wellness plan generation (data shared as described in Section 2)</li>
          <li><strong>Google Firebase</strong> — Authentication and data storage</li>
          <li><strong>Apple HealthKit</strong> — Health data access on supported devices (with permission)</li>
          <li><strong>Apple App Store</strong> — Subscription billing</li>
        </ul>
        <p style={{ marginTop: 8 }}>Each third-party service provider maintains their own privacy policy and provides protection of user data consistent with industry standards.</p>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>8. Your Rights</h3>
        <p>You may request deletion of your account and all associated data at any time through the Settings page in the App, or by contacting support@peptidai.com. Data will be permanently deleted within 30 days of request. You may also clear your journal history and revoke Apple Health access at any time.</p>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>9. Children's Privacy</h3>
        <p>PeptidAI is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.</p>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>10. Changes to This Policy</h3>
        <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy within the App. Your continued use of the App after changes are posted constitutes acceptance of the updated policy.</p>

        <h3 style={{ color: 'var(--text)', marginTop: 20, marginBottom: 8 }}>11. Contact</h3>
        <p>For privacy inquiries: support@peptidai.com</p>
      </div>
    </div>
  );
}
