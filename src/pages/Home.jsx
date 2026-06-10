import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCameraOutline, IoFlaskOutline, IoChevronForward, IoSettingsOutline, IoSparkles, IoJournalOutline, IoCalendarOutline } from 'react-icons/io5';
import { useApp } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { vials, userProfile } = useApp();

  const recentVials = (vials || []).slice(0, 4);
  const hasVials = recentVials.length > 0;

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>Peptid<span style={{ color: 'var(--success)' }}>AI</span></h1>
          <p style={{ color: '#999', fontSize: '0.85rem' }}>Your wellness research companion</p>
        </div>
        <button
          onClick={() => navigate('/settings')}
          style={{ width: 40, height: 40, borderRadius: '50%', background: '#f5f5f5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <IoSettingsOutline size={20} color="#999" />
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <button
          className="card"
          onClick={() => navigate('/journal')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 20, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-card)' }}
        >
          <IoJournalOutline size={28} color="var(--accent)" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Daily Journal</span>
          <span style={{ fontSize: '0.75rem', color: '#999' }}>Log your wellness data</span>
        </button>

        <button
          className="card"
          onClick={() => navigate('/calendar')}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 20, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-card)' }}
        >
          <IoCalendarOutline size={28} color="var(--accent)" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>History</span>
          <span style={{ fontSize: '0.75rem', color: '#999' }}>Track your progress</span>
        </button>
      </div>

      {/* AI Plan CTA */}
      <div
        onClick={() => navigate('/plan')}
        style={{ 
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--text-muted) 100%)', 
          border: 'none',
          boxShadow: '0 20px 40px rgba(236,72,153,0.3)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 20,
          padding: '28px 24px',
          cursor: 'pointer',
          marginBottom: 24
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transform: 'skewX(-20deg) translateX(-150%)', animation: 'shimmer 3s infinite' }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)', width: 60, height: 60, borderRadius: 30, marginBottom: 12 }}>
             <IoSparkles size={32} color="white" />
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: 6 }}>AI Wellness Plan</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Personalized 12-week protocol</div>
        </div>
      </div>
      <style>{`@keyframes shimmer { 100% { transform: skewX(-20deg) translateX(150%); } }`}</style>

      {/* Saved Configurations */}
      {hasVials && (
        <div className="section mt-20">
          <div className="section-header"><span className="section-title">Saved Compounds</span></div>
          {recentVials.map((vial, i) => (
            <div key={vial.id || i} className="vial-card" style={{ cursor: 'default' }}>
              <div className="vial-icon"><IoFlaskOutline size={22} /></div>
              <div className="vial-info">
                <div className="vial-name">{vial.peptideName}</div>
                <div className="vial-detail">{vial.peptideMg}mg / {vial.waterMl}mL</div>
                {vial.lastInjected && (
                  <div className="vial-injected">Last logged: {new Date(vial.lastInjected).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
