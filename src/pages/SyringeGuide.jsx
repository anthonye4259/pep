import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoArrowBack, IoSave, IoCheckmarkCircle, IoInformationCircleOutline, IoShareOutline } from 'react-icons/io5';
import NeonSyringe from '../components/NeonSyringe';
import { useApp } from '../context/AppContext';

const DISCLAIMER = 'FOR LABORATORY RESEARCH PURPOSES ONLY. NOT FOR HUMAN CONSUMPTION OR MEDICAL USE. This is an informational mathematical visualization tool, not medical advice. Verify all calculations independently. You are solely responsible for your use of this information.';

export default function SyringeGuide() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveVial } = useApp();
  const prefill = location.state || {};

  const [peptideName, setPeptideName] = useState(prefill.peptideName || '');
  const [peptideMg, setPeptideMg] = useState(prefill.peptideMg || '');
  const [waterMl, setWaterMl] = useState(prefill.waterMl || '');
  const [targetMcg, setTargetMcg] = useState(prefill.targetMcg || '');
  const [syringeSize, setSyringeSize] = useState(prefill.syringeSize || 'u100');
  const [saved, setSaved] = useState(false);
  const [logged, setLogged] = useState(false);

  const hasValues = peptideMg && waterMl && targetMcg;

  async function handleSave() {
    if (!peptideName.trim()) return;
    await saveVial({ peptideName: peptideName.trim(), peptideMg: Number(peptideMg), waterMl: Number(waterMl), targetMcg: Number(targetMcg), syringeSize });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleLog() {
    setLogged(true);
    await saveVial({ peptideName: peptideName.trim() || 'Unknown', peptideMg: Number(peptideMg), waterMl: Number(waterMl), targetMcg: Number(targetMcg), syringeSize, lastInjected: new Date().toISOString() });
    setTimeout(() => setLogged(false), 3000);
  }

  return (
    <div className="page" style={{ paddingBottom: 120 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-icon btn-secondary" onClick={() => navigate(-1)}><IoArrowBack size={20} /></button>
        <div>
          <h1 style={{ fontSize: '1.3rem' }}>Research Volume Calculator</h1>
          <h1 style={{ fontSize: '1.3rem' }}>Measurement Device Calculator</h1>
          <p className="text-muted text-sm">Research math visualizer</p>
        </div>
      </div>

      {/* User-driven inputs */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-group mb-24">
          <label className="label">Sample Label (Optional)</label>
          <input type="text" className="input" placeholder="e.g. Sample Solution A" value={peptideName} onChange={e => setPeptideName(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Container (mg)</label>
            <input type="number" className="input" placeholder="10" value={peptideMg} onChange={e => setPeptideMg(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Water added (mL)</label>
            <input type="number" className="input" placeholder="2" value={waterMl} onChange={e => setWaterMl(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Target Amount (mcg)</label>
            <input type="number" className="input" placeholder="250" value={targetMcg} onChange={e => setTargetMcg(e.target.value)} />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            For research and educational math purposes only.<br />Not a medical device. Not for human use.
          </p>
        </div>
      </div>

      {/* Measurement device visualization */}
      {hasValues && (
        <div className="animate-in">
          {/* Persistent disclaimer above syringe */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 10, marginBottom: 16, border: '1px solid var(--border)' }}>
            <IoInformationCircleOutline size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}><strong>{DISCLAIMER}</strong></p>
          </div>

          <NeonSyringe peptideMg={Number(peptideMg)} waterMl={Number(waterMl)} targetMcg={Number(targetMcg)} syringeSize={syringeSize} onSyringeChange={setSyringeSize} height={340} />

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleSave}>
              {saved ? <><IoCheckmarkCircle size={18} /> Saved</> : <><IoSave size={18} /> Save Config</>}
            </button>
            <button className="btn btn-primary" style={{ flex: 1, opacity: logged ? 0.6 : 1 }} onClick={handleLog}>
              {logged ? <><IoCheckmarkCircle size={18} /> Logged</> : 'Log Record'}
            </button>
          </div>
          <button className="btn btn-secondary btn-full" style={{ marginTop: 10 }} onClick={() => {
            const text = `PeptidAI Research Calculation\n${peptideName || 'Sample'} | ${peptideMg}mg container + ${waterMl}mL water\nTarget: ${targetMcg}mcg → Result: ${((Number(targetMcg) / ((Number(peptideMg) * 1000) / Number(waterMl))) * (syringeSize === 'u100' ? 100 : syringeSize === 'u50' ? 50 : 30)).toFixed(1)} units\n\nCalculated with PeptidAI`;
            if (navigator.share) { navigator.share({ text }); } else { navigator.clipboard.writeText(text); alert('Copied to clipboard!'); }
          }}><IoShareOutline size={18} /> Share Calculation</button>
        </div>
      )}
    </div>
  );
}
