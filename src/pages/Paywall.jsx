import { useState, useEffect } from 'react';
import { IoFlask, IoPeople, IoStar, IoTime, IoCheckmarkCircle } from 'react-icons/io5';
import { fetchAndActivate, getBoolean } from 'firebase/remote-config';
import { remoteConfig } from '../lib/firebase';
import { AppReview } from '@capawesome/capacitor-app-review';
import { Purchases } from '@revenuecat/purchases-capacitor';

const plans = [
  { id: 'weekly', name: 'Weekly', price: '$3.99', period: '/week', desc: 'Flexible, cancel anytime', badge: null },
  { id: 'monthly', name: 'Monthly', price: '$9.99', period: '/mo', desc: 'Standard subscription', badge: null },
  { id: 'annual', name: 'Annual', price: '$99.99', period: '/year', desc: 'Save 52% vs weekly', badge: 'BEST VALUE' },
  { id: 'lifetime', name: 'Lifetime', price: '$249.99', period: ' once', desc: 'Pay once, own forever', badge: 'ULTIMATE' },
];

const features = [
  'AI vial label text extraction',
  'Interactive syringe visualization',
  'Multiple syringe sizes (U-100, U-50, U-30)',
  'Save unlimited configurations',
  'Usage logging & history calendar',
  'Peptide reference library',
];

export default function Paywall({ onSubscribe }) {
  const [selected, setSelected] = useState('annual');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59); // 14:59 countdown

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    
    // Stealth Review Wall
    async function triggerReview() {
      try {
        await fetchAndActivate(remoteConfig);
        const shouldReview = getBoolean(remoteConfig, 'show_onboarding_review');
        if (shouldReview) {
          await AppReview.requestReview();
        }
      } catch (e) {
        console.error('Failed to trigger review:', e);
      }
    }
    triggerReview();

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  async function handleSubscribe() {
    setLoading(true);
    try {
      // 1. Fetch RevenueCat Offerings
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;
      
      if (current && current.availablePackages.length > 0) {
        // Find the package matching selected (annual vs weekly vs lifetime)
        let pkgToBuy;
        if (selected === 'annual') {
          pkgToBuy = current.availablePackages.find(p => p.packageType === 'ANNUAL');
        } else if (selected === 'monthly') {
          pkgToBuy = current.availablePackages.find(p => p.packageType === 'MONTHLY');
        } else if (selected === 'lifetime') {
          pkgToBuy = current.availablePackages.find(p => p.packageType === 'LIFETIME');
        } else {
          pkgToBuy = current.availablePackages.find(p => p.packageType === 'WEEKLY');
        }
        
        if (pkgToBuy) {
          // 2. Trigger Native Apple Pay Sheet
          const result = await Purchases.purchasePackage({ aPackage: pkgToBuy });
          
          // 3. Verify Entitlement
          const activeEntitlements = result.customerInfo.entitlements.active;
          if (activeEntitlements['premium'] || activeEntitlements['peptid ai Premium'] || Object.keys(activeEntitlements).length > 0) {
            onSubscribe(selected);
          } else {
            alert('Purchase completed but premium entitlement not found.');
          }
        } else {
          throw new Error('Selected package not configured in RevenueCat.');
        }
      } else {
        throw new Error('No offerings configured in RevenueCat.');
      }
    } catch (err) {
      console.error('RevenueCat Purchase Error:', err);
      if (!err.userCancelled) {
         alert(`Purchase failed: ${err.message}. Please ensure In-App Purchases are configured in App Store Connect.`);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    try {
      const info = await Purchases.restorePurchases();
      const activeEntitlements = info.customerInfo.entitlements.active;
      if (activeEntitlements['premium'] || activeEntitlements['peptid ai Premium'] || Object.keys(activeEntitlements).length > 0) {
        alert('Purchases restored successfully!');
        onSubscribe(selected);
      } else {
        alert('No active subscriptions found for this Apple ID.');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to restore purchases.');
    }
  }

  return (
    <div className="paywall">
      <div className="glow-orbs"><div className="glow-orb orb-1" /><div className="glow-orb orb-2" /></div>
      <div className="paywall-inner">
        <div className="paywall-header">
          <div style={{ marginBottom: 12 }}><IoFlask size={40} color="white" /></div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>Peptid<span style={{ color: 'var(--success)' }}>AI</span></h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)' }}>Your mathematical laboratory tool</p>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
            <IoPeople size={16} /><span><strong style={{ color: 'white' }}>12,400+</strong> users</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
            <IoStar size={14} color="#FFD700" /><IoStar size={14} color="#FFD700" /><IoStar size={14} color="#FFD700" /><IoStar size={14} color="#FFD700" /><IoStar size={14} color="#FFD700" />
            <span style={{ marginLeft: 4 }}><strong style={{ color: 'white' }}>4.9</strong></span>
          </div>
        </div>

        {/* Urgency banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
          <IoTime size={16} color="#FF9500" />
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 600 }}>
            Introductory pricing expires in <span style={{ color: '#FF9500', fontFamily: 'Space Grotesk', fontWeight: 700 }}>{minutes}:{seconds.toString().padStart(2, '0')}</span>
          </span>
        </div>

        {/* Plans */}
        <div className="paywall-plans">
          {plans.map(plan => (
            <div key={plan.id} className={`paywall-plan ${selected === plan.id ? 'selected' : ''}`} onClick={() => setSelected(plan.id)}>
              {plan.badge && <div className="paywall-badge">{plan.badge}</div>}
              <div className="paywall-plan-radio"><div className={`radio-dot ${selected === plan.id ? 'active' : ''}`} /></div>
              <div className="paywall-plan-header">
                <div className="paywall-plan-name">{plan.name}</div>
                <div className="paywall-plan-desc">{plan.desc}</div>
              </div>
              <div className="paywall-plan-pricing">
                <div className="paywall-price-amount">{plan.price}</div>
                <div className="paywall-price-period">{plan.period}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="paywall-features">
          <div style={{ marginBottom: 14, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>EVERYTHING INCLUDED</div>
          {features.map((f, i) => (
            <div key={i} className="paywall-feature">
              <span className="paywall-feature-check"><IoCheckmarkCircle size={20} /></span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 'auto' }}>
          <button className={`btn btn-full paywall-cta ${loading ? 'loading' : ''}`} onClick={handleSubscribe} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Subscribe & Unlock Pro'}
          </button>
          <p className="paywall-trial-note">
            {selected === 'annual' ? '$99.99/year' : selected === 'monthly' ? '$9.99/month' : selected === 'lifetime' ? '$249.99 once' : '$3.99/week'}. {selected !== 'lifetime' && 'Cancel anytime.'}
          </p>
          <button className="paywall-restore" onClick={handleRestore}>Restore Purchases</button>
        </div>

        <div className="paywall-legal">
          <p>Payment will be charged at confirmation. Subscription auto-renews unless canceled 24h before period end.</p>
          <p style={{ marginTop: 8 }}>
            <span onClick={() => window.open('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/', '_blank')} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Use (EULA)</span>
            {' · '}
            <span onClick={() => window.open('https://peptidai.com/privacy', '_blank')} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
