import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IoAdd } from 'react-icons/io5';

export default function Journal() {
  const { journal, saveJournalEntry } = useApp();
  const [showLog, setShowLog] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], energy: 5, sleep: 5, recovery: 5 });

  function handleSave() {
    saveJournalEntry(form);
    setShowLog(false);
  }

  // Format data for chart
  const data = [...journal].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Journal</h1>
          <p>Track your transformation</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowLog(true)} style={{ padding: '6px 12px' }}>
          <IoAdd size={18} style={{ marginRight: 6 }} /> Log
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>30-Day Trends</h2>
        {data.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
            No journal entries yet. Start logging to see your progress!
          </div>
        ) : (
          <div style={{ height: 250, width: '100%', marginLeft: -10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#999'}} tickFormatter={(str) => {
                  const d = new Date(str);
                  return `${d.getMonth()+1}/${d.getDate()}`;
                }} />
                <YAxis domain={[1, 10]} tick={{fontSize: 10, fill: '#999'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="energy" stroke="var(--accent)" strokeWidth={3} dot={{r: 4}} name="Energy" />
                <Line type="monotone" dataKey="sleep" stroke="var(--text-muted)" strokeWidth={3} dot={{r: 4}} name="Sleep" />
                <Line type="monotone" dataKey="recovery" stroke="#34d399" strokeWidth={3} dot={{r: 4}} name="Recovery" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="section">
        <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>History</h3>
        {data.slice().reverse().map(entry => (
          <div key={entry.date} className="vial-card" style={{ cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#1a1a1a' }}>
               {new Date(entry.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Energy: {entry.energy}/10</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Sleep: {entry.sleep}/10</span>
              <span style={{ color: '#34d399', fontWeight: 500 }}>Recovery: {entry.recovery}/10</span>
            </div>
          </div>
        ))}
      </div>

      {showLog && (
        <div className="modal-overlay" onClick={() => setShowLog(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 20 }}>Daily Check-In</h2>
            <div className="input-group">
              <label>Date</label>
              <input type="date" className="input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            
            <div className="input-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Energy Levels</span>
                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{form.energy}/10</span>
              </label>
              <input type="range" min="1" max="10" value={form.energy} onChange={e => setForm({...form, energy: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>

            <div className="input-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sleep Quality</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>{form.sleep}/10</span>
              </label>
              <input type="range" min="1" max="10" value={form.sleep} onChange={e => setForm({...form, sleep: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--text-muted)' }} />
            </div>

            <div className="input-group">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Recovery & Tone</span>
                <span style={{ color: '#34d399', fontWeight: 'bold' }}>{form.recovery}/10</span>
              </label>
              <input type="range" min="1" max="10" value={form.recovery} onChange={e => setForm({...form, recovery: Number(e.target.value)})} style={{ width: '100%', accentColor: '#34d399' }} />
            </div>

            <button className="btn btn-primary btn-full" onClick={handleSave} style={{ marginTop: 20 }}>Save Entry</button>
          </div>
        </div>
      )}
    </div>
  );
}
