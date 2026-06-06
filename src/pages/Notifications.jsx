import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Play, Clock, Flame, Droplets, Moon, BellOff, MapPin, Zap, Pause, X } from 'lucide-react';
import { DataContext } from '../App';
import { getTodayKey } from '../utils/dateUtils';


export default function Notifications() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { logData } = useContext(DataContext);

  const todayKey = getTodayKey();
  const entry = logData[todayKey] || {};

  const generateNotifs = () => {
    const notifs = [];
    let id = 1;

    // Hydration alert
    const water = entry.water || 0;
    if (water < 2500) {
      notifs.push({
        id: id++,
        type: water < 500 ? 'important' : 'action',
        pinned: water < 500,
        title: water === 0 ? 'No water logged yet!' : 'Hydration is low',
        text: water === 0
          ? 'You haven\'t logged any water today. Start with a glass now!'
          : `You've had ${(water / 1000).toFixed(1)}L today. Aim for 2.5L to stay energized.`,
        icon: <Droplets size={16} />,
        color: '#3b82f6',
        bg: '#eff6ff',
        actionText: 'Log Water',
        actionType: 'done',
        time: 'Now',
      });
    }

    // Steps alert
    const steps = entry.steps || 0;
    if (steps < 10000) {
      notifs.push({
        id: id++,
        type: 'action',
        title: steps === 0 ? 'No steps logged yet!' : 'Keep Moving!',
        text: steps === 0
          ? 'Log your steps for today to track your activity.'
          : `You're ${(10000 - steps).toLocaleString()} steps away from your 10,000 goal!`,
        icon: <Flame size={16} />,
        color: '#ea580c',
        bg: '#fff7ed',
        actionText: 'Start Walk',
        actionType: 'start',
        time: 'Today',
      });
    }

    // Sleep reminder
    const hour = new Date().getHours();
    if (!entry.sleepStart && hour >= 21) {
      notifs.push({
        id: id++,
        type: 'reminder',
        title: 'Time to Wind Down',
        text: 'It\'s getting late. Start your sleep routine for a better tomorrow.',
        icon: <Moon size={16} />,
        color: '#8b5cf6',
        bg: '#f5f3ff',
        time: 'Tonight',
      });
    }

    // Sleep logged — give feedback
    if (entry.sleepStart && entry.sleepEnd) {
      const [sh, sm] = entry.sleepStart.split(':').map(Number);
      const [eh, em] = entry.sleepEnd.split(':').map(Number);
      const diff = (eh * 60 + em) < (sh * 60 + sm)
        ? (1440 - sh * 60 - sm + eh * 60 + em)
        : (eh * 60 + em - sh * 60 - sm);
      const hrs = diff / 60;
      if (hrs < 7) {
        notifs.push({
          id: id++,
          type: 'adaptive',
          title: 'Low Sleep Detected',
          text: `You only slept ${hrs.toFixed(1)} hours. Consider a short nap or early bedtime tonight.`,
          icon: <Moon size={16} />,
          color: '#8b5cf6',
          bg: '#f5f3ff',
          time: 'Last night',
        });
      }
    }

    // Calories alert
    const calories = entry.calories || 0;
    if (calories === 0 && new Date().getHours() >= 12) {
      notifs.push({
        id: id++,
        type: 'reminder',
        title: 'Log Your Meals',
        text: 'You haven\'t logged any calories today. Track your nutrition for better insights.',
        icon: <Zap size={16} />,
        color: '#16a34a',
        bg: '#f0fdf4',
        time: 'Today',
      });
    }

    // All good message
    if (notifs.length === 0) {
      notifs.push({
        id: id++,
        type: 'adaptive',
        title: 'You\'re crushing it! 🎉',
        text: 'All your health metrics look great today. Keep up the amazing work!',
        icon: <Zap size={16} />,
        color: '#16a34a',
        bg: '#f0fdf4',
        time: 'Now',
      });
    }

    return notifs;
  };

  const [notifs, setNotifs] = useState(() => generateNotifs());

  useEffect(() => {
    setNotifs(generateNotifs());
  }, [logData]);

  useEffect(() => { setMounted(true); }, []);

  // Timer Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifs(prev => prev.map(n => {
        if (n.isTimerActive && n.isTimerRunning && n.timeLeft > 0) {
          return { ...n, timeLeft: n.timeLeft - 1 };
        }
        return n;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (id, type) => {
    if (type === 'snooze') {
      const snoozedNotif = notifs.find(n => n.id === id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, exiting: true } : n));
      setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== id)), 300);

      // Simulate 10-minute snooze by returning it after a short demo delay (10s)
      setTimeout(() => {
        setNotifs(prev => [{ ...snoozedNotif, exiting: false, time: 'Just now', id: Date.now() }, ...prev]);
      }, 10000);
      return;
    }

    if (type === 'start') {
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isTimerActive: true, isTimerRunning: true, timeLeft: 1200 } : n));
      return;
    }

    // Default done/dismiss
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, exiting: true } : n));
    setTimeout(() => {
      setNotifs(prev => prev.filter(n => n.id !== id));
    }, 300);
  };

  const handleTimerAction = (id, action) => {
    if (action === 'toggle') {
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isTimerRunning: !n.isTimerRunning } : n));
    } else if (action === 'stop') {
      handleAction(id, 'done');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleClearAll = () => {
    setNotifs(prev => prev.map(n => ({ ...n, exiting: true })));
    setTimeout(() => setNotifs([]), 300);
  };

  const important = notifs.filter(n => n.type === 'important' || n.pinned);
  const actionable = notifs.filter(n => n.type === 'action');
  const reminders = notifs.filter(n => n.type === 'reminder' || n.type === 'adaptive');

  return (
    <div className="notif-page">
      {/* Header */}
      <div className={`notif-header ${mounted ? 'fade-in' : ''}`}>
        <button className="notif-back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <ArrowLeft size={18} strokeWidth={2.5} color="#111827" />
        </button>
        <h1 className="notif-title">Notifications</h1>
        <button className="notif-clear-btn" onClick={handleClearAll} disabled={notifs.length === 0}>
          Clear All
        </button>
      </div>

      <div className="notif-scroll">
        {notifs.length === 0 ? (
          <div className="notif-empty stagger-1">
            <div className="notif-empty-icon"><BellOff size={24} color="#9ca3af" /></div>
            <h3>All caught up!</h3>
            <p>You have no new notifications.</p>
          </div>
        ) : (
          <>
            {/* Important Alerts */}
            {important.length > 0 && (
              <div className="notif-section stagger-1">
                <h2 className="notif-sec-title">Important</h2>
                <div className="notif-list">
                  {important.map(n => (
                    <div key={n.id} className={`notif-card imp ${n.exiting ? 'exiting' : ''}`}>
                      {n.pinned && <div className="notif-pin"><MapPin size={10} fill="currentColor" /></div>}
                      <div className="notif-icon-wrap" style={{ background: n.bg, color: n.color }}>{n.icon}</div>
                      <div className="notif-content">
                        <strong>{n.title}</strong>
                        <p>{n.text}</p>
                        <span className="notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Cards */}
            {actionable.length > 0 && (
              <div className="notif-section stagger-2">
                <h2 className="notif-sec-title">Needs Action</h2>
                <div className="notif-list">
                  {actionable.map(n => (
                    <div key={n.id} className={`notif-card action-card ${n.exiting ? 'exiting' : ''}`}>
                      {n.isTimerActive ? (
                        <div className="notif-timer-view">
                          <div className="timer-display">
                            <Flame size={20} color="#ea580c" />
                            <strong>{formatTime(n.timeLeft)}</strong>
                          </div>
                          <div className="timer-controls">
                            <button className="btn-snooze" onClick={() => handleTimerAction(n.id, 'stop')}>
                              <X size={12} /> Stop
                            </button>
                            <button className="btn-primary start" onClick={() => handleTimerAction(n.id, 'toggle')}>
                              {n.isTimerRunning ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                              {n.isTimerRunning ? 'Pause' : 'Resume'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="notif-top">
                            <div className="notif-icon-wrap" style={{ background: n.bg, color: n.color }}>{n.icon}</div>
                            <div className="notif-content">
                              <strong>{n.title}</strong>
                              <p>{n.text}</p>
                              <span className="notif-time">{n.time}</span>
                            </div>
                          </div>
                          <div className="notif-actions">
                            <button className="btn-snooze" onClick={() => handleAction(n.id, 'snooze')}>
                              <Clock size={12} /> Snooze
                            </button>
                            <button className={`btn-primary ${n.actionType}`} onClick={() => handleAction(n.id, n.actionType)}>
                              {n.actionType === 'start' ? <Play size={12} fill="currentColor" /> : <Check size={12} strokeWidth={3} />}
                              {n.actionText}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reminders & Adaptive */}
            {reminders.length > 0 && (
              <div className="notif-section stagger-3">
                <h2 className="notif-sec-title">Reminders</h2>
                <div className="notif-list">
                  {reminders.map(n => (
                    <div key={n.id} className={`notif-card rem ${n.exiting ? 'exiting' : ''}`}>
                      <div className="notif-icon-wrap" style={{ background: n.bg, color: n.color }}>{n.icon}</div>
                      <div className="notif-content">
                        <strong>{n.title}</strong>
                        <p>{n.text}</p>
                        <span className="notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .notif-page {
          min-height: 100vh; background: #f9fbf9; display: flex; flex-direction: column;
          font-family: 'Inter', sans-serif; overflow: hidden;
        }
        .notif-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 48px 20px 16px; background: white; z-index: 10;
          opacity: 0; transform: translateY(-10px); transition: all 0.3s;
          border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .notif-header.fade-in { opacity: 1; transform: translateY(0); }
        .notif-back-btn {
          width: 36px; height: 36px; border-radius: 12px; background: #f3f4f6;
          border: none; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform 0.2s;
        }
        .notif-back-btn:active { transform: scale(0.95); }
        .notif-title { font-size: 18px; font-weight: 800; color: #1a2e1a; }
        .notif-clear-btn {
          background: none; border: none; font-size: 13px; font-weight: 700;
          color: #ef4444; cursor: pointer; padding: 6px 12px; border-radius: 12px;
        }
        .notif-clear-btn:disabled { color: #d1d5db; cursor: not-allowed; }

        .notif-scroll { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px; }

        [class*="stagger-"] { opacity: 0; transform: translateY(15px); animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .stagger-1 { animation-delay: 0.05s; }
        .stagger-2 { animation-delay: 0.15s; }
        .stagger-3 { animation-delay: 0.25s; }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

        .notif-sec-title { font-size: 13px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; margin-left: 4px; }
        .notif-list { display: flex; flex-direction: column; gap: 12px; }

        .notif-card {
          background: white; border-radius: 16px; padding: 14px;
          display: flex; gap: 14px; box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          position: relative; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          border: 1px solid transparent;
        }
        .notif-card.exiting { opacity: 0; transform: translateX(20px) scale(0.95); pointer-events: none; }
        
        .notif-card.imp { border: 1px solid #eef2ff; box-shadow: 0 4px 16px rgba(59, 130, 246, 0.05); }
        .notif-pin { position: absolute; top: -6px; right: -6px; width: 22px; height: 22px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; }

        .notif-icon-wrap { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .notif-content { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .notif-content strong { font-size: 14px; font-weight: 700; color: #111827; line-height: 1.2; }
        .notif-content p { font-size: 12.5px; color: #4b5563; line-height: 1.4; }
        .notif-time { font-size: 10px; font-weight: 600; color: #9ca3af; margin-top: 2px; }

        .notif-card.action-card { flex-direction: column; gap: 14px; padding: 16px; }
        .notif-top { display: flex; gap: 14px; }
        .notif-actions { display: flex; gap: 10px; padding-left: 52px; }
        .btn-snooze { flex: 1; padding: 8px 12px; background: #f3f4f6; border: none; border-radius: 12px; font-size: 12px; font-weight: 600; color: #4b5563; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; transition: background 0.2s; }
        .btn-snooze:hover { background: #e5e7eb; }
        .btn-primary { flex: 1; padding: 8px 12px; border: none; border-radius: 12px; font-size: 12px; font-weight: 700; color: white; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; transition: transform 0.2s; }
        .btn-primary:active { transform: scale(0.96); }
        .btn-primary.start { background: #ea580c; }
        .btn-primary.done { background: #3b82f6; }

        .notif-timer-view { display: flex; flex-direction: column; gap: 16px; align-items: center; padding: 12px 0; }
        .timer-display { display: flex; align-items: center; gap: 12px; }
        .timer-display strong { font-size: 36px; font-variant-numeric: tabular-nums; font-weight: 800; color: #111827; }
        .timer-controls { display: flex; gap: 10px; width: 100%; }

        .notif-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; }
        .notif-empty-icon { width: 64px; height: 64px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .notif-empty h3 { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 6px; }
        .notif-empty p { font-size: 13px; color: #6b7280; }
      `}</style>
    </div>
  );
}
