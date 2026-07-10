import { useState } from 'react';
import { IoCheckmarkCircle, IoLockClosed } from 'react-icons/io5';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Onboarding from './Onboarding';
import { useEffect } from 'react';

export default function WebFunnel() {
  const [funnelStep, setFunnelStep] = useState('quiz'); // quiz, checkout, pricing
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Inject Stripe Pricing Table script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function handleQuizComplete(answers) {
    setQuizAnswers(answers);
    setFunnelStep('checkout');
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // 1. Create the user account in Firebase
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // 2. Save basic profile data and quiz answers
      await setDoc(doc(db, 'users', uid), {
        email,
        onboardingAnswers: quizAnswers,
        source: 'web_stripe_funnel',
        createdAt: new Date().toISOString()
      }, { merge: true });

      setUid(uid);
      setFunnelStep('pricing');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  }

  if (funnelStep === 'quiz') {
    return <Onboarding onComplete={handleQuizComplete} />;
  }

  if (funnelStep === 'pricing') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', padding: '40px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20, color: 'var(--text)', fontWeight: 800 }}>Choose Your Plan</h2>
        <p style={{ textAlign: 'center', marginBottom: 40, color: 'var(--text-secondary)' }}>Your custom protocol is securely saved to your account.</p>
        <stripe-pricing-table 
          pricing-table-id="prctbl_1Tagch06I3eFkRUmLUHyPyhs"
          publishable-key="pk_live_51Rfsym06I3eFkRUmipmmgFo6bqX8Al08OhJZm1N6b6UvO6ZnLUDuhOQpNNaSeJlbFAmETOt64P6oRMboXLsnm3tJ00ClGq74Lv"
          client-reference-id={uid}
          customer-email={email}
        >
        </stripe-pricing-table>
      </div>
    );
  }

  return (
    <div className="page" style={{ padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000' }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)', padding: '60px 20px 40px', textAlign: 'center', borderBottom: '1px solid #333' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: 16 }}>Unlock Your <span style={{ color: 'var(--accent)' }}>AI Research Companion</span></h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: 400, margin: '0 auto', lineHeight: 1.5 }}>
          Create your account to generate your personalized research plan and unlock the AI Label Scanner.
        </p>
      </div>

      {/* Benefits */}
      <div style={{ padding: '40px 20px', background: '#000' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400, margin: '0 auto' }}>
          {[
            'Custom 30-Day Health Protocol',
            'Unlimited AI Vial Scanning',
            'Visual Concentration Guide',
            'Daily Transformation Journal'
          ].map((benefit, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <IoCheckmarkCircle color="var(--accent)" size={28} />
              <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Signup Form */}
      <div style={{ padding: '0 20px 60px', flex: 1 }}>
        <form onSubmit={handleCheckout} style={{ maxWidth: 400, margin: '0 auto', background: '#111', padding: 30, borderRadius: 24, border: '1px solid #333' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: 24, textAlign: 'center' }}>Create Account</h2>
          
          {error && <div style={{ background: '#7f1d1d', color: '#fca5a5', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: '0.9rem' }}>{error}</div>}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: 8, fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', background: '#000', border: '1px solid #444', padding: '16px', borderRadius: 12, color: '#fff', fontSize: '1rem' }}
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: 30 }}>
            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: 8, fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', background: '#000', border: '1px solid #444', padding: '16px', borderRadius: 12, color: '#fff', fontSize: '1rem' }}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--text-muted) 100%)', 
              color: '#fff', 
              border: 'none', 
              padding: '20px', 
              borderRadius: 16, 
              fontSize: '1.1rem', 
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8
            }}
          >
            {loading ? <span className="spinner" /> : <><IoLockClosed /> Continue to Secure Checkout</>}
          </button>
          
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 20, lineHeight: 1.5 }}>
            You will be redirected to Stripe to complete your purchase securely. After payment, download the iOS app and log in!
          </p>
        </form>
      </div>

    </div>
  );
}
