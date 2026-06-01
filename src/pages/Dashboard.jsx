import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, DataContext } from '../App';
import { Bell, ChevronDown, Flame, Moon, Droplets } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from 'recharts';

/* ── Custom CountUp Hook ── */
function useCountUp(end, duration = 600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime = null;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return count;
}



const CHART_CONFIGS = {
  Steps: { color: 'var(--primary-light)' },
  Sleep: { color: '#818cf8' },
  Cal: { color: '#ea580c' },
};

function MiniCalendar({ selectedDate, onSelect }) {
  const [viewDate, setViewDate] = useState(selectedDate);
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const numDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const dates = Array.from({length: numDays}, (_, i) => i + 1);
  const blanks = Array.from({length: firstDay}, (_, i) => i);

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  return (
    <div className="db-cal-dropdown fade-in">
      <div className="db-cal-top">
        <button className="db-cal-nav" onClick={prevMonth}>&lt;</button>
        <strong>{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</strong>
        <button className="db-cal-nav" onClick={nextMonth}>&gt;</button>
      </div>
      <div className="db-cal-grid">
        {days.map(d => <div key={d} className="db-cal-day-name">{d}</div>)}
        {blanks.map(b => <div key={`blank-${b}`} />)}
        {dates.map(d => {
          const isSelected = d === selectedDate.getDate() && viewDate.getMonth() === selectedDate.getMonth() && viewDate.getFullYear() === selectedDate.getFullYear();
          return (
            <button 
              key={d} 
              className={`db-cal-day ${isSelected ? 'active' : ''}`}
              onClick={() => onSelect(new Date(viewDate.getFullYear(), viewDate.getMonth(), d))}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { logData, setLogData } = useContext(DataContext);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('Steps');
  const [isCalOpen, setIsCalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Defaults to today
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  const quickAddWater = (ml) => {
    const current = logData[selectedKey] || {};
    const currentWater = current.water || 1200;
    setLogData(prev => ({
      ...prev,
      [selectedKey]: {
        ...prev[selectedKey],
        water: currentWater + ml
      }
    }));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setIsCalOpen(false);
  };

  const selectedKey = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const currentData = logData[selectedKey] || {};

  const targetSteps    = currentData.steps    || 0;
  const targetConsumed = currentData.calories || 0;
  const targetWater    = currentData.water    || 0;
  const targetBurned   = currentData.burned   || 0;
  const sleepHours     = currentData.sleepStart && currentData.sleepEnd
    ? (() => {
        const [sh, sm] = currentData.sleepStart.split(':').map(Number);
        const [eh, em] = currentData.sleepEnd.split(':').map(Number);
        const startMins = sh * 60 + sm;
        const endMins   = eh * 60 + em;
        const diff = endMins < startMins ? (1440 - startMins + endMins) : (endMins - startMins);
        return diff / 60;
      })()
    : null;

  const weeklyData = (() => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString().split('T')[0];
      const entry = logData[key] || {};
      return {
        day: days[d.getDay()],
        Steps: entry.steps || 0,
        Sleep: entry.sleepStart && entry.sleepEnd
          ? (() => {
              const [sh,sm] = entry.sleepStart.split(':').map(Number);
              const [eh,em] = entry.sleepEnd.split(':').map(Number);
              const diff = (eh*60+em) < (sh*60+sm)
                ? (1440 - sh*60 - sm + eh*60 + em)
                : (eh*60+em - sh*60 - sm);
              return parseFloat((diff/60).toFixed(1));
            })()
          : 0,
        Cal: entry.calories || 0,
      };
    });
  })();

  const stepsCount = useCountUp(targetSteps, 600);
  const consumedCount = useCountUp(targetConsumed, 500);
  const burnedCount = useCountUp(targetBurned, 500);

  const dashoffset = loaded ? (1 - Math.min(targetSteps / 10000, 1)) * 251.2 : 251.2;

  const dateStr = selectedDate.getDate() === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth() 
    ? `Today, ${selectedDate.toLocaleString('default', { month: 'short' })} ${selectedDate.getDate()}`
    : `${selectedDate.toLocaleString('default', { month: 'short' })} ${selectedDate.getDate()}`;

  return (
    <div className="db-page">
      {/* Header */}
      <div className={`db-header ${loaded ? 'fade-in' : 'hidden'}`}>
        <div style={{ position: 'relative' }}>
          <h1 className="db-title">My Wellness</h1>
          <button className="db-date-btn" onClick={() => navigate('/log')}>
            <span style={{ color: 'var(--primary)' }}>📅</span> {dateStr}
            <ChevronDown size={14} color="#6b7280" />
          </button>
          {isCalOpen && <MiniCalendar selectedDate={selectedDate} onSelect={handleDateSelect} />}
        </div>
        <div className="db-header-actions">
          <button className="db-bell" aria-label="Notifications" onClick={() => navigate('/notifications')}>
            <Bell size={18} color="#111827" />
            <span className="db-bell-dot" />
          </button>
          <div className="db-avatar" onClick={() => navigate('/profile')}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>

      <div className="db-scroll-content">
        {/* Row 1: Steps & Sleep */}
        <div className="db-grid-2">
          {/* Steps Card */}
          <div className="db-card stagger-1">
            <div className="db-card-top">
              <span className="db-card-label">STEPS</span>
              <div className="db-icon-wrap" style={{ background: 'var(--primary-bg)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 8H5"/></svg>
              </div>
            </div>
            
            <div className="db-ring-wrap">
              <svg width="100" height="100" viewBox="0 0 100 100" className="db-ring-svg">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary-bg)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary-light)" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={dashoffset}
                  transform="rotate(-90 50 50)" className="db-ring-progress" />
              </svg>
              <div className="db-ring-text">
                <span className="db-ring-val">{stepsCount.toLocaleString()}</span>
                <span className="db-ring-max">/ 10,000</span>
              </div>
            </div>

            <div className="db-streak-pill">
              <Flame size={12} fill="var(--primary-light)" color="var(--primary-light)" />
              <span>5 day streak</span>
            </div>
            <p className="db-card-foot">
              {targetSteps > 0
                ? `${Math.min(100, Math.round((targetSteps / 10000) * 100))}% of daily goal`
                : 'No steps logged yet'}
            </p>
          </div>

          {/* Sleep Card */}
          <div className="db-card stagger-2">
            <div className="db-card-top">
              <span className="db-card-label">SLEEP</span>
              <div className="db-icon-wrap" style={{ background: '#f5f3ff' }}>
                <Moon size={14} fill="#6366f1" color="#6366f1" />
              </div>
            </div>

            <div className="db-sleep-main">
              <h3 className="db-sleep-val">
                {sleepHours != null
                  ? `${Math.floor(sleepHours)}h ${Math.round((sleepHours % 1) * 60)}m`
                  : '—'}
              </h3>
              <p className="db-sleep-sub">
                {currentData.sleepStart && currentData.sleepEnd
                  ? `${currentData.sleepStart} – ${currentData.sleepEnd}`
                  : 'Not logged yet'}
              </p>
            </div>

            <div className="db-sleep-score">
              <div className="db-score-circ">
                {sleepHours != null ? Math.min(100, Math.round((sleepHours / 8) * 100)) : '—'}
              </div>
              <div className="db-score-text">
                <strong>Sleep Score</strong>
                <span>
                  {sleepHours == null ? 'No data'
                    : sleepHours >= 8 ? 'Excellent'
                    : sleepHours >= 7 ? 'Good'
                    : sleepHours >= 6 ? 'Fair'
                    : 'Poor'}
                </span>
              </div>
            </div>

            <div className="db-sleep-stages">
              <span className="db-stages-lbl">Sleep stages</span>
              <div className="db-stage-bars">
                <div className="db-sbar" style={{ height: '60%', animationDelay: '0.1s' }} />
                <div className="db-sbar" style={{ height: '40%', animationDelay: '0.14s' }} />
                <div className="db-sbar" style={{ height: '80%', animationDelay: '0.18s' }} />
                <div className="db-sbar" style={{ height: '50%', animationDelay: '0.22s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Calories Card */}
        {/* Calories & Water Row */}
        <div className="db-grid-2" style={{ marginTop: 14 }}>
          {/* Calories Card */}
          <div className="db-card stagger-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="db-card-top" style={{ marginBottom: 12 }}>
              <div className="db-cal-title">
                <div className="db-icon-wrap" style={{ background: '#fff7ed' }}>
                  <Flame size={14} fill="#ea580c" color="#ea580c" />
                </div>
                <span className="db-card-title" style={{ fontSize: '14px' }}>Calories</span>
              </div>
              <span className="db-card-sub" style={{ fontSize: '11px' }}>{dateStr.replace('Today, ', '')}</span>
            </div>

            <div style={{ margin: '8px 0' }}>
              <div className="db-dot-label" style={{ marginBottom: 2 }}><span className="db-dot" style={{ background: 'var(--primary-light)' }}/> Consumed</div>
              <div className="db-cal-val" style={{ fontSize: '16px' }}><strong>{consumedCount.toLocaleString()}</strong> <span style={{ fontSize: '10px' }}>kcal</span></div>
              
              <div className="db-dot-label" style={{ marginTop: 8, marginBottom: 2 }}><span className="db-dot" style={{ background: '#f97316' }}/> Burned</div>
              <div className="db-cal-val" style={{ fontSize: '16px' }}><strong>{burnedCount}</strong> <span style={{ fontSize: '10px' }}>kcal</span></div>
            </div>

            <div className="db-prog-label" style={{ marginTop: 8, fontSize: '10px' }}>
              <span>Net: {targetConsumed - targetBurned} kcal</span>
            </div>
            <div className="db-cal-bar" style={{ height: '6px', margin: '4px 0' }}>
              <div className="db-cal-fill-c" style={{ width: loaded ? `${Math.min(((targetConsumed - targetBurned) / 2000) * 100, 100)}%` : '0%' }} />
            </div>
            <p className="db-card-foot" style={{ marginTop: 4 }}>Goal: 2,000 kcal</p>
          </div>

          {/* Water Card */}
          <div className="db-card stagger-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="db-card-top" style={{ marginBottom: 12 }}>
              <div className="db-cal-title">
                <div className="db-icon-wrap" style={{ background: '#eff6ff' }}>
                  <Droplets size={14} color="#3b82f6" fill="#3b82f6" />
                </div>
                <span className="db-card-title" style={{ fontSize: '14px' }}>Water</span>
              </div>
              <span className="db-card-sub" style={{ fontSize: '11px' }}>{dateStr.replace('Today, ', '')}</span>
            </div>

            <div style={{ margin: '14px 0 10px', textAlign: 'center' }}>
              <h3 className="db-sleep-val" style={{ color: '#3b82f6', fontSize: '24px' }}>{(targetWater / 1000).toFixed(1)}L</h3>
              <p className="db-sleep-sub" style={{ fontSize: '11px' }}>Target: 2.5L</p>
            </div>

            {/* Quick add water buttons */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); quickAddWater(250); }} 
                className="db-tab" 
                style={{ flex: 1, padding: '6px 4px', fontSize: '10px', fontWeight: '700', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                +250ml
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); quickAddWater(500); }} 
                className="db-tab" 
                style={{ flex: 1, padding: '6px 4px', fontSize: '10px', fontWeight: '700', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                +500ml
              </button>
            </div>
            
            <p className="db-card-foot" style={{ marginTop: 10 }}>{Math.round((targetWater / 2500) * 100)}% of goal</p>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="db-card stagger-4" style={{ marginTop: 14 }}>
          <div className="db-card-top" style={{ alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h3 className="db-card-title">Weekly Activity</h3>
              <p className="db-card-sub" style={{ fontSize: 12 }}>
                {(() => {
                  const start = new Date(); start.setDate(start.getDate() - 6);
                  return `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()} – ${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getDate()}`;
                })()}
              </p>
            </div>
            <div className="db-tabs">
              {['Steps', 'Sleep', 'Cal'].map(t => (
                <button key={t} className={`db-tab ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="db-chart-wrap" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.2s 0.3s' }}>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_CONFIGS[activeTab]?.color || 'var(--primary-light)'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={CHART_CONFIGS[activeTab]?.color || 'var(--primary-light)'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area 
                  type="monotone" dataKey={activeTab} stroke={CHART_CONFIGS[activeTab]?.color || 'var(--primary-light)'} strokeWidth={2.5}
                  fill="url(#chartGrad)" 
                  animationDuration={800} animationEasing="ease-out"
                  activeDot={{ r: 5, fill: CHART_CONFIGS[activeTab]?.color || 'var(--primary-light)', stroke: 'white', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="db-insights-head stagger-5">
          <h3 className="db-card-title">Today&apos;s Insights</h3>
          <button className="db-link" onClick={() => navigate('/insights')}>See all</button>
        </div>

        <InsightCard
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 8H5"/></svg>}
          title={targetSteps >= 10000 ? 'Goal Reached! 🎉' : 'Move More!'}
          badge="Steps"
          badgeColor="var(--primary)" badgeBg="#f0fdf4"
          text={
            targetSteps === 0
              ? <>You haven't logged any steps today. Head to <strong>Log</strong> to add them!</>
              : targetSteps >= 10000
              ? <><strong>Amazing!</strong> You've hit your 10,000 step goal today. Keep it up!</>
              : <>You're <strong>{(10000 - targetSteps).toLocaleString()} steps</strong> away from your goal. A quick walk could close the gap!</>
          }
          className="green stagger-6"
        />

        <InsightCard
          icon={<Droplets size={18} />}
          title="Stay Hydrated"
          badge="Water"
          badgeColor="#6366f1" badgeBg="#f5f3ff"
          text={
            targetWater === 0
              ? <>You haven't logged any water today. Tap <strong>+250ml</strong> above to get started.</>
              : targetWater >= 2500
              ? <><strong>Perfectly hydrated!</strong> You've hit your 2.5L goal today. Great work!</>
              : <>You've logged <strong>{(targetWater / 1000).toFixed(1)}L</strong> today. Aim for <strong>2.5L</strong> to support your energy and sleep.</>
          }
          className="purple stagger-7"
        />

        <div style={{ height: 24 }} />
      </div>

      <style>{`
        .db-page {
          min-height: 100vh;
          background: #fcfcfc;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }
        .db-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 48px 20px 16px;
          background: white;
          z-index: 10;
        }
        .hidden { opacity: 0; }
        .fade-in { animation: fadeIn 0.12s ease-out forwards; }
        @keyframes fadeIn { to { opacity: 1; } }

        .db-title { font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.4px; line-height: 1.2; }
        .db-date-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; font-size: 13px; color: #6b7280;
          font-weight: 500; font-family: inherit; padding: 0; margin-top: 4px;
          cursor: pointer; transition: transform 0.08s;
        }
        .db-date-btn:active { transform: scale(0.96); }
        .db-header-actions { display: flex; align-items: center; gap: 12px; }
        .db-bell {
          width: 36px; height: 36px; border-radius: 50%;
          background: #f3f4f6; border: none; display: flex; align-items: center; justify-content: center;
          position: relative; cursor: pointer;
        }
        .db-bell-dot {
          position: absolute; top: 8px; right: 9px; width: 6px; height: 6px;
          background: #22c55e; border-radius: 50%; border: 1.5px solid #f3f4f6;
          animation: popBadge 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes popBadge { from { transform: scale(0); } to { transform: scale(1); } }
        .db-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: url('https://i.pravatar.cc/100?img=5') center/cover;
          cursor: pointer; transition: transform 0.08s;
        }
        .db-avatar:active { transform: scale(0.96); }

        .db-cal-dropdown {
          position: absolute; top: 100%; left: 0; margin-top: 8px;
          background: white; border-radius: 16px; padding: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05);
          z-index: 50; width: 260px;
        }
        .db-cal-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; font-weight: 700; color: #111827; }
        .db-cal-nav { background: #f3f4f6; border: none; width: 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #4b5563; font-weight: 700; transition: background 0.2s; }
        .db-cal-nav:active { background: #e5e7eb; }
        .db-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
        .db-cal-day-name { font-size: 10px; font-weight: 700; color: #9ca3af; margin-bottom: 8px; }
        .db-cal-day {
          background: transparent; border: none; border-radius: 50%;
          width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #374151; cursor: pointer; margin: auto; transition: all 0.2s;
        }
        .db-cal-day:hover { background: #f3f4f6; }
        .db-cal-day.active { background: var(--primary); color: white; box-shadow: 0 4px 10px var(--primary-glow); }

        .db-scroll-content {
          flex: 1; overflow-y: auto; padding: 16px 20px;
          padding-bottom: 90px;
        }

        /* Staggered entry */
        .stagger-1 { animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) 0.06s both; }
        .stagger-2 { animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) 0.12s both; }
        .stagger-3 { animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) 0.18s both; }
        .stagger-4 { animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) 0.24s both; }
        .stagger-5 { animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) 0.30s both; }
        .stagger-6 { animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) 0.34s both; }
        .stagger-7 { animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) 0.38s both; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .db-card {
          background: white; border-radius: 20px; padding: 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.03);
          transition: transform 0.12s, box-shadow 0.12s;
        }
        .db-card:active { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
        .db-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        
        .db-card-top { display: flex; align-items: center; justify-content: space-between; }
        .db-card-label { font-size: 11px; font-weight: 700; color: #6b7280; letter-spacing: 0.06em; }
        .db-icon-wrap { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        
        /* Steps */
        .db-ring-wrap { display: flex; justify-content: center; margin: 16px 0; position: relative; }
        .db-ring-svg { transform: rotate(-90deg) scale(1, -1); }
        .db-ring-progress { transition: stroke-dashoffset 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .db-ring-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .db-ring-val { font-size: 18px; font-weight: 800; color: #111827; line-height: 1.1; }
        .db-ring-max { font-size: 10px; color: #9ca3af; font-weight: 600; }
        .db-streak-pill {
          display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px;
          background: #f0fdf4; border-radius: 12px; font-size: 11px; font-weight: 700; color: var(--primary);
          margin-bottom: 12px;
        }
        .db-card-foot { font-size: 11px; color: #6b7280; }

        /* Sleep */
        .db-sleep-main { margin: 12px 0 16px; }
        .db-sleep-val { font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.5px; line-height: 1.1; }
        .db-sleep-sub { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .db-sleep-score { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .db-score-circ { width: 32px; height: 32px; border-radius: 50%; background: #6366f1; color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .db-score-text { display: flex; flex-direction: column; }
        .db-score-text strong { font-size: 12px; color: #111827; }
        .db-score-text span { font-size: 11px; color: #6b7280; }
        .db-sleep-stages { display: flex; flex-direction: column; gap: 6px; }
        .db-stages-lbl { font-size: 10px; color: #9ca3af; font-weight: 600; }
        .db-stage-bars { display: flex; align-items: flex-end; gap: 4px; height: 28px; }
        .db-sbar {
          flex: 1; background: #818cf8; border-radius: 4px 4px 0 0;
          animation: growBar 0.3s ease-out both; transform-origin: bottom;
        }
        @keyframes growBar { from { transform: scaleY(0); } to { transform: scaleY(1); } }

        /* Calories */
        .db-cal-title { display: flex; align-items: center; gap: 8px; }
        .db-card-title { font-size: 16px; font-weight: 700; color: #111827; }
        .db-card-sub { font-size: 13px; color: #6b7280; }
        .db-dot-label { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #6b7280; margin-bottom: 4px; }
        .db-dot { width: 6px; height: 6px; border-radius: 50%; }
        .db-cal-val strong { font-size: 20px; font-weight: 800; color: #111827; }
        .db-cal-val span { font-size: 11px; color: #9ca3af; font-weight: 600; }
        .db-prog-label { display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; margin-bottom: 8px; }
        .db-cal-bar { height: 10px; background: #f3f4f6; border-radius: 5px; position: relative; overflow: hidden; margin-bottom: 8px; }
        .db-cal-fill-c { position: absolute; left: 0; top: 0; bottom: 0; background: var(--primary-light); border-radius: 5px; transition: width 0.6s ease-out; }
        .db-cal-fill-b { position: absolute; top: 0; bottom: 0; background: var(--primary-bg); border-radius: 0 5px 5px 0; transition: width 0.6s ease-out 0.1s; }
        .db-prog-foot { display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; }

        /* Weekly Activity */
        .db-tabs { display: flex; background: #f3f4f6; border-radius: 20px; padding: 2px; }
        .db-tab {
          padding: 6px 12px; font-size: 11px; font-weight: 600; color: #6b7280;
          background: transparent; border: none; border-radius: 18px; cursor: pointer; transition: all 0.2s;
        }
        .db-tab.active { background: var(--primary-light); color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .db-chart-wrap { margin: 0 -10px; }

        /* Insights */
        .db-insights-head { display: flex; align-items: center; justify-content: space-between; margin: 24px 0 16px; }
        .db-link { background: none; border: none; font-size: 13px; font-weight: 600; color: var(--primary); cursor: pointer; }
        .db-insight-card {
          background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px;
          display: flex; align-items: flex-start; gap: 14px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.03);
          border-left: 4px solid transparent; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .db-insight-card:active { transform: scale(0.98); }
        .db-insight-card.green { border-left-color: var(--primary-light); }
        .db-insight-card.purple { border-left-color: #818cf8; }
        .db-insight-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .db-insight-content { flex: 1; }
        .db-insight-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .db-insight-top strong { font-size: 14px; color: #111827; }
        .db-insight-badge { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 8px; }
        .db-insight-text { font-size: 12.5px; color: #6b7280; line-height: 1.5; }
        .db-insight-text strong { color: #374151; }
      `}</style>
    </div>
  );
}

function InsightCard({ icon, title, badge, badgeColor, badgeBg, text, className }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`db-insight-card ${className}`} onClick={() => setExpanded(!expanded)}>
      <div className="db-insight-icon" style={{ background: badgeBg, color: badgeColor }}>
        {icon}
      </div>
      <div className="db-insight-content">
        <div className="db-insight-top">
          <strong>{title}</strong>
          <span className="db-insight-badge" style={{ background: badgeBg, color: badgeColor }}>{badge}</span>
        </div>
        {expanded && <p className="db-insight-text">{text}</p>}
      </div>
      <ChevronDown size={16} color="#9ca3af" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
    </div>
  );
}
