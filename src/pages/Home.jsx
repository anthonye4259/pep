import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCameraOutline, IoFlaskOutline, IoChevronForward, IoCreateOutline, IoSettingsOutline, IoSparkles } from 'react-icons/io5';
import { useApp } from '../context/AppContext';
import { extractVialLabel } from '../lib/gemini';

const QUICK_START = [
  { name: 'Semaglutide', mg: 5, mcg: 250 },
  { name: 'Tirzepatide', mg: 10, mcg: 2500 },
  { name: 'BPC-157', mg: 5, mcg: 250 },
];

export default function Home() {
  const navigate = useNavigate();
  const { vials } = useApp();
  const fileInputRef = useRef(null);
  const [scanning, setScanning] = useState(false);

  const recentVials = (vials || []).slice(0, 4);
  const hasVials = recentVials.length > 0;

  async function handleCapture(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    try {
      const base64 = await fileToBase64(file);
      const extracted = await extractVialLabel(base64);
      navigate('/guide', { state: { ...extracted } });
    } catch (err) {
      console.error('Scan failed:', err);
      navigate('/guide');
    } finally {
      setScanning(false);
    }
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>Peptid<span style={{ color: '#39ff14' }}>AI</span></h1>
          <p style={{ color: '#999', fontSize: '0.85rem' }}>Your reconstitution calculator</p>
        </div>
        <button
          onClick={() => navigate('/settings')}
          style={{ width: 40, height: 40, borderRadius: '50%', background: '#f5f5f5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <IoSettingsOutline size={20} color="#999" />
        </button>
      </div>

      {/* Scan Hero */}
      <div
        className={`scan-hero ${scanning ? 'camera-active' : ''}`}
        onClick={() => !scanning && fileInputRef.current?.click()}
      >
        {scanning ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div className="spinner" style={{ width: 32, height: 32, borderColor: '#e5e5e5', borderTopColor: '#1a1a1a' }} />
            <span style={{ fontWeight: 600, color: '#1a1a1a' }}>Analyzing vial label...</span>
          </div>
        ) : (
          <>
            <div className="scan-corners">
              <div className="scan-corner tl" /><div className="scan-corner tr" />
              <div className="scan-corner bl" /><div className="scan-corner br" />
            </div>
            <IoCameraOutline className="scan-hero-icon" size={48} />
            <div className="scan-hero-text">Snap Your Vial Label</div>
            <div className="scan-hero-sub">AI extracts the peptide name & concentration</div>
          </>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleCapture} />
      </div>

      <button className="btn btn-secondary btn-full mt-12" onClick={() => navigate('/guide')} style={{ gap: 8 }}>
        <IoCreateOutline size={18} /> Enter manually
      </button>

      {/* Quick start — only show when no saved vials */}
      {!hasVials && (
        <div className="section mt-20">
          <div className="section-header">
            <span className="section-title"><IoSparkles size={12} style={{ marginRight: 4 }} />Quick Start</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: 12 }}>Tap a common peptide to try the calculator:</p>
          {QUICK_START.map((p, i) => (
            <button
              key={i}
              className="vial-card"
              onClick={() => navigate('/guide', { state: { peptideName: p.name, peptideMg: p.mg, targetMcg: p.mcg, waterMl: '' } })}
            >
              <div className="vial-icon"><IoFlaskOutline size={22} /></div>
              <div className="vial-info">
                <div className="vial-name">{p.name}</div>
                <div className="vial-detail">{p.mg}mg vial · {p.mcg >= 1000 ? `${p.mcg/1000}mg` : `${p.mcg}mcg`} common dose</div>
              </div>
              <div className="vial-arrow"><IoChevronForward size={18} /></div>
            </button>
          ))}
          <p style={{ fontSize: '0.7rem', color: '#bbb', textAlign: 'center', marginTop: 10 }}>You will enter your own water amount and verify all values</p>
        </div>
      )}

      {/* Recent Vials — show when user has saved configs */}
      {hasVials && (
        <div className="section mt-20">
          <div className="section-header"><span className="section-title">Recent Configurations</span></div>
          {recentVials.map((vial, i) => (
            <button key={vial.id || i} className="vial-card" onClick={() => navigate('/guide', { state: vial })}>
              <div className="vial-icon"><IoFlaskOutline size={22} /></div>
              <div className="vial-info">
                <div className="vial-name">{vial.peptideName}</div>
                <div className="vial-detail">{vial.peptideMg}mg / {vial.waterMl}mL / {vial.targetMcg}mcg</div>
                {vial.lastInjected && (
                  <div className="vial-injected">Last logged: {new Date(vial.lastInjected).toLocaleDateString()}</div>
                )}
              </div>
              <div className="vial-arrow"><IoChevronForward size={18} /></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
