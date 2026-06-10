import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateProtocol } from '../lib/gemini';
import { IoSparkles, IoCheckmarkCircle, IoRefreshCircle, IoFlameOutline } from 'react-icons/io5';

export default function MyPlan() {
  const { appState, userProfile, updateProfileData, vials } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const protocol = userProfile?.protocol;

  useEffect(() => {
    if (userProfile && !protocol && !loading && !error) {
      generateInitialProtocol();
    }
  }, [userProfile, protocol]);

  async function generateInitialProtocol() {
    try {
      setLoading(true);
      const answers = appState.onboardingAnswers || { goal: 'Wellness', sleep: 'Average', energy: 'Average', peptides: [] };
      const generated = await generateProtocol(answers, vials);
      const now = new Date().toISOString();
      await updateProfileData({ 
        protocol: generated,
        aiUsage: { ...userProfile?.aiUsage, protocolGeneratedDate: now }
      });
    } catch (err) {
      console.error(err);
      setError('AI Tutor is busy analyzing data. Please check back shortly.');
    } finally {
      setLoading(false);
    }
  }

  function handleRegenerate() {
    const lastGen = userProfile?.aiUsage?.protocolGeneratedDate;
    const now = new Date();
    if (lastGen) {
      const diffDays = (now - new Date(lastGen)) / (1000 * 60 * 60 * 24);
      if (diffDays < 14) {
        alert('Your AI Tutor is currently monitoring your progress on this plan. Please complete 14 days of data logging before requesting a new synthesis.');
        return;
      }
    }
    // If passed 14 days, they can regenerate
    generateInitialProtocol();
  }

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner" style={{ width: 40, height: 40, borderColor: 'var(--bg-card)', borderTopColor: 'var(--accent)', marginBottom: 20 }} />
        <h2 style={{ fontSize: '1.2rem', color: '#1a1a1a', fontWeight: 700 }}>Creating your Wellness Plan...</h2>
        <p style={{ color: '#999', fontSize: '0.9rem', marginTop: 8 }}>AI is analyzing your goals & preferences.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: 'var(--accent)', fontWeight: 600 }}>{error}</p>
        <button className="btn btn-primary mt-12" onClick={generateInitialProtocol}>Try Again</button>
      </div>
    );
  }

  if (!protocol) return null;

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      <div className="page-header" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            AI Wellness Plan <IoSparkles color="var(--accent)" size={24} />
          </h1>
          <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>Personalized 12-Week Wellness Journey</p>
        </div>
        <button onClick={handleRegenerate} style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IoRefreshCircle size={28} />
          <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>UPDATE</span>
        </button>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', padding: 20, borderRadius: 16, color: 'white', marginBottom: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.5, fontWeight: 500, margin: 0 }}>"{protocol.summary}"</p>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><IoFlameOutline color="var(--accent)" /> Primary Focus Areas</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
        {protocol.focusAreas?.map((area, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', color: 'var(--text)', padding: '8px 16px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 }}>
            {area}
          </div>
        ))}
      </div>

      {protocol.inventoryAdvice && (
        <div style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, marginBottom: 32, border: '1px solid var(--border)' }}>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Wellness Tip</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.5 }}>{protocol.inventoryAdvice}</p>
        </div>
      )}

      <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>12-Week Schedule</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {protocol.schedule?.map((item, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ background: 'var(--accent)', color: 'white', width: 8, height: 8, borderRadius: '50%' }} />
              <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}>{item.week}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: 20, marginBottom: 4 }}>{item.action}</p>
            <p style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600, marginLeft: 20 }}>{item.dosage}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: 16, borderRadius: 12 }}>
        <p style={{ fontSize: '0.8rem', color: '#ef4444', lineHeight: 1.4 }}>
          <strong>Safety Note:</strong> {protocol.safetyNote}
        </p>
      </div>
    </div>
  );
}
