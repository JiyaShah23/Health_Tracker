import { useState, useEffect, useContext } from 'react';
import { Search, Bell, ChevronRight, Play, Clock, TrendingUp, TrendingDown, Check, Trophy, Lock } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, CartesianGrid } from 'recharts';
import { DataContext } from '../App';
import { getTodayKey, getDateKey, calcSleepHours } from '../utils/dateUtils';


/* --- SVG Icons --- */
const IconWalk = ({ color = "currentColor", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16" /><path d="M17 4v16" /><path d="M19 8H5" /></svg>
);
const IconMoon = ({ color = "currentColor", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
);
const IconLeaf = ({ color = "currentColor", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
);
const IconBrain = ({ color = "currentColor", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" /></svg>
);
const IconFlame = ({ color = "currentColor", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
);
const IconDrop = ({ color = "currentColor", size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
);

const trendData = [
  { day: 'Mon', score: 65 }, { day: 'Tue', score: 70 },
  { day: 'Wed', score: 68 }, { day: 'Thu', score: 85 },
  { day: 'Fri', score: 75 }, { day: 'Sat', score: 90 }, { day: 'Sun', score: 82 }
];

export default function Insights() {
  const { logData } = useContext(DataContext);
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Week');
  const [smartNotifs, setSmartNotifs] = useState({
    hydration: true,
    steps: true,
    sleep: false,
    meals: true,
  });

  // Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const chartDays = activeFilter === 'Week' ? 7 : activeFilter === 'Month' ? 30 : 90;

  const todayKey = getTodayKey();

  const chartData = Array.from({ length: chartDays }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (chartDays - 1 - i));
    const key = getDateKey(chartDays - 1 - i);
    const entry = logData[key] || {};
    const steps = entry.steps || 0;
    const sleep = calcSleepHours(entry.sleepStart, entry.sleepEnd) || 0;
    const cal = entry.calories || 0;

    // Calculate a realistic health score between 60 and 95
    const stepsScore = Math.min(100, (steps / 10000) * 100);
    const sleepScore = sleep > 0 ? Math.min(100, (sleep / 8) * 100) : 70;
    const calScore = cal > 0 ? Math.min(100, (cal / 2000) * 100) : 80;
    const score = Math.round(62 + (stepsScore * 0.15) + (sleepScore * 0.1) + (calScore * 0.08));

    return {
      day: d.toLocaleString('default', {
        month: 'short',
        day: 'numeric'
      }),
      Steps: steps,
      Sleep: sleep,
      Cal: cal,
      score: score
    };
  });

  const totalSteps = chartData.reduce((sum, item) => sum + item.Steps, 0);
  const avgSteps = Math.round(totalSteps / chartDays);

  const totalSleep = chartData.reduce((sum, item) => sum + item.Sleep, 0);
  const avgSleep = totalSleep / chartDays;
  const avgSleepMins = Math.round(avgSleep * 60);
  const avgSleepStr = avgSleep > 0 ? `${Math.floor(avgSleepMins / 60)}h ${avgSleepMins % 60}m` : '—';

  const totalCal = chartData.reduce((sum, item) => sum + item.Cal, 0);
  const avgCal = Math.round(totalCal / chartDays);

  useEffect(() => {
    let interval;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const Toggle = ({ on, onToggle }) => (
    <div className={`ins-toggle ${on ? 'on' : 'off'}`} onClick={onToggle}>
      <div className="ins-toggle-knob" />
    </div>
  );

  return (
    <div className="ins-page">
      {/* Header */}
      <div className={`ins-header ${mounted ? 'fade-in' : ''}`}>
        <h1 className="ins-title">Insights</h1>
        <div className="ins-header-actions">
          <button className="ins-icon-btn"><Search size={18} color="currentColor" /></button>
          <button className="ins-icon-btn">
            <Bell size={18} color="currentColor" />
            <span className="ins-bell-dot" />
          </button>
          <div className="ins-avatar" />
        </div>
      </div>

      {/* Filters Row */}
      <div className="ins-filters">
        {['Week', 'Month', '3 Months'].map(f => (
          <div
            key={f}
            className={`ins-filter-btn ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </div>
        ))}
      </div>

      <div className="ins-scroll">

        {/* --- Health Score --- */}
        <div className={`ins-card stagger-2 ${mounted ? 'active' : ''}`} style={{ background: '#f8faf8', border: 'none' }}>
          <div className="ins-card-header">
            <div>
              <h3 className="ins-card-title">Health Score</h3>
              <p className="ins-card-sub">Updated today at 9:00 AM</p>
            </div>
            <span className="ins-pill green-solid">Great</span>
          </div>

          <div className="ins-score-flex">
            <div className="ins-score-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e1ede1" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#6b9e7e" strokeWidth="10"
                  strokeLinecap="round" strokeDasharray="263.89" strokeDashoffset={263.89 * 0.16}
                  transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
              <div className="ins-score-val">
                <strong>84</strong><span>/ 100</span>
              </div>
            </div>

            <div className="ins-score-grid">
              <div className="ins-metric-pill blue">
                <IconWalk size={14} /> <div><span>Activity</span><strong>88/100</strong></div>
              </div>
              <div className="ins-metric-pill purple">
                <IconMoon size={14} /> <div><span>Sleep</span><strong>82/100</strong></div>
              </div>
              <div className="ins-metric-pill green">
                <IconLeaf size={14} /> <div><span>Diet</span><strong>78/100</strong></div>
              </div>
              <div className="ins-metric-pill pink">
                <IconBrain size={14} /> <div><span>Mind</span><strong>85/100</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Core Insights --- */}
        <div className={`ins-section-head stagger-3 ${mounted ? 'active' : ''}`}>
          <h3 className="ins-card-title">Core Insights</h3>
        </div>

        <div className={`ins-core-card blue stagger-4 ${mounted ? 'active' : ''}`}>
          <div className="ins-core-top">
            <div className="ins-core-icon blue"><IconWalk size={14} color="#3b82f6" /></div>
            <div style={{ flex: 1 }}>
              <strong className="ins-core-title">Boost Your Activity</strong>
              <p className="ins-core-sub">Today's priority</p>
            </div>
            <span className="ins-pill blue-light">Activity</span>
            <ChevronRight size={16} color="#9ca3af" />
          </div>
          <p className="ins-core-text">
            You're <strong>2,000 steps</strong> away from your goal. A 20-minute walk will get you there.
          </p>

          {timerStarted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(timeLeft)}
              </div>
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <button className="ins-btn dark" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setTimerStarted(false); setTimerRunning(false); setTimeLeft(1200); }}>Stop</button>
                <button className="ins-btn blue" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setTimerRunning(!timerRunning)}>
                  {timerRunning ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="ins-prog-label">
                <span>8,000 / 10,000 steps</span>
                <span style={{ color: '#3b82f6', fontWeight: 700 }}>80%</span>
              </div>
              <div className="ins-prog-bar"><div className="ins-prog-fill blue" style={{ width: '80%' }} /></div>
              <button className="ins-btn blue" onClick={() => { setTimerStarted(true); setTimerRunning(true); }}>
                <Play size={14} fill="currentColor" /> Start Walk
              </button>
            </>
          )}
        </div>

        <div className={`ins-core-card purple stagger-5 ${mounted ? 'active' : ''}`}>
          <div className="ins-core-top">
            <div className="ins-core-icon purple"><IconMoon size={14} color="#8b5cf6" /></div>
            <div style={{ flex: 1 }}>
              <strong className="ins-core-title">Sleep Consistency</strong>
              <p className="ins-core-sub">Bedtime pattern</p>
            </div>
            <span className="ins-pill purple-light">Sleep</span>
            <ChevronRight size={16} color="#9ca3af" />
          </div>
          <p className="ins-core-text">
            You've been going to bed <strong>30 mins later</strong> than usual. Aim for <strong>10:30 PM</strong> tonight.
          </p>
          <button className="ins-btn dark"><Clock size={14} /> Set Reminder</button>
        </div>

        {/* --- Weekly Summary --- */}
        <div className={`ins-card stagger-6 ${mounted ? 'active' : ''}`}>
          <div className="ins-card-header">
            <div>
              <h3 className="ins-card-title">Weekly Summary</h3>
              <p className="ins-card-sub">
                {(() => {
                  const start = new Date();
                  start.setDate(start.getDate() - (chartDays - 1));
                  return `${start.toLocaleString('default', { month: 'short', day: 'numeric' })} – ${new Date().toLocaleString('default', { month: 'short', day: 'numeric' })}`;
                })()}
              </p>
            </div>
            <span className="ins-pill green-light"><TrendingUp size={12} /> +12% vs last period</span>
          </div>

          <div className="ins-chart">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b9e7e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6b9e7e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={5} />
                <Area type="monotone" dataKey="score" stroke="#6b9e7e" strokeWidth={2} fill="url(#trendGrad)"
                  activeDot={{ r: 4, fill: '#6b9e7e' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="ins-stat-list">
            <div className="ins-stat-row">
              <div className="ins-stat-lbl"><IconWalk size={14} color="#3b82f6" /> Avg. Steps</div>
              <div className="ins-stat-val"><strong>{avgSteps.toLocaleString()}</strong> <span className="ins-pill green-light xs">+6%</span></div>
            </div>
            <div className="ins-stat-row">
              <div className="ins-stat-lbl"><IconMoon size={14} color="#52525b" /> Avg. Sleep</div>
              <div className="ins-stat-val"><strong>{avgSleepStr}</strong> <span className="ins-pill red-light xs">-4%</span></div>
            </div>
            <div className="ins-stat-row">
              <div className="ins-stat-lbl"><IconFlame size={14} color="#ea580c" /> Avg. Calories</div>
              <div className="ins-stat-val"><strong>{avgCal.toLocaleString()} kcal</strong> <span className="ins-pill green-light xs">+9%</span></div>
            </div>
          </div>
        </div>

        {/* --- Goal Suggestions --- */}
        <div className={`ins-section-head stagger-7 ${mounted ? 'active' : ''}`}>
          <h3 className="ins-card-title">Goal Suggestions</h3>
          <span className="ins-link">View all</span>
        </div>

        <div className={`ins-goal-scroll stagger-8 ${mounted ? 'active' : ''}`}>
          <div className="ins-goal-card">
            <div className="ins-goal-icon green"><IconDrop size={14} color="#22c55e" /></div>
            <strong className="ins-goal-title">Increase Water</strong>
            <p className="ins-goal-desc">Drink 2.5L daily for better energy.</p>
            <button className="ins-goal-btn green">+ Add Goal</button>
          </div>
          <div className="ins-goal-card">
            <div className="ins-goal-icon purple"><IconMoon size={14} color="#8b5cf6" /></div>
            <strong className="ins-goal-title">Earlier Bedtime</strong>
            <p className="ins-goal-desc">Sleep by 10:30 PM for deep rest.</p>
            <button className="ins-goal-btn purple">+ Add Goal</button>
          </div>
          <div className="ins-goal-card">
            <div className="ins-goal-icon pink"><IconBrain size={14} color="#a855f7" /></div>
            <strong className="ins-goal-title">Daily Meditation</strong>
            <p className="ins-goal-desc">10 min mindfulness each morning.</p>
            <button className="ins-goal-btn pink">+ Add Goal</button>
          </div>
        </div>

        {/* --- Streak Tracker --- */}
        <div className={`ins-card stagger-9 ${mounted ? 'active' : ''}`}>
          <div className="ins-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="ins-goal-icon orange" style={{ background: '#fff7ed', marginBottom: 0 }}><IconFlame size={14} color="#ea580c" /></div>
              <div>
                <h3 className="ins-card-title" style={{ fontSize: 14 }}>Streak Tracker</h3>
                <p className="ins-card-sub" style={{ fontSize: 11 }}>Keep your momentum!</p>
              </div>
            </div>
            <strong style={{ color: '#f97316', fontSize: 18, display: 'flex', alignItems: 'center', gap: 4 }}>5 <span style={{ fontSize: 11, color: '#111827' }}>day streak</span></strong>
          </div>

          <div className="ins-streak-days">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
              <div key={d} className="ins-sday">
                <div className={`ins-scircle ${i < 5 ? 'checked' : ''}`}>
                  {i < 5 && <Check size={14} color="white" strokeWidth={3} />}
                </div>
                <span>{d}</span>
              </div>
            ))}
          </div>

          <div className="ins-streak-msg">
            <Trophy size={14} color="#ea580c" />
            2 more days to earn your <strong>Weekly Champion</strong> badge!
          </div>
        </div>

        {/* --- Achievement Badges --- */}
        <div className={`ins-section-head stagger-10 ${mounted ? 'active' : ''}`}>
          <h3 className="ins-card-title">Achievement Badges</h3>
          <span className="ins-link" style={{ color: '#6b9e7e' }}>8 / 15 earned</span>
        </div>

        <div className={`ins-card stagger-11 ${mounted ? 'active' : ''}`}>
          <div className="ins-badge-grid">
            {[
              { l: 'First 10k', i: <IconWalk />, c: 'blue', e: true },
              { l: '5 Day Streak', i: <IconFlame />, c: 'orange', e: true },
              { l: 'Sleep Pro', i: <IconMoon />, c: 'purple', e: true },
              { l: 'Champion', i: <Trophy />, c: 'gray', e: false },
              { l: 'Heart Hero', i: <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>, c: 'gray', e: false },
              { l: 'Eat Clean', i: <IconLeaf />, c: 'green', e: true },
              { l: 'Mindful', i: <IconBrain />, c: 'pink', e: true },
              { l: 'Power Up', i: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>, c: 'gray', e: false },
              { l: 'All-Star', i: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>, c: 'gray', e: false },
              { l: 'Hydrated', i: <IconDrop />, c: 'yellow', e: true }
            ].map(b => (
              <div key={b.l} className={`ins-badge-item ${!b.e ? 'locked' : ''}`}>
                <div className={`ins-badge-circ ${b.c}`}>
                  {b.i}
                  {!b.e && <div className="ins-badge-lock"><Lock size={8} /></div>}
                </div>
                <span>{b.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- AI Prediction --- */}
        <div className={`ins-ai-card stagger-12 ${mounted ? 'active' : ''}`}>
          <div className="ins-ai-icon"><IconBrain size={16} /></div>
          <div className="ins-ai-content">
            <div className="ins-ai-top">
              <span>AI PREDICTION</span>
              <div className="ins-ai-pill">92% Confidence</div>
            </div>
            <p>At this pace, you'll reach your weight goal by <strong>Oct 12 🎯</strong></p>
          </div>
          <ChevronRight size={16} color="#9ca3af" />
        </div>

        {/* --- Smart Notifications --- */}
        <div className={`ins-card stagger-13 ${mounted ? 'active' : ''}`} style={{ marginBottom: 90 }}>
          <div className="ins-card-header" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="ins-goal-icon" style={{ background: '#f3f4f6', marginBottom: 0 }}><Bell size={14} color="#6b7280" /></div>
              <div>
                <h3 className="ins-card-title" style={{ fontSize: 14 }}>Smart Notifications</h3>
                <p className="ins-card-sub" style={{ fontSize: 11 }}>Personalized nudges based on your patterns</p>
              </div>
            </div>
          </div>

          <div className="ins-notifs">
            <div className="ins-notif-row">
              <div className="ins-notif-lbl"><IconWalk size={14} color="#3b82f6" /> Activity Reminders</div>
              <Toggle
                on={smartNotifs.steps}
                onToggle={() => setSmartNotifs(p => ({ ...p, steps: !p.steps }))}
              />
            </div>
            <div className="ins-notif-row">
              <div className="ins-notif-lbl"><IconMoon size={14} color="#8b5cf6" /> Bedtime Nudges</div>
              <Toggle
                on={smartNotifs.sleep}
                onToggle={() => setSmartNotifs(p => ({ ...p, sleep: !p.sleep }))}
              />
            </div>
            <div className="ins-notif-row">
              <div className="ins-notif-lbl"><IconDrop size={14} color="#22c55e" /> Hydration Alerts</div>
              <Toggle
                on={smartNotifs.hydration}
                onToggle={() => setSmartNotifs(p => ({ ...p, hydration: !p.hydration }))}
              />
            </div>
            <div className="ins-notif-row">
              <div className="ins-notif-lbl"><IconBrain size={14} color="#a855f7" /> Mindfulness Prompts</div>
              <Toggle
                on={smartNotifs.meals}
                onToggle={() => setSmartNotifs(p => ({ ...p, meals: !p.meals }))}
              />
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .ins-page { min-height: 100vh; background: var(--bg-surface); display: flex; flex-direction: column; font-family: 'Inter', sans-serif; overflow: hidden; }
        
        .ins-header { display: flex; align-items: center; justify-content: space-between; padding: 48px 20px 16px; background: var(--bg-card); z-index: 10; opacity: 0; transform: translateY(-10px); transition: all 0.3s; }
        .ins-header.fade-in { opacity: 1; transform: translateY(0); }
        .ins-title { font-size: 22px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.4px; }
        .ins-header-actions { display: flex; align-items: center; gap: 12px; }
        .ins-icon-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--bg-input); border: none; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; }
        .ins-bell-dot { position: absolute; top: 9px; right: 10px; width: 6px; height: 6px; background: #22c55e; border-radius: 50%; border: 1.5px solid var(--bg-input); }
        .ins-avatar { width: 36px; height: 36px; border-radius: 50%; background: url('https://i.pravatar.cc/100?img=5') center/cover; }
 
        .ins-filters { display: flex; gap: 8px; padding: 0 20px 16px; background: var(--bg-card); overflow-x: auto; border-bottom: 1px solid rgba(0,0,0,0.04); }
        .ins-filters::-webkit-scrollbar { display: none; }
        .ins-filter-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border); background: var(--bg-card); color: var(--text-secondary); white-space: nowrap; transition: all 0.2s; }
        .ins-filter-btn.active { background: #6b9e7e; border-color: #6b9e7e; color: white; }
        .ins-filter-btn.active svg { stroke: white; }
 
        .ins-scroll { flex: 1; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 16px; }
 
        [class*="stagger-"] { opacity: 0; transform: translateY(15px); }
        .stagger-1 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.05s; }
        .stagger-2 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s; }
        .stagger-3 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s; }
        .stagger-4 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s; }
        .stagger-5 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s; }
        .stagger-6 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s; }
        .stagger-7 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.35s; }
        .stagger-8 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s; }
        .stagger-9 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.45s; }
        .stagger-10 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s; }
        .stagger-11 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.55s; }
        .stagger-12 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s; }
        .stagger-13 { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.65s; }
        [class*="stagger-"].active { opacity: 1; transform: translateY(0); }
 
        .ins-card { background: var(--bg-card); border-radius: 20px; padding: 18px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.02); }
        .ins-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .ins-card-title { font-size: 15px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.2px; }
        .ins-card-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
        
        .ins-pill { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; }
        .ins-pill.green-solid { background: #dcfce7; color: #166534; }
        .ins-pill.green-light { background: #f0fdf4; color: #4a7c59; }
        .ins-pill.blue-light { background: #eff6ff; color: #3b82f6; }
        .ins-pill.purple-light { background: #f5f3ff; color: #8b5cf6; }
        .ins-pill.red-light { background: #fef2f2; color: #ef4444; }
        .ins-pill.xs { padding: 2px 6px; font-size: 10px; border-radius: 6px; }
 
        .ins-score-flex { display: flex; align-items: center; gap: 20px; }
        .ins-score-ring { position: relative; width: 90px; height: 90px; flex-shrink: 0; }
        .ins-score-val { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ins-score-val strong { font-size: 24px; font-weight: 800; color: var(--text-primary); line-height: 1; }
        .ins-score-val span { font-size: 10px; font-weight: 600; color: var(--text-muted); }
        .ins-score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; flex: 1; }
        .ins-metric-pill { display: flex; align-items: center; gap: 6px; padding: 8px; border-radius: 12px; font-size: 10px; }
        .ins-metric-pill div { display: flex; flex-direction: column; }
        .ins-metric-pill span { color: var(--text-secondary); font-weight: 600; font-size: 9px; }
        .ins-metric-pill strong { font-size: 11px; font-weight: 800; }
        .ins-metric-pill.blue { background: #eff6ff; color: #3b82f6; }
        .ins-metric-pill.purple { background: #f5f3ff; color: #8b5cf6; }
        .ins-metric-pill.green { background: #f0fdf4; color: #22c55e; }
        .ins-metric-pill.pink { background: #fdf4ff; color: #a855f7; }
 
        .ins-section-head { display: flex; justify-content: space-between; align-items: center; margin: 8px 0 0; }
        .ins-link { font-size: 11px; font-weight: 700; color: #6b9e7e; cursor: pointer; }
 
        .ins-core-card { background: var(--bg-card); border-radius: 16px; padding: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); border-top: 3px solid transparent; }
        .ins-core-card.blue { border-top-color: #3b82f6; }
        .ins-core-card.purple { border-top-color: #8b5cf6; }
        .ins-core-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .ins-core-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .ins-core-icon.blue { background: #eff6ff; }
        .ins-core-icon.purple { background: #f5f3ff; }
        .ins-core-title { font-size: 13px; font-weight: 800; color: var(--text-primary); }
        .ins-core-sub { font-size: 10px; color: var(--text-secondary); font-weight: 500; }
        .ins-core-text { font-size: 12px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px; }
        .ins-core-text strong { color: var(--text-primary); }
        .ins-prog-label { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); font-weight: 600; margin-bottom: 6px; }
        .ins-prog-bar { height: 4px; background: var(--bg-input); border-radius: 2px; overflow: hidden; margin-bottom: 16px; }
        .ins-prog-fill.blue { height: 100%; background: #3b82f6; border-radius: 2px; }
        .ins-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; }
        .ins-btn.blue { background: #3b82f6; color: white; }
        .ins-btn.dark { background: var(--text-secondary); color: white; }
 
        .ins-chart { margin-bottom: 16px; }
        .ins-stat-list { display: flex; flex-direction: column; gap: 12px; }
        .ins-stat-row { display: flex; justify-content: space-between; align-items: center; }
        .ins-stat-lbl { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-primary); font-weight: 600; }
        .ins-stat-val { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-primary); }
 
        .ins-goal-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; margin: 0 -20px; padding: 0 20px 8px; }
        .ins-goal-scroll::-webkit-scrollbar { display: none; }
        .ins-goal-card { min-width: 140px; background: var(--bg-card); border-radius: 16px; padding: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); flex-shrink: 0; }
        .ins-goal-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
        .ins-goal-icon.green { background: #f0fdf4; }
        .ins-goal-icon.purple { background: #f5f3ff; }
        .ins-goal-icon.pink { background: #fdf4ff; }
        .ins-goal-title { display: block; font-size: 12px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; }
        .ins-goal-desc { font-size: 10px; color: var(--text-secondary); line-height: 1.4; margin-bottom: 12px; }
        .ins-goal-btn { padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; border: none; cursor: pointer; width: auto; }
        .ins-goal-btn.green { background: #f0fdf4; color: #22c55e; }
        .ins-goal-btn.purple { background: #f5f3ff; color: #8b5cf6; }
        .ins-goal-btn.pink { background: #fdf4ff; color: #a855f7; }
 
        .ins-streak-days { display: flex; justify-content: space-between; margin-bottom: 16px; }
        .ins-sday { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .ins-scircle { width: 26px; height: 26px; border-radius: 50%; background: var(--bg-input); display: flex; align-items: center; justify-content: center; }
        .ins-scircle.checked { background: #6b9e7e; }
        .ins-sday span { font-size: 10px; font-weight: 600; color: var(--text-secondary); }
        .ins-streak-msg { display: flex; align-items: center; gap: 8px; background: #fff7ed; padding: 10px 12px; border-radius: 12px; font-size: 11px; color: #ea580c; }
        .ins-streak-msg strong { font-weight: 800; }
 
        .ins-badge-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px 8px; }
        .ins-badge-item { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
        .ins-badge-item.locked { opacity: 0.5; filter: grayscale(1); }
        .ins-badge-circ { position: relative; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 -2px 6px rgba(0,0,0,0.05); }
        .ins-badge-circ.blue { background: #eff6ff; color: #3b82f6; }
        .ins-badge-circ.orange { background: #fff7ed; color: #f97316; }
        .ins-badge-circ.purple { background: #f5f3ff; color: #8b5cf6; }
        .ins-badge-circ.gray { background: #f3f4f6; color: #9ca3af; }
        .ins-badge-circ.green { background: #f0fdf4; color: #22c55e; }
        .ins-badge-circ.pink { background: #fdf4ff; color: #a855f7; }
        .ins-badge-circ.yellow { background: #fefce8; color: #eab308; }
        .ins-badge-lock { position: absolute; bottom: 0; right: 0; width: 14px; height: 14px; background: var(--bg-card); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #9ca3af; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .ins-badge-item span { font-size: 9px; font-weight: 700; color: var(--text-secondary); line-height: 1.1; }
 
        .ins-ai-card { background: #334155; border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 12px; color: white; box-shadow: 0 8px 20px rgba(51,65,85,0.3); }
        .ins-ai-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ins-ai-content { flex: 1; }
        .ins-ai-top { display: flex; align-items: center; gap: 8px; font-size: 9px; font-weight: 800; letter-spacing: 0.05em; color: #cbd5e1; margin-bottom: 4px; }
        .ins-ai-pill { background: rgba(255,255,255,0.15); padding: 2px 6px; border-radius: 8px; color: white; }
        .ins-ai-content p { font-size: 12px; line-height: 1.4; color: #e2e8f0; }
        .ins-ai-content strong { color: white; }
 
        .ins-notifs { display: flex; flex-direction: column; gap: 16px; }
        .ins-notif-row { display: flex; justify-content: space-between; align-items: center; }
        .ins-notif-lbl { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--text-primary); }
        .ins-toggle { width: 36px; height: 20px; border-radius: 10px; position: relative; transition: background 0.2s; cursor: pointer; }
        .ins-toggle.on { background: #6b9e7e; }
        .ins-toggle.off { background: #e5e7eb; }
        .ins-toggle-knob { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .ins-toggle.on .ins-toggle-knob { transform: translateX(16px); }
      `}</style>
    </div>
  );
}
