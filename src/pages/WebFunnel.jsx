import { useState } from 'react';
import { IoCheckmarkCircle, IoSparkles, IoLockClosed } from 'react-icons/io5';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Onboarding from './Onboarding';

export default function WebFunnel() {
  const [funnelStep, setFunnelStep] = useState('quiz');
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // REPLACE THIS WITH YOUR REAL STRIPE PAYMENT LINK
  const STRIPE_LINK = 'https://buy.stripe.com/test_YOUR_LINK_HERE';

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

      // 3. Redirect to Stripe, passing the UID so RevenueCat can unlock the app later
      window.location.href = `${STRIPE_LINK}?client_reference_id=${uid}`;
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  }

  if (funnelStep === 'quiz') {
    return <Onboarding onComplete={handleQuizComplete} />;
  }

  return (
    <div className="page" style={{ padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000' }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)', padding: '60px 20px 40px', textAlign: 'center', borderBottom: '1px solid #333' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: 16 }}>Unlock Your <span style={{ color: '#ec4899' }}>AI Health Tutor</span></h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: 400, margin: '0 auto', lineHeight: 1.5 }}>
          Create your account to generate your hyper-personalized 30-day protocol and unlock the AI Vial Scanner.
        </p>
      </div>

      {/* Benefits */}
      <div style={{ padding: '40px 20px', background: '#000' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400, margin: '0 auto' }}>
          {[
            'Custom 30-Day Health Protocol',
            'Unlimited AI Vial Scanning',
            'Visual Syringe Math Guide',
            'Daily Transformation Journal'
          ].map((benefit, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <IoCheckmarkCircle color="#ec4899" size={28} />
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
            <label style={{ display: 'block', color: '#888', marginBottom: 8, fontSize: '0.9rem' }}>Email Address</label>
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
            <label style={{ display: 'block', color: '#888', marginBottom: 8, fontSize: '0.9rem' }}>Password</label>
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
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', 
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
          
          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem', marginTop: 20, lineHeight: 1.5 }}>
            You will be redirected to Stripe to complete your purchase securely. After payment, download the iOS app and log in!
          </p>
        </form>
      </div>

    </div>
  );
}
