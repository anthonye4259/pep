import { useState, useEffect } from 'react';
import { IoFlask, IoCheckmarkCircle } from 'react-icons/io5';

// Native plugins loaded dynamically to prevent crash on iPad
async function getPurchases() {
  try { const m = await import('@revenuecat/purchases-capacitor'); return m.Purchases; }
  catch (e) { console.warn('Purchases not available:', e.message); return null; }
}

const plans = [
  { id: 'weekly', name: 'Weekly', price: '$3.99', period: '/week', desc: 'Flexible, cancel anytime', badge: null },
  { id: 'monthly', name: 'Monthly', price: '$9.99', period: '/mo', desc: 'Standard subscription', badge: null },
  { id: 'annual', name: 'Annual', price: '$99.99', period: '/year', desc: 'Save 52% vs weekly', badge: 'BEST VALUE' },
  { id: 'lifetime', name: 'Lifetime', price: '$249.99', period: ' once', desc: 'Pay once, own forever', badge: 'ULTIMATE' },
];

const features = [
  'AI-powered wellness coaching',
  'Personalized 12-week plan',
  'Daily wellness journal with trends',
  'Apple Health integration (iPhone)',
  'Knowledge base & education',
  'Unlimited plan regenerations',
];

export default function Paywall({ onSubscribe }) {
  const [selected, setSelected] = useState('annual');
  const [loading, setLoading] = useState(false);

  const [dynamicPlans, setDynamicPlans] = useState(plans);

  useEffect(() => {
    // Review prompt disabled to avoid WKWebView IndexedDB deadlocks from Remote Config
    return () => {};
  }, []);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const Purchases = await getPurchases();
        if (!Purchases) return;
        const offerings = await Purchases.getOfferings();
        const current = offerings.current;
        
        if (current && current.availablePackages && current.availablePackages.length > 0) {
          setDynamicPlans(prev => prev.map(plan => {
            let pkg;
            if (plan.id === 'annual') pkg = current.availablePackages.find(p => p.packageType === 'ANNUAL');
            else if (plan.id === 'monthly') pkg = current.availablePackages.find(p => p.packageType === 'MONTHLY');
            else if (plan.id === 'lifetime') pkg = current.availablePackages.find(p => p.packageType === 'LIFETIME');
            else pkg = current.availablePackages.find(p => p.packageType === 'WEEKLY');
            if (pkg?.product?.priceString) {
              return { ...plan, price: pkg.product.priceString };
            }
            return plan;
          }));
        }
      } catch (e) {
        console.warn('Could not fetch RC prices:', e);
      }
    }
    fetchPrices();
  }, []);



  async function handleSubscribe() {
    setLoading(true);

    // Helper: race any async call against a timeout
    const withTimeout = (promise, ms, label) => Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out. Please try again.`)), ms))
    ]);

    try {
      const Purchases = await getPurchases();
      if (!Purchases) { alert('Purchase system not available. Please try again.'); return; }
      // 1. Fetch RevenueCat Offerings
      const offerings = await withTimeout(Purchases.getOfferings(), 15000, 'Loading offerings');
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
          // 2. Trigger Native Apple Pay Sheet (45s timeout — user has time to confirm)
          const result = await withTimeout(Purchases.purchasePackage({ aPackage: pkgToBuy }), 45000, 'Purchase');
          
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
      const isCancelled = err.userCancelled || err.code === 1 || (err.message && err.message.includes('cancelled'));
      if (!isCancelled) {
         alert(`Purchase failed: ${err.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    try {
      const Purchases = await getPurchases();
      if (!Purchases) { alert('Purchase system not available.'); return; }
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
          <h1 style={{ fontSize: '1.8rem', marginBottom: 4, color: 'white' }}>
            Peptid<span style={{ fontWeight: 800 }}>AI</span> Pro
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)' }}>Your research companion</p>
        </div>



        {/* Plans */}
        <div className="paywall-plans">
          {dynamicPlans.map(plan => (
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
            {dynamicPlans.find(p => p.id === selected)?.price}{selected !== 'lifetime' ? dynamicPlans.find(p => p.id === selected)?.period : ' once'}. {selected !== 'lifetime' && 'Cancel anytime.'}
          </p>
          <button className="paywall-restore" onClick={handleRestore}>Restore Purchases</button>
        </div>

        <div className="paywall-legal">
          <p>Payment will be charged at confirmation. Subscription auto-renews unless canceled 24h before period end.</p>
          <p style={{ marginTop: 8 }}>
            <span onClick={() => window.open('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/', '_blank')} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Use (EULA)</span>
            {' · '}
            <span onClick={() => window.open('https://peptidai.web.app/privacy', '_blank')} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
