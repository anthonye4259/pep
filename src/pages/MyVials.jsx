import { useState } from 'react';
import { IoFlaskOutline, IoChevronForward, IoTrash, IoAdd, IoClose } from 'react-icons/io5';
import { useApp } from '../context/AppContext';

const emptyForm = { peptideName: '', peptideMg: '', waterMl: '', targetMcg: '' };

export default function MyVials() {
  const { vials, deleteVial, saveVial } = useApp();
  const [showAddVial, setShowAddVial] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function handleSave() {
    await saveVial({
      peptideName: form.peptideName,
      peptideMg: Number(form.peptideMg),
      waterMl: Number(form.waterMl),
      targetMcg: Number(form.targetMcg),
    });
    setShowAddVial(false);
    setForm(emptyForm);
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>My Vials</h1>
          <p>Your saved configurations</p>
        </div>
        {vials && vials.length > 0 && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddVial(true)} style={{ padding: '6px 12px' }}>
            <IoAdd size={18} style={{ marginRight: 6 }} /> Add
          </button>
        )}
      </div>

      {(!vials || vials.length === 0) ? (
        <div className="empty-state">
          <div className="empty-icon"><IoFlaskOutline size={48} /></div>
          <div className="empty-title">No saved vials</div>
          <div className="empty-text">Add a vial configuration to get started</div>
          <button className="btn btn-primary" onClick={() => setShowAddVial(true)}>
            Add a Vial
          </button>
        </div>
      ) : (
        <div>
          {vials.map((vial, i) => (
            <div key={vial.id || i} style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <button
                className="vial-card"
                style={{ flex: 1, cursor: 'default' }}
              >
                <div className="vial-icon"><IoFlaskOutline size={22} /></div>
                <div className="vial-info">
                  <div className="vial-name">{vial.peptideName}</div>
                  <div className="vial-detail">
                    {vial.peptideMg}mg / {vial.waterMl}mL BAC / {vial.targetMcg}mcg target
                  </div>
                  {vial.lastInjected && (
                    <div className="vial-injected">
                      Last logged: {new Date(vial.lastInjected).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="vial-arrow"><IoChevronForward size={18} /></div>
              </button>
              <button
                className="btn btn-icon"
                style={{ background: 'rgba(207,102,121,0.1)', border: '1px solid rgba(207,102,121,0.2)', borderRadius: 12, color: 'var(--danger)', flexShrink: 0 }}
                onClick={() => deleteVial(vial.id)}
              >
                <IoTrash size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddVial && (
        <div className="modal-overlay" onClick={() => setShowAddVial(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', width: '100%', padding: 24, paddingBottom: 'calc(24px + env(safe-area-inset-bottom))', borderRadius: '24px 24px 0 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>Add Vial Configuration</h2>
              <button className="btn btn-icon btn-sm" style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }} onClick={() => setShowAddVial(false)}><IoClose size={24} /></button>
            </div>

            <div className="input-group">
              <label>Peptide Name</label>
              <input className="input" type="text" placeholder="e.g. BPC-157" value={form.peptideName} onChange={e => setForm({ ...form, peptideName: e.target.value })} />
            </div>

            <div className="input-group">
              <label>Peptide Amount (mg)</label>
              <input className="input" type="number" placeholder="e.g. 5" value={form.peptideMg} onChange={e => setForm({ ...form, peptideMg: e.target.value })} />
            </div>

            <div className="input-group">
              <label>BAC Water (mL)</label>
              <input className="input" type="number" placeholder="e.g. 2" value={form.waterMl} onChange={e => setForm({ ...form, waterMl: e.target.value })} />
            </div>

            <div className="input-group">
              <label>Target Dose (mcg)</label>
              <input className="input" type="number" placeholder="e.g. 250" value={form.targetMcg} onChange={e => setForm({ ...form, targetMcg: e.target.value })} />
            </div>

            <button className="btn btn-primary btn-full" onClick={handleSave} style={{ marginTop: 8 }}>Save Vial</button>
          </div>
        </div>
      )}
    </div>
  );
}
