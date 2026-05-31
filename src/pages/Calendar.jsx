import { useState } from 'react';
import { IoChevronBack, IoChevronForward, IoFlaskOutline, IoAdd, IoClose, IoNotifications, IoShareSocialOutline, IoCameraOutline } from 'react-icons/io5';
import { useApp } from '../context/AppContext';
import ShareGraphic from '../components/ShareGraphic';
import { Share } from '@capacitor/share';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SCHEDULE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Calendar() {
  const { vials, schedules, saveSchedule, deleteSchedule } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ peptideName: '', days: [], time: '08:00' });
  const [showGraphic, setShowGraphic] = useState(false);
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Build log map
  const injectionDays = new Set();
  (vials || []).forEach(v => {
    if (v.lastInjected) {
      const d = new Date(v.lastInjected);
      if (d.getMonth() === month && d.getFullYear() === year) injectionDays.add(d.getDate());
    }
  });

  // Build schedule map for current month
  const scheduledDays = new Set();
  (schedules || []).forEach(s => {
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayName = SCHEDULE_DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
      if (s.days.includes(dayName)) scheduledDays.add(d);
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  function toggleScheduleDay(day) {
    setScheduleForm(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
  }

  function handleAddSchedule() {
    if (!scheduleForm.peptideName || scheduleForm.days.length === 0) return;
    saveSchedule({ ...scheduleForm, id: Date.now().toString() });
    setScheduleForm({ peptideName: '', days: [], time: '08:00' });
    setShowAddSchedule(false);
  }

  async function shareProtocol(s) {
    const data = btoa(JSON.stringify({ peptideName: s.peptideName, days: s.days, time: s.time }));
    const url = `peptidai://template?data=${data}`;
    try {
      await Share.share({ title: 'Protocol Template', text: `Try my ${s.peptideName} routine on PeptidAI!`, url });
    } catch (e) {
      console.error('Share error', e);
    }
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Calendar</h1>
          <p>Schedule & history</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowGraphic(true)} style={{ padding: '6px 12px' }}>
          <IoCameraOutline size={18} style={{ marginRight: 6 }} /> Export to Story
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button className="btn btn-icon btn-secondary btn-sm" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><IoChevronBack size={18} /></button>
          <h2 style={{ fontSize: '1.1rem' }}>{monthName}</h2>
          <button className="btn btn-icon btn-secondary btn-sm" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><IoChevronForward size={18} /></button>
        </div>
        <div className="calendar-grid">
          {DAYS.map(d => <div key={d} className="calendar-header-cell">{d}</div>)}
          {cells.map((day, i) => (
            <div key={i} className={`calendar-cell ${!day ? 'empty' : ''} ${day && isToday(day) ? 'today' : ''}`}>
              {day && (
                <>
                  <span className="calendar-day-num" style={{ fontWeight: injectionDays.has(day) ? 700 : 400 }}>{day}</span>
                  <div className="calendar-dots">
                    {injectionDays.has(day) && <div className="calendar-dot" style={{ background: '#34c759' }} />}
                    {scheduledDays.has(day) && !injectionDays.has(day) && <div className="calendar-dot" style={{ background: '#ccc' }} />}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.7rem', color: '#999', justifyContent: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34c759' }} /> Logged</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ccc' }} /> Scheduled</span>
        </div>
      </div>

      {/* Schedules */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Schedules</span>
          <button className="btn btn-sm btn-secondary" onClick={() => setShowAddSchedule(true)} style={{ padding: '6px 12px' }}><IoAdd size={16} /> Add</button>
        </div>
        {(!schedules || schedules.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '20px 16px', color: '#999', fontSize: '0.85rem' }}>
            <IoNotifications size={28} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p>No schedules yet. Add one to track your routine.</p>
          </div>
        ) : (
          schedules.map((s, i) => (
            <div key={i} className="vial-card" style={{ cursor: 'default', justifyContent: 'space-between' }}>
              <div className="vial-info">
                <div className="vial-name">{s.peptideName}</div>
                <div className="vial-detail">{s.days.join(', ')} at {s.time}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-icon btn-sm" style={{ background: 'none', border: 'none', color: '#ec4899' }} onClick={() => shareProtocol(s)}><IoShareSocialOutline size={18} /></button>
                <button className="btn btn-icon btn-sm" style={{ background: 'none', border: 'none', color: '#999' }} onClick={() => deleteSchedule(s.id)}><IoClose size={18} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent logs */}
      <div className="section">
        <div className="section-header"><span className="section-title">Recent Logs</span></div>
        {(vials || []).filter(v => v.lastInjected).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 16px', color: '#999', fontSize: '0.85rem' }}>No entries logged yet</div>
        ) : (
          (vials || []).filter(v => v.lastInjected).sort((a, b) => new Date(b.lastInjected) - new Date(a.lastInjected)).slice(0, 5).map((v, i) => (
            <div key={i} className="vial-card" style={{ cursor: 'default' }}>
              <div className="vial-icon"><IoFlaskOutline size={20} /></div>
              <div className="vial-info">
                <div className="vial-name">{v.peptideName}</div>
                <div className="vial-detail">{v.targetMcg}mcg — {new Date(v.lastInjected).toLocaleDateString()} {new Date(v.lastInjected).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — Last recorded</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add schedule modal */}
      {showAddSchedule && (
        <div className="modal-overlay" onClick={() => setShowAddSchedule(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 20 }}>Add Schedule</h2>
            <div className="input-group">
              <label>Peptide Name</label>
              <input type="text" className="input" placeholder="e.g. Compound A" value={scheduleForm.peptideName} onChange={e => setScheduleForm({ ...scheduleForm, peptideName: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Days</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SCHEDULE_DAYS.map(d => (
                  <button key={d} onClick={() => toggleScheduleDay(d)} style={{
                    padding: '8px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600,
                    background: scheduleForm.days.includes(d) ? '#1a1a1a' : '#f5f5f5',
                    color: scheduleForm.days.includes(d) ? 'white' : '#666',
                    border: 'none', cursor: 'pointer', fontFamily: 'Inter',
                  }}>{d}</button>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label>Time</label>
              <input type="time" className="input" value={scheduleForm.time} onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })} />
            </div>
            <button className="btn btn-primary btn-full" onClick={handleAddSchedule} style={{ marginTop: 8 }}>Save Schedule</button>
          </div>
        </div>
      )}

      {showGraphic && (
        <ShareGraphic 
          title="My Protocol Stack" 
          subtitle="Weekly Routine" 
          items={schedules.map(s => ({ title: s.peptideName, value: s.days.join(', ') }))} 
          onClose={() => setShowGraphic(false)} 
        />
      )}
    </div>
  );
}
