import { useNavigate } from 'react-router-dom';
import { IoFlaskOutline, IoSettingsOutline, IoSparkles, IoJournalOutline, IoCalendarOutline, IoChevronForward } from 'react-icons/io5';
import { useApp } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { vials, journal, schedules } = useApp();

  const recentVials = (vials || []).slice(0, 4);
  const hasVials = recentVials.length > 0;
  const journalCount = (journal || []).length;
  const scheduleCount = (schedules || []).length;
  const latestJournal = (journal || [])[0];
  const latestJournalLabel = latestJournal?.date ? new Date(latestJournal.date).toLocaleDateString() : 'Not logged';

  return (
    <div className="page">
      {/* Header */}
      <div className="home-topbar">
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>Peptid<span style={{ color: 'var(--accent)' }}>AI</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your wellness research companion</p>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="home-settings-btn"
          aria-label="Open settings"
        >
          <IoSettingsOutline size={20} />
        </button>
      </div>

      <div className="home-summary-grid" aria-label="Your PeptidAI summary">
        <div className="home-summary-card">
          <div className="home-summary-value">{(vials || []).length}</div>
          <div className="home-summary-label">Saved compounds</div>
        </div>
        <div className="home-summary-card">
          <div className="home-summary-value">{journalCount}</div>
          <div className="home-summary-label">Journal entries</div>
        </div>
        <div className="home-summary-card">
          <div className="home-summary-value">{scheduleCount}</div>
          <div className="home-summary-label">Protocols</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="home-action-grid">
        <button
          className="card home-action-card"
          onClick={() => navigate('/journal')}
        >
          <span className="home-action-icon"><IoJournalOutline size={24} /></span>
          <span className="home-action-title">Daily Journal</span>
          <span className="home-action-copy">Last entry: {latestJournalLabel}</span>
          <IoChevronForward size={16} style={{ marginTop: 'auto', color: 'var(--text-muted)' }} />
        </button>

        <button
          className="card home-action-card"
          onClick={() => navigate(hasVials ? '/calendar' : '/vials')}
        >
          <span className="home-action-icon">
            {hasVials ? <IoCalendarOutline size={24} /> : <IoFlaskOutline size={24} />}
          </span>
          <span className="home-action-title">{hasVials ? 'History' : 'Create Vial'}</span>
          <span className="home-action-copy">{hasVials ? 'Review recent logs and protocol timing' : 'Start with a saved calculator setup'}</span>
          <IoChevronForward size={16} style={{ marginTop: 'auto', color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* AI Plan CTA */}
      <button
        type="button"
        className="home-hero-card"
        onClick={() => navigate('/plan')}
      >
        <div className="home-hero-content">
          <div className="home-hero-icon">
            <IoSparkles size={30} color="white" />
          </div>
          <div>
            <div className="home-hero-title">AI Wellness Plan</div>
            <div className="home-hero-copy">Review or regenerate your personalized 12-week research protocol.</div>
          </div>
        </div>
      </button>

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

      {!hasVials && (
        <div className="empty-state">
          <div className="empty-title">No saved compounds yet</div>
          <div className="empty-text">Create your first vial calculator setup to make logging and schedule tracking easier.</div>
          <button className="btn btn-primary" onClick={() => navigate('/vials')}>Create First Vial</button>
        </div>
      )}
    </div>
  );
}
