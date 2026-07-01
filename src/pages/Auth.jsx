import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoFlask } from 'react-icons/io5';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Race the ENTIRE auth flow (Firebase + context update) against a hard timeout
      const authFlow = (async () => {
        let userCred;
        if (mode === 'signup') {
          userCred = await createUserWithEmailAndPassword(auth, email, password);
          if (name) await updateProfile(userCred.user, { displayName: name });
          
          // Track Referral
          const inviteCode = localStorage.getItem('peptidai_invite_code');
          if (inviteCode) {
            try {
              await setDoc(doc(db, 'users', userCred.user.uid), {
                referredBy: inviteCode,
                createdAt: new Date().toISOString()
              }, { merge: true });
            } catch (e) {
              console.warn('Failed to log referral', e);
            }
          }
        } else {
          userCred = await signInWithEmailAndPassword(auth, email, password);
        }
        // Context update (RevenueCat check etc.) — covered by same timeout
        await onAuth(userCred.user);
      })();
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timed out. Please check your internet connection and try again.')), 12000)
      );
      
      await Promise.race([authFlow, timeoutPromise]);
    } catch (err) {
      const msg = err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim();
      setError(msg);
      alert('Authentication Failed: ' + msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <IoFlask size={36} color="var(--neon)" />
        <h1 style={{ fontSize: '1.5rem', marginTop: 12 }}>
          Peptid<span className="text-neon">AI</span>
        </h1>
        <p className="text-muted text-sm" style={{ marginTop: 4 }}>Never guess your amounts again</p>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign Up</button>
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Log In</button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="input-group">
              <label>Name</label>
              <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
          </div>

          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <span className="spinner" /> : mode === 'signup' ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <p className="auth-terms">
          By continuing, you agree to our{' '}
          <Link to="/terms" style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}>Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
