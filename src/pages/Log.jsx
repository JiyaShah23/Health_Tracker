import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../App';
import { X, Calendar, ChevronDown, Flame, Droplets, Camera } from 'lucide-react';

/* --- SVG Icons --- */
const IconCog = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
);
const IconBed = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
);
const IconPlane = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.6 4.3-3.6 3.6-3.8-.9c-.4-.1-.8.2-1 .6l-.8 2.4 5.3 1.8 1.8 5.3 2.4-.8c.4-.2.7-.6.6-1l-.9-3.8 3.6-3.6 4.3 7.6 3.6-1.2c.5-.2.8-.6.7-1.1z"/></svg>
);
const IconWalk = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 8H5"/></svg>
);
const IconMoon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);
const IconHeart = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

export default function LogData() {
  const navigate = useNavigate();
  const { logData, setLogData } = useContext(DataContext);
  const [mounted, setMounted] = useState(false);
  
  const todayKey = new Date().toISOString().split('T')[0];
  const currentData = logData[todayKey] || {};

  // States for sliders & interactives
  const [steps, setSteps] = useState(currentData.steps || 8432);
  const [mood, setMood] = useState(currentData.mood || 'Good');
  const [water, setWater] = useState(currentData.water || 1200);
  const [sleepStart, setSleepStart] = useState(currentData.sleepStart || '23:00');
  const [sleepEnd, setSleepEnd] = useState(currentData.sleepEnd || '06:15');
  const [calories, setCalories] = useState(currentData.calories || 1840);
  const [weight, setWeight] = useState(currentData.weight || 72.4);
  const [weightUnit, setWeightUnit] = useState(currentData.weightUnit || 'kg');
  const [heartRate, setHeartRate] = useState(currentData.heartRate || 72);
  const [systolic, setSystolic] = useState(currentData.systolic || 118);
  const [diastolic, setDiastolic] = useState(currentData.diastolic || 76);
  const [meals, setMeals] = useState(currentData.meals || { breakfast: false, lunch: false, dinner: false, snack: false });
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStepSlider = (e) => setSteps(Number(e.target.value));
  const stepPercent = (steps / 25000) * 100;

  return (
    <div className="log-page">
      {/* Sticky Header */}
      <div className={`log-header ${mounted ? 'fade-in' : ''}`}>
        <button className="log-close-btn" onClick={() => navigate(-1)} aria-label="Close">
          <X size={18} strokeWidth={2.5} color="#111827" />
        </button>
        <h1 className="log-title">Add Data</h1>
        <button className="log-save-btn" onClick={() => {
          setLogData(prev => ({
            ...prev,
            [todayKey]: {
              ...prev[todayKey],
              steps,
              mood,
              water,
              sleepStart,
              sleepEnd,
              calories,
              weight,
              weightUnit,
              heartRate,
              systolic,
              diastolic,
              meals,
            }
          }));
          navigate(-1);
        }}>Save</button>
      </div>

      <div className="log-scroll">
        <h2 className={`log-main-heading stagger-1 ${mounted ? 'active' : ''}`}>Record your day</h2>
        
        {/* Date Selector Row */}
        <div className={`log-date-wrap stagger-2 ${mounted ? 'active' : ''}`}>
          <div className="log-date-pill">
            <div className="log-date-icon"><Calendar size={14} color="white" /></div>
            <span className="log-date-text">Today, 10:30 AM</span>
            <ChevronDown size={14} color="#6b7280" />
          </div>
        </div>

        {/* Day Types */}
        <div className={`log-types-row stagger-2 ${mounted ? 'active' : ''}`}>
          <button className="log-type-btn active"><IconCog /> Typical Day</button>
          <button className="log-type-btn"><IconBed /> Rest Day</button>
          <button className="log-type-btn"><IconPlane /> Travel Day</button>
        </div>

        {/* --- Card 1: Steps --- */}
        <div className={`log-card stagger-3 ${mounted ? 'active' : ''}`}>
          <div className="log-card-header">
            <div className="log-card-title">
              <div className="log-card-icon" style={{background: '#f0fdf4', color: '#4a7c59'}}><IconWalk /></div>
              <h3>Steps</h3>
            </div>
            <div className="log-card-val">
              <strong>{steps.toLocaleString()}</strong> <span>/ 25k</span>
            </div>
          </div>
          
          {/* Custom Slider with animation class */}
          <div className="log-slider-container">
            <div className="log-slider-track">
              <div className="log-slider-fill" style={{ width: stepPercent + '%' }} />
            </div>
            <input 
              type="range" min="0" max="25000" step="100" value={steps} onChange={handleStepSlider}
              className="log-slider-input"
            />
          </div>
          
          <div className="log-slider-labels">
            <span>0</span><span>5k</span><span>10k</span><span>15k</span><span>20k</span><span>25k</span>
          </div>

          <div className="log-steps-footer">
            <div className="log-pills">
              <button className="log-pill" onClick={() => setSteps(5000)}>5k</button>
              <button className="log-pill active" onClick={() => setSteps(10000)}>10k</button>
              <button className="log-pill" onClick={() => setSteps(15000)}>15k</button>
            </div>
            <div className="log-streak">
              <Flame size={12} fill="#6b9e7e" color="#6b9e7e" /> 5 day streak
            </div>
          </div>
        </div>

        {/* --- Card 2: Sleep --- */}
        <div className={`log-card stagger-4 ${mounted ? 'active' : ''}`}>
          <div className="log-card-header">
            <div className="log-card-title">
              <div className="log-card-icon" style={{background: '#f5f3ff', color: '#6366f1'}}><IconMoon /></div>
              <h3>Sleep</h3>
            </div>
            <div className="log-card-val"><strong>7h 15m</strong></div>
          </div>
          
          <div className="log-sleep-visual">
            <div className="log-sleep-labels-top">
              <div style={{textAlign: 'left'}}>
                <span className="log-sl-sm">Bedtime</span>
                <span className="log-sl-lg">11:00 PM</span>
              </div>
              <div style={{textAlign: 'center', color: '#6366f1', fontSize: 11, fontWeight: 600, marginTop: 10}}>
                <div className="log-sl-dot"/> 7h 15m sleep
              </div>
              <div style={{textAlign: 'right'}}>
                <span className="log-sl-sm">Wake up</span>
                <span className="log-sl-lg">6:15 AM</span>
              </div>
            </div>
            
            {/* Visual double slider */}
            <div className="log-sleep-track">
              <div className="log-sleep-fill" style={{left: '25%', right: '22%'}} />
              <div className="log-sleep-handle" style={{left: '25%'}} />
              <div className="log-sleep-handle" style={{right: '22%'}} />
            </div>
            
            <div className="log-slider-labels sleep">
              <span>8 PM</span><span>10 PM</span><span>12 AM</span><span>2 AM</span><span>4 AM</span><span>8 AM</span>
            </div>
          </div>

          <div className="log-pills" style={{marginTop: 16}}>
            <button className="log-pill sleep-active"><div className="log-sl-dot" style={{background:'#6366f1'}}/> Light 2h</button>
            <button className="log-pill sleep-active" style={{background: '#e0e7ff'}}><div className="log-sl-dot" style={{background:'#4338ca'}}/> Deep 2h</button>
            <button className="log-pill sleep-active"><div className="log-sl-dot" style={{background:'#818cf8'}}/> REM 3h</button>
          </div>
        </div>

        {/* --- Card 3: Water --- */}
        <div className={`log-card stagger-5 ${mounted ? 'active' : ''}`}>
          <div className="log-card-header">
            <div className="log-card-title">
              <div className="log-card-icon" style={{background: '#eff6ff', color: '#3b82f6'}}><Droplets size={14} /></div>
              <h3>Water</h3>
            </div>
            <div className="log-card-sub" style={{fontSize: 11, color: '#9ca3af'}}>Daily goal</div>
          </div>
          
          <div className="log-water-content">
            <div className="log-water-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#eff6ff" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="12"
                  strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 * 0.52}
                  transform="rotate(-90 50 50)" style={{transition: 'stroke-dashoffset 1s ease'}} />
              </svg>
              <div className="log-water-val">
                <strong>{(water / 1000).toFixed(1)}L</strong>
                <span>/ 2.5L</span>
              </div>
            </div>
            
            <div className="log-water-info">
              <div className="log-water-prog-text">48% of goal reached</div>
              <div className="log-water-bar-track">
                <div className="log-water-bar-fill" style={{width: '48%'}} />
              </div>
              <div className="log-water-add">Quick add</div>
              <div className="log-water-btns">
                <button className="log-water-btn" onClick={() => setWater(w => w+250)}>+ 250ml</button>
                <button className="log-water-btn active" onClick={() => setWater(w => w+500)}>+ 500ml</button>
                <button className="log-water-btn" onClick={() => setWater(w => w+1000)}>+ 1L</button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Card 4: Mood --- */}
        <div className={`log-card stagger-6 ${mounted ? 'active' : ''}`}>
          <div className="log-card-header">
            <div className="log-card-title">
              <div className="log-card-icon" style={{background: '#fef3c7', color: '#f59e0b', width: 20, height: 20, fontSize: 12}}>🙂</div>
              <h3 style={{fontSize: 14}}>How are you feeling?</h3>
            </div>
          </div>
          
          <div className="log-mood-emojis">
            {[
              {emoji: '🤩', label: 'Great'}, {emoji: '😊', label: 'Good'}, 
              {emoji: '😐', label: 'Okay'}, {emoji: '🙁', label: 'Bad'}, {emoji: '😞', label: 'Awful'}
            ].map(m => (
              <div key={m.label} className={`log-mood-item ${mood === m.label ? 'active' : ''}`} onClick={() => setMood(m.label)}>
                <div className="log-mood-emoji">{m.emoji}</div>
                <span className="log-mood-lbl">{m.label}</span>
              </div>
            ))}
          </div>
          
          <div className="log-mood-input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <input type="text" placeholder="Add a note about your mood..." />
          </div>
        </div>

        {/* --- Row 5: Weight & Calories --- */}
        <div className={`log-grid-2 stagger-7 ${mounted ? 'active' : ''}`}>
          {/* Weight */}
          <div className="log-card">
            <div className="log-card-header" style={{marginBottom: 12}}>
              <h3 style={{fontSize: 13}}>Weight</h3>
              <div className="log-card-icon sm" style={{background: '#f0fdf4', color: '#4a7c59'}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(parseFloat(e.target.value))}
                style={{
                  width: 60, border: 'none', borderBottom: '1.5px solid #e5e7eb',
                  fontSize: 28, fontWeight: 800, color: '#111827',
                  background: 'transparent', outline: 'none', fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
            <div className="log-toggle-wrap">
              <button
                className={`log-toggle-btn ${weightUnit === 'kg' ? 'active' : ''}`}
                onClick={() => setWeightUnit('kg')}
              >kg</button>
              <button
                className={`log-toggle-btn ${weightUnit === 'lb' ? 'active' : ''}`}
                onClick={() => setWeightUnit('lb')}
              >lb</button>
            </div>
          </div>
          
          {/* Calories */}
          <div className="log-card">
            <div className="log-card-header" style={{marginBottom: 12}}>
              <h3 style={{fontSize: 13}}>Calories</h3>
              <div className="log-card-icon sm" style={{background: '#fff7ed', color: '#ea580c'}}>
                <Flame size={10} fill="#ea580c" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <input
                type="number"
                value={calories}
                onChange={e => setCalories(Number(e.target.value))}
                style={{
                  width: 80, border: 'none', borderBottom: '1.5px solid #e5e7eb',
                  fontSize: 28, fontWeight: 800, color: '#111827',
                  background: 'transparent', outline: 'none', fontFamily: 'Inter, sans-serif'
                }}
              />
              <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>kcal</span>
            </div>
            <div className="log-metric-sub">
              <div className="log-sl-dot" style={{background: '#f97316'}}/> kcal today
            </div>
          </div>
        </div>

        {/* --- Row 6: Log Meals --- */}
        <div className={`log-card stagger-8 ${mounted ? 'active' : ''}`}>
          <div className="log-card-header" style={{marginBottom: 16}}>
            <div className="log-card-title">
              <div className="log-card-icon" style={{background: '#fff7ed', color: '#f97316'}}><Flame size={14} fill="#f97316"/></div>
              <h3>Log Meals</h3>
            </div>
            <div className="log-card-sub" style={{fontSize: 11, color: '#4a7c59'}}>
              {Object.values(meals).filter(Boolean).length} logged
            </div>
          </div>
          <div className="log-meals-grid">
            {[
              {key: 'breakfast', l: 'Breakfast', e: '🍳', bg: '#fefce8', c: '#eab308'},
              {key: 'lunch',     l: 'Lunch',     e: '🥗', bg: '#f0fdf4', c: '#22c55e'},
              {key: 'dinner',    l: 'Dinner',    e: '🍗', bg: '#fef2f2', c: '#ef4444'},
              {key: 'snack',     l: 'Snack',     e: '🍎', bg: '#fdf4ff', c: '#a855f7'},
            ].map(m => (
              <div key={m.key} className="log-meal-btn"
                onClick={() => setMeals(prev => ({ ...prev, [m.key]: !prev[m.key] }))}>
                <div className="log-meal-icon" style={{ background: m.bg }}>{m.e}</div>
                <span className="log-meal-lbl">{m.l}</span>
                <div className="log-meal-dot" style={{ background: meals[m.key] ? m.c : 'transparent' }} />
              </div>
            ))}
          </div>
        </div>

        {/* --- Row 7: HR & BP --- */}
        <div className={`log-grid-2 stagger-9 ${mounted ? 'active' : ''}`}>
          <div className="log-card">
            <div className="log-card-header" style={{marginBottom: 12}}>
              <h3 style={{fontSize: 12}}>Heart Rate</h3>
              <div className="log-card-icon sm" style={{background: '#fff1f2', color: '#e11d48'}}><IconHeart /></div>
            </div>
            <div className="log-metric-val sm"><strong>72</strong><span>BPM</span></div>
            <div className="log-metric-sub"><div className="log-sl-dot" style={{background: '#22c55e'}}/> Normal range</div>
            <div className="log-mini-chart">
              {[3,5,8,4,2, 4,7,9,5,3].map((h, i) => <div key={i} className="log-bar red" style={{height: h*3}}/>)}
            </div>
          </div>
          
          <div className="log-card">
            <div className="log-card-header" style={{marginBottom: 12}}>
              <h3 style={{fontSize: 12}}>Blood Pressure</h3>
              <div className="log-card-icon sm" style={{background: '#f5f3ff', color: '#8b5cf6'}}><Droplets size={10}/></div>
            </div>
            <div className="log-metric-val sm"><strong>118</strong><span style={{fontSize:14,color:'#111827'}}>/76</span></div>
            <div className="log-metric-sub"><div className="log-sl-dot" style={{background: '#22c55e'}}/> mmHg · Normal</div>
            <div className="log-mini-chart bp">
              <div><span className="lbl">SYS</span><div className="bar"><div className="fill" style={{width: '60%'}}/></div></div>
              <div><span className="lbl">DIA</span><div className="bar"><div className="fill" style={{width: '40%', background: '#c4b5fd'}}/></div></div>
            </div>
          </div>
        </div>

        <div style={{height: 40}} />
      </div>

      <style>{`
        .log-page {
          min-height: 100vh; background: #f9fbf9; display: flex; flex-direction: column;
          font-family: 'Inter', sans-serif; overflow: hidden;
        }
        /* Sticky Header */
        .log-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 48px 20px 16px; background: white; z-index: 10;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          opacity: 0; transform: translateY(-10px); transition: all 0.3s;
        }
        .log-header.fade-in { opacity: 1; transform: translateY(0); }
        .log-close-btn { width: 32px; height: 32px; border-radius: 50%; background: #f3f4f6; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .log-title { font-size: 16px; font-weight: 800; color: #111827; }
        .log-save-btn { background: none; border: none; font-size: 14px; font-weight: 700; color: #4a7c59; cursor: pointer; }

        /* Scroll Area */
        .log-scroll { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 14px; }
        .log-main-heading { font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.4px; margin-bottom: 4px; text-align: center; }

        /* Stagger Transitions */
        .stagger-1 { opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.05s; }
        .stagger-2 { opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s; }
        .stagger-3 { opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s; }
        .stagger-4 { opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s; }
        .stagger-5 { opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s; }
        .stagger-6 { opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s; }
        .stagger-7 { opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.35s; }
        .stagger-8 { opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s; }
        .stagger-9 { opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) 0.45s; }
        .stagger-1.active, .stagger-2.active, .stagger-3.active, .stagger-4.active, .stagger-5.active, .stagger-6.active, .stagger-7.active, .stagger-8.active, .stagger-9.active {
          opacity: 1; transform: translateY(0);
        }

        /* Top elements */
        .log-date-wrap { display: flex; justify-content: center; }
        .log-date-pill { display: inline-flex; align-items: center; gap: 8px; background: #f3f4f6; border-radius: 20px; padding: 6px 12px; }
        .log-date-icon { width: 22px; height: 22px; background: #6b9e7e; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .log-date-text { font-size: 13px; font-weight: 700; color: #111827; }
        
        .log-types-row { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .log-type-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1.5px solid #e5e7eb; background: white; color: #6b7280; }
        .log-type-btn.active { background: #6b9e7e; border-color: #6b9e7e; color: white; box-shadow: 0 4px 10px rgba(107,158,126,0.25); }

        /* Cards */
        .log-card { background: white; border-radius: 20px; padding: 18px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.02); }
        .log-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
        .log-card-title { display: flex; align-items: center; gap: 8px; }
        .log-card-icon { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .log-card-icon.sm { width: 20px; height: 20px; }
        .log-card-title h3 { font-size: 15px; font-weight: 800; color: #111827; letter-spacing: -0.2px; }
        .log-card-val strong { font-size: 22px; font-weight: 800; color: #111827; }
        .log-card-val span { font-size: 12px; color: #9ca3af; font-weight: 600; }

        /* Custom Slider (Steps) */
        .log-slider-container { position: relative; height: 24px; display: flex; align-items: center; }
        .log-slider-track { position: absolute; left: 0; right: 0; height: 6px; background: #f3f4f6; border-radius: 4px; overflow: hidden; pointer-events: none; }
        .log-slider-fill { position: absolute; left: 0; top: 0; bottom: 0; background: #6b9e7e; transition: width 0.1s ease-out; }
        .log-slider-input {
          width: 100%; -webkit-appearance: none; background: transparent; margin: 0; cursor: pointer; position: relative; z-index: 2; height: 24px;
        }
        .log-slider-input:focus { outline: none; }
        .log-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: white; border: 3px solid #6b9e7e; box-shadow: 0 2px 6px rgba(0,0,0,0.15); transition: transform 0.1s;
        }
        .log-slider-input::-webkit-slider-thumb:active { transform: scale(1.2); }
        .log-slider-labels { display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; color: #9ca3af; font-weight: 600; }
        .log-slider-labels.sleep { margin-top: 12px; }

        .log-steps-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; }
        .log-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .log-pill { padding: 4px 12px; border-radius: 16px; font-size: 11px; font-weight: 600; cursor: pointer; border: 1.5px solid #e5e7eb; background: white; color: #6b7280; transition: all 0.2s; }
        .log-pill.active { background: #6b9e7e; border-color: #6b9e7e; color: white; }
        .log-pill.sleep-active { background: #f5f3ff; border: none; color: #6366f1; display: inline-flex; align-items: center; gap: 6px; }
        .log-streak { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: #4a7c59; }

        /* Sleep Visual */
        .log-sleep-labels-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; }
        .log-sl-sm { display: block; font-size: 10px; color: #9ca3af; font-weight: 600; margin-bottom: 2px; }
        .log-sl-lg { display: block; font-size: 13px; font-weight: 800; color: #111827; }
        .log-sl-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #6366f1; margin-right: 4px; vertical-align: middle; }
        
        .log-sleep-track { position: relative; height: 24px; display: flex; align-items: center; }
        .log-sleep-track::before { content: ''; position: absolute; left: 0; right: 0; height: 6px; background: #f3f4f6; border-radius: 4px; }
        .log-sleep-fill { position: absolute; height: 6px; background: #6366f1; border-radius: 4px; }
        .log-sleep-handle { position: absolute; width: 16px; height: 16px; background: white; border: 2.5px solid #6366f1; border-radius: 50%; top: 50%; transform: translate(-50%, -50%); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

        /* Water */
        .log-water-content { display: flex; gap: 24px; align-items: center; }
        .log-water-ring { position: relative; width: 90px; height: 90px; flex-shrink: 0; }
        .log-water-ring svg { width: 100%; height: 100%; }
        .log-water-val { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .log-water-val strong { font-size: 16px; font-weight: 800; color: #111827; line-height: 1.1; }
        .log-water-val span { font-size: 10px; font-weight: 600; color: #9ca3af; }
        .log-water-info { flex: 1; }
        .log-water-prog-text { font-size: 11px; color: #6b7280; font-weight: 600; margin-bottom: 6px; }
        .log-water-bar-track { height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden; margin-bottom: 16px; }
        .log-water-bar-fill { height: 100%; background: #818cf8; border-radius: 3px; }
        .log-water-add { font-size: 11px; color: #6b7280; font-weight: 600; margin-bottom: 8px; }
        .log-water-btns { display: flex; gap: 6px; flex-wrap: wrap; }
        .log-water-btn { padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 16px; border: 1.5px solid #e0e7ff; background: white; color: #6366f1; cursor: pointer; transition: all 0.2s; }
        .log-water-btn.active { background: #6366f1; border-color: #6366f1; color: white; }

        /* Mood */
        .log-mood-emojis { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .log-mood-item { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: transform 0.2s; opacity: 0.6; }
        .log-mood-item.active { opacity: 1; transform: scale(1.1); }
        .log-mood-emoji { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; background: white; border: 2px solid transparent; }
        .log-mood-item.active .log-mood-emoji { border-color: #22c55e; box-shadow: 0 4px 12px rgba(34,197,94,0.2); }
        .log-mood-lbl { font-size: 10px; font-weight: 600; color: #6b7280; }
        .log-mood-item.active .log-mood-lbl { color: #22c55e; }
        .log-mood-input { display: flex; align-items: center; gap: 10px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; }
        .log-mood-input input { border: none; background: transparent; font-size: 13px; color: #111827; flex: 1; outline: none; font-family: 'Inter', sans-serif; }
        .log-mood-input input::placeholder { color: #9ca3af; }

        /* Grid / Small Metrics */
        .log-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .log-metric-val { margin-bottom: 12px; }
        .log-metric-val strong { font-size: 32px; font-weight: 800; color: #111827; line-height: 1; }
        .log-metric-val span { font-size: 16px; color: #6b7280; font-weight: 600; margin-left: 2px; }
        .log-metric-val.sm strong { font-size: 24px; }
        .log-metric-val.sm span { font-size: 12px; margin-left: 4px; }
        .log-toggle-wrap { display: flex; background: #f3f4f6; border-radius: 20px; padding: 2px; }
        .log-toggle-btn { flex: 1; padding: 4px 0; font-size: 11px; font-weight: 600; border-radius: 18px; border: none; background: transparent; color: #6b7280; cursor: pointer; transition: all 0.2s; }
        .log-toggle-btn.active { background: #6b9e7e; color: white; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
        .log-metric-sub { font-size: 11px; color: #6b7280; font-weight: 600; }

        /* Meals Grid */
        .log-meals-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; overflow-x: auto; padding-bottom: 8px; }
        .log-meal-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; }
        .log-meal-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #4a7c59; }
        .log-meal-lbl { font-size: 10px; font-weight: 600; color: #111827; }
        .log-meal-dot { width: 4px; height: 4px; border-radius: 50%; }

        /* Mini Charts */
        .log-mini-chart { display: flex; align-items: flex-end; gap: 3px; height: 30px; margin-top: 12px; }
        .log-bar { width: 6px; border-radius: 3px; background: #e5e7eb; }
        .log-bar.red { background: #fda4af; }
        .log-mini-chart.bp { flex-direction: column; align-items: stretch; justify-content: flex-end; gap: 6px; }
        .log-mini-chart.bp > div { display: flex; align-items: center; gap: 6px; }
        .log-mini-chart.bp .lbl { font-size: 9px; font-weight: 700; color: #9ca3af; width: 18px; }
        .log-mini-chart.bp .bar { flex: 1; height: 4px; background: #f3f4f6; border-radius: 2px; }
        .log-mini-chart.bp .fill { height: 100%; background: #a78bfa; border-radius: 2px; }
      `}</style>
    </div>
  );
}
