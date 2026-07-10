import { useState, useEffect, useRef } from 'react';
import { IoFlask, IoCheckmarkCircle } from 'react-icons/io5';

// Native plugins loaded dynamically to prevent crash on iPad
async function getPurchases() {
  try { const m = await import('@revenuecat/purchases-capacitor'); return m.Purchases; }
  catch (e) { console.warn('Purchases not available:', e.message); return null; }
}

function withTimeout(promise, ms, label) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out. Please try again.`)), ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

function hasPremiumEntitlement(customerInfo) {
  const activeEntitlements = customerInfo?.entitlements?.active || {};
  return Boolean(
    activeEntitlements.premium ||
    activeEntitlements['peptid ai Premium'] ||
    Object.keys(activeEntitlements).length > 0
  );
}

function getRevenueCatAppleKey() {
  const key = import.meta.env.VITE_REVENUECAT_APPLE_KEY;
  return key && key !== 'appl_REPLACE_ME_WHEN_READY' ? key : '';
}

async function ensurePurchasesConfigured(Purchases) {
  const apiKey = getRevenueCatAppleKey();
  if (!apiKey) throw new Error('Apple subscription setup is missing.');

  if (typeof Purchases.isConfigured === 'function') {
    const configured = await withTimeout(Purchases.isConfigured(), 3000, 'Purchase setup');
    if (configured?.isConfigured) return;
  }

  await withTimeout(Purchases.configure({ apiKey }), 5000, 'Purchase setup');
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

const PURCHASE_WATCHDOG_MS = 35000;

export default function Paywall({ onSubscribe }) {
  const [selected, setSelected] = useState('annual');
  const [loading, setLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [fetchingPrices, setFetchingPrices] = useState(true);
  const purchaseWatchdogRef = useRef(null);

  const [dynamicPlans, setDynamicPlans] = useState(plans);

  useEffect(() => {
    // Review prompt disabled to avoid WKWebView IndexedDB deadlocks from Remote Config
    return () => {};
  }, []);

  useEffect(() => {
    async function fetchPrices() {
      setFetchingPrices(true);
      try {
        const Purchases = await withTimeout(getPurchases(), 8000, 'Loading purchase system');
        if (!Purchases) return;
        await ensurePurchasesConfigured(Purchases);
        const offerings = await withTimeout(Purchases.getOfferings(), 15000, 'Loading prices');
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
      } finally {
        setFetchingPrices(false);
      }
    }
    fetchPrices();
  }, []);

  useEffect(() => {
    return () => {
      if (purchaseWatchdogRef.current) clearTimeout(purchaseWatchdogRef.current);
    };
  }, []);



  async function handleSubscribe() {
    if (loading) return;
    setLoading(true);
    setPurchaseError('');
    let watchdogFired = false;

    purchaseWatchdogRef.current = setTimeout(() => {
      watchdogFired = true;
      setLoading(false);
      setPurchaseError('Apple checkout is taking longer than expected. Please retry or continue later.');
    }, PURCHASE_WATCHDOG_MS);

    try {
      const Purchases = await withTimeout(getPurchases(), 8000, 'Loading purchase system');
      if (!Purchases) throw new Error('Purchase system not available. Please try again.');
      await ensurePurchasesConfigured(Purchases);
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
          const result = await withTimeout(Purchases.purchasePackage({ aPackage: pkgToBuy }), 60000, 'Purchase');
          
          // 3. Verify Entitlement
          if (hasPremiumEntitlement(result.customerInfo)) {
            onSubscribe(selected);
          } else {
            setPurchaseError('Purchase completed, but premium access was not found. Tap Restore Purchases or try again.');
          }
        } else {
          throw new Error('Selected package not configured in RevenueCat.');
        }
      } else {
        throw new Error('No offerings configured in RevenueCat.');
      }
    } catch (err) {
      console.error('RevenueCat Purchase Error:', err);
      const message = err.message || 'Unknown error';
      const isCancelled = err.userCancelled || err.code === 1 || message.toLowerCase().includes('cancel');
      if (!isCancelled) {
        setPurchaseError(`Purchase failed: ${message}`);
      }
    } finally {
      if (purchaseWatchdogRef.current) {
        clearTimeout(purchaseWatchdogRef.current);
        purchaseWatchdogRef.current = null;
      }
      if (!watchdogFired) setLoading(false);
    }
  }

  async function handleRestore() {
    if (restoreLoading || loading) return;
    setRestoreLoading(true);
    setPurchaseError('');

    try {
      const Purchases = await withTimeout(getPurchases(), 8000, 'Loading purchase system');
      if (!Purchases) throw new Error('Purchase system not available.');
      await ensurePurchasesConfigured(Purchases);
      const info = await withTimeout(Purchases.restorePurchases(), 30000, 'Restore purchases');
      if (hasPremiumEntitlement(info.customerInfo)) {
        onSubscribe(selected);
      } else {
        setPurchaseError('No active subscriptions were found for this Apple ID.');
      }
    } catch (e) {
      console.error(e);
      setPurchaseError(`Restore failed: ${e.message || 'Please try again.'}`);
    } finally {
      setRestoreLoading(false);
    }
  }

  const selectedPlan = dynamicPlans.find(p => p.id === selected) || dynamicPlans[0];
  const selectedPriceCopy = selected === 'lifetime'
    ? `${selectedPlan.price} once.`
    : `${selectedPlan.price}${selectedPlan.period}. Cancel anytime.`;

  return (
    <div className="paywall">
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
            {loading ? <><span className="spinner" /> Processing with Apple...</> : `Continue with ${selectedPlan.name}`}
          </button>
          {fetchingPrices && !loading && (
            <p className="paywall-status">Checking latest Apple pricing...</p>
          )}
          {purchaseError && (
            <p role="alert" className="paywall-error">
              {purchaseError}
            </p>
          )}
          <p className="paywall-trial-note">
            {selectedPriceCopy}
          </p>
          <button className="paywall-restore" onClick={handleRestore} disabled={restoreLoading || loading}>
            {restoreLoading ? 'Restoring...' : 'Restore Purchases'}
          </button>
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
