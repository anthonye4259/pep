import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Capacitor } from '@capacitor/core';
import { shouldShowHealthKit } from '../lib/deviceCheck';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IoAdd, IoClose, IoFlashOutline, IoFitnessOutline, IoMoonOutline, IoWatchOutline, IoFlameOutline } from 'react-icons/io5';

export default function Journal() {
  const { journal, saveJournalEntry, syncAppleHealth } = useApp();
  const [showLog, setShowLog] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], energy: 5, sleep: 5, recovery: 5, notes: '', rawSleep: null, rawEnergy: null });
  const [syncing, setSyncing] = useState(false);
  const [healthAvailable, setHealthAvailable] = useState(false);

  // Check if Apple Health is available on this device (iPhone only)
  useEffect(() => {
    (async () => {
      if (!Capacitor.isNativePlatform() || !shouldShowHealthKit()) return;
      try {
        const { Health } = await import('@capgo/capacitor-health');
        const result = await Health.isAvailable();
        if (result && result.available) setHealthAvailable(true);
      } catch { /* not available */ }
    })();
  }, []);

  // Format data for chart
  const data = [...journal].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Find latest biometrics
  const latestEntry = useMemo(() => {
    return data.slice().reverse().find(entry => entry.rawSleep !== undefined && entry.rawSleep !== null);
  }, [data]);

  async function handleHealthSync() {
    if (!healthAvailable) return;
    setSyncing(true);
    const result = await syncAppleHealth();
    if (result.success && result.sleepRating) {
      setForm(prev => ({ 
        ...prev, 
        sleep: result.sleepRating, 
        rawSleep: result.sleepHours,
        rawEnergy: result.activeCalories,
        notes: prev.notes + (prev.notes ? '\n' : '') + `Auto-synced from Apple Watch.` 
      }));
    }
    setSyncing(false);
  }

  async function handleSave() {
    try {
      await saveJournalEntry(form);
      setShowLog(false);
      setForm({ date: new Date().toISOString().split('T')[0], energy: 5, sleep: 5, recovery: 5, notes: '', rawSleep: null, rawEnergy: null });
    } catch (err) {
      console.error('Failed to save journal entry:', err);
    }
  }

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Journal <IoFlashOutline color="var(--accent)" />
          </h1>
          <p>Track your wellness progress</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowLog(true)} style={{ padding: '6px 12px' }}>
          <IoAdd size={18} style={{ marginRight: 6 }} /> Log
        </button>
      </div>

      {/* Apple Health Integration — always visible per App Store Guideline 2.5.1 */}
      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, #fffafa, #fff0f5)', border: '1px solid #ffe4e1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <IoWatchOutline size={20} color="var(--accent)" />
          <h2 style={{ fontSize: '1rem', margin: 0, color: 'var(--text)' }}>Apple Health Integration</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          PeptidAI integrates with <strong>Apple Health</strong> to automatically import your Sleep Analysis and Active Energy Burned data into your daily journal entries. {!healthAvailable && 'This feature is available on iPhone.'}
        </p>
      </div>

      {/* Apple Health Biometrics Dashboard — only show on iPhone */}
      {healthAvailable && latestEntry && (
        <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, #fffafa, #fff0f5)', border: '1px solid #ffe4e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <IoWatchOutline size={20} color="var(--accent)" />
            <h2 style={{ fontSize: '1rem', margin: 0, color: 'var(--text)' }}>Apple Health Insights</h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: -12, marginBottom: 16 }}>Latest Sync: {new Date(latestEntry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'white', padding: 16, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', marginBottom: 8 }}>
                <IoMoonOutline size={16} /> <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sleep</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' }}>
                {latestEntry.rawSleep} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>hrs</span>
              </div>
            </div>
            
            <div style={{ background: 'white', padding: 16, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', marginBottom: 8 }}>
                <IoFlameOutline size={16} /> <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Activity</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' }}>
                {latestEntry.rawEnergy} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>kcal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>30-Day Trends</h2>
        {data.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No journal entries yet. Start logging to see your progress!
          </div>
        ) : (
          <div style={{ height: 250, width: '100%', marginLeft: -10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: 'var(--text-secondary)'}} tickFormatter={(str) => {
                  const d = new Date(str);
                  return `${d.getMonth()+1}/${d.getDate()}`;
                }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 10]} tick={{fontSize: 10, fill: 'var(--text-secondary)'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--shadow)' }} />
                <Line type="monotone" dataKey="energy" stroke="var(--accent)" strokeWidth={3} dot={{r: 4}} name="Energy" />
                <Line type="monotone" dataKey="sleep" stroke="var(--text-muted)" strokeWidth={3} dot={{r: 4}} name="Sleep" />
                <Line type="monotone" dataKey="recovery" stroke="var(--success)" strokeWidth={3} dot={{r: 4}} name="Recovery" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="section">
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>History</h3>
        {data.slice().reverse().map(entry => (
          <div key={entry.date} className="card" style={{ cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
               {new Date(entry.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: '0.85rem', marginBottom: entry.notes ? 8 : 0 }}>
              <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Energy: {entry.energy}/10</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Sleep: {entry.sleep}/10</span>
              <span style={{ color: 'var(--success)', fontWeight: 500 }}>Recovery: {entry.recovery}/10</span>
              {entry.rawSleep && (
                <span style={{ color: 'var(--text)', fontWeight: 600, background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 12 }}>
                  <IoWatchOutline style={{ verticalAlign: 'middle', marginRight: 4 }}/>
                  {entry.rawSleep}h • {entry.rawEnergy}kcal
                </span>
              )}
            </div>
            {entry.notes && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
                {entry.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {showLog && (
        <div className="modal-overlay" onClick={() => setShowLog(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', width: '100%', padding: 24, paddingBottom: 'calc(24px + env(safe-area-inset-bottom))', borderRadius: '24px 24px 0 0', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>Daily Check-In</h2>
              <button className="btn btn-icon btn-sm" style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }} onClick={() => setShowLog(false)}><IoClose size={24} /></button>
            </div>
            
            {healthAvailable && (
              <>
                <button 
                  type="button" 
                  onClick={handleHealthSync} 
                  disabled={syncing}
                  style={{ width: '100%', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, background: form.rawSleep ? 'var(--bg)' : 'var(--bg-card)', border: '1px solid var(--border)', color: form.rawSleep ? 'var(--success)' : 'var(--text)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <IoWatchOutline size={20} color={form.rawSleep ? 'var(--success)' : 'var(--accent)'} />
                  {syncing ? 'Syncing...' : form.rawSleep ? 'Synced!' : 'Sync Apple Health'}
                </button>
                
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 20px 0', textAlign: 'center' }}>
                  We use <strong>Apple Health</strong> to securely import your Sleep Analysis and Active Energy Burned to prepopulate your journal.
                </p>
              </>
            )}

            <div className="input-group">
              <label>Date</label>
              <input type="date" className="input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IoFitnessOutline /> Energy Levels</span>
                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{form.energy}/10</span>
              </label>
              <input type="range" min="1" max="10" value={form.energy} onChange={e => setForm({...form, energy: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>

            <div className="input-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IoMoonOutline /> Sleep Quality</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>{form.sleep}/10</span>
              </label>
              <input type="range" min="1" max="10" value={form.sleep} onChange={e => setForm({...form, sleep: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--text-muted)' }} />
            </div>

            <div className="input-group">
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Recovery & Tone</span>
                <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{form.recovery}/10</span>
              </label>
              <input type="range" min="1" max="10" value={form.recovery} onChange={e => setForm({...form, recovery: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--success)' }} />
            </div>
            
            <div className="input-group">
              <label>Notes (Auto-fills with sync)</label>
              <textarea className="input" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="How are you feeling today?" />
            </div>

            <button className="btn btn-primary btn-full" onClick={handleSave} style={{ marginTop: 8 }}>Save Entry</button>
          </div>
        </div>
      )}
    </div>
  );
}
