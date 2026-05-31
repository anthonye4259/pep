import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateProtocol } from '../lib/gemini';
import { IoSparkles, IoCheckmarkCircle, IoRefreshCircle, IoFlameOutline } from 'react-icons/io5';

export default function MyPlan() {
  const { appState, userProfile, updateProfileData } = useApp();
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
      const generated = await generateProtocol(answers);
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
        <div className="spinner" style={{ width: 40, height: 40, borderColor: '#fce7f3', borderTopColor: '#ec4899', marginBottom: 20 }} />
        <h2 style={{ fontSize: '1.2rem', color: '#1a1a1a', fontWeight: 700 }}>Synthesizing your Plan...</h2>
        <p style={{ color: '#999', fontSize: '0.9rem', marginTop: 8 }}>Gemini AI is analyzing your goals.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: '#ec4899', fontWeight: 600 }}>{error}</p>
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
            AI Health Plan <IoSparkles color="#ec4899" size={24} />
          </h1>
          <p style={{ color: '#ec4899', fontWeight: 600, fontSize: '0.9rem' }}>Hyper-Personalized 30-Day Research Plan</p>
        </div>
        <button onClick={handleRegenerate} style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IoRefreshCircle size={28} />
          <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>UPDATE</span>
        </button>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', padding: 20, borderRadius: 16, color: 'white', marginBottom: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.5, fontWeight: 500, margin: 0 }}>"{protocol.summary}"</p>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}><IoFlameOutline color="#ec4899" /> Primary Focus Areas</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
        {protocol.focusAreas?.map((area, i) => (
          <div key={i} style={{ background: '#fce7f3', color: '#be185d', padding: '8px 16px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600 }}>
            {area}
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Daily Routine</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {protocol.dailyRoutine?.map((step, i) => (
          <div key={i} style={{ background: 'white', padding: 16, borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#ec4899', color: 'white', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {step.time}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#1a1a1a', lineHeight: 1.4, flex: 1 }}>{step.action}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: 16, borderRadius: 12 }}>
        <h4 style={{ color: '#d97706', fontSize: '0.85rem', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Safety Reminder</h4>
        <p style={{ color: '#92400e', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{protocol.safetyNote}</p>
      </div>
    </div>
  );
}
