import { useNavigate } from 'react-router-dom';
import { IoFlaskOutline, IoChevronForward, IoTrash } from 'react-icons/io5';
import { useApp } from '../context/AppContext';

export default function MyVials() {
  const navigate = useNavigate();
  const { vials, deleteVial } = useApp();

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Vials</h1>
        <p>Your saved configurations</p>
      </div>

      {(!vials || vials.length === 0) ? (
        <div className="empty-state">
          <div className="empty-icon"><IoFlaskOutline size={48} /></div>
          <div className="empty-title">No saved vials</div>
          <div className="empty-text">Scan a vial or enter details manually to save your first configuration</div>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Scan a Vial
          </button>
        </div>
      ) : (
        <div>
          {vials.map((vial, i) => (
            <div key={vial.id || i} style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
              <button
                className="vial-card"
                style={{ flex: 1 }}
                onClick={() => navigate('/guide', { state: vial })}
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
                style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff3b30', flexShrink: 0 }}
                onClick={() => deleteVial(vial.id)}
              >
                <IoTrash size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
