import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { peptideDatabase } from '../data/peptides';
import { IoClose, IoCheckmark } from 'react-icons/io5';

const INJECTION_SITES = ['Left Abdomen', 'Right Abdomen', 'Left Thigh', 'Right Thigh', 'Left Delt', 'Right Delt', 'Left Glute', 'Right Glute'];

export default function QuickLogModal({ onClose }) {
  const { state, dispatch } = useApp();
  const { protocol } = state;

  const [peptideId, setPeptideId] = useState(protocol[0]?.peptideId || '');
  const [doseMcg, setDoseMcg] = useState('');
  const [route, setRoute] = useState('Subcutaneous');
  const [site, setSite] = useState('');
  const [notes, setNotes] = useState('');

  // When peptide changes, prefill dose from protocol
  function handlePeptideChange(id) {
    setPeptideId(id);
    const protocolItem = protocol.find(p => p.peptideId === id);
    if (protocolItem) {
      setDoseMcg(protocolItem.doseMcg || '');
      setRoute(protocolItem.route || 'Subcutaneous');
    }
  }

  function handleLog() {
    if (!peptideId || !doseMcg) return;
    dispatch({
      type: 'LOG_DOSE',
      payload: { peptideId, doseMcg: Number(doseMcg), route, site, notes }
    });
    onClose();
  }

  const allPeptides = [
    ...protocol.map(p => {
      const db = peptideDatabase.find(pp => pp.id === p.peptideId);
      return db || { id: p.peptideId, name: p.peptideId, icon: 'medical' };
    }),
    ...peptideDatabase.filter(p => !protocol.find(pp => pp.peptideId === p.id))
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Log Dose</h2>
          <button className="modal-close" onClick={onClose}><IoClose size={20} /></button>
        </div>

        <div className="input-group">
          <label>Peptide</label>
          <select value={peptideId} onChange={e => handlePeptideChange(e.target.value)}>
            <option value="">Select peptide...</option>
            {protocol.length > 0 && (
              <optgroup label="My Protocol">
                {protocol.map(p => {
                  const db = peptideDatabase.find(pp => pp.id === p.peptideId);
                  return <option key={p.id} value={p.peptideId}>{db?.name || p.peptideId}</option>;
                })}
              </optgroup>
            )}
            <optgroup label="All Peptides">
              {peptideDatabase.filter(p => !protocol.find(pp => pp.peptideId === p.id)).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label>Dose (mcg)</label>
            <input className="input" type="number" value={doseMcg} onChange={e => setDoseMcg(e.target.value)} placeholder="250" />
          </div>
          <div className="input-group">
            <label>Route</label>
            <select value={route} onChange={e => setRoute(e.target.value)}>
              <option>Subcutaneous</option>
              <option>Intramuscular</option>
              <option>Oral</option>
              <option>Topical</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Injection Site</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {INJECTION_SITES.map(s => (
              <button key={s} className={`category-chip ${site === s ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                onClick={() => setSite(site === s ? '' : s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Notes (optional)</label>
          <input className="input" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any observations..." />
        </div>

        <button className="btn btn-primary btn-full" onClick={handleLog} disabled={!peptideId || !doseMcg}>
          Log Dose <IoCheckmark size={16} style={{ marginLeft: 4 }} />
        </button>
      </div>
    </div>
  );
}
