import { useState, useEffect } from 'react';
import { IoFlask, IoCheckmarkCircle, IoStar, IoPeople, IoTime } from 'react-icons/io5';

const plans = [
  { id: 'weekly', name: 'Weekly', price: '$3.99', period: '/week', desc: 'Flexible, cancel anytime', badge: null },
  { id: 'annual', name: 'Annual', price: '$99.99', period: '/year', desc: 'Save 52% vs weekly', badge: 'BEST VALUE' },
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
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  function handleSubscribe() {
    setLoading(true);
    setTimeout(() => onSubscribe(selected), 1200);
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
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)' }}>Your personal dose calculator</p>
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
            {loading ? <span className="spinner" /> : 'Start 3-Day Free Trial'}
          </button>
          <p className="paywall-trial-note">3 days free, then {selected === 'annual' ? '$99.99/year' : '$3.99/week'}. Cancel anytime.</p>
          <button className="paywall-restore" onClick={() => alert('No active subscriptions found.')}>Restore Purchases</button>
        </div>

        <div className="paywall-legal">
          <p>Payment will be charged at confirmation. Subscription auto-renews unless canceled 24h before period end.</p>
          <p style={{ marginTop: 8 }}>
            <a href="/privacy" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy Policy</a> · <a href="/terms" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}
