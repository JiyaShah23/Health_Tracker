import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, DataContext, ThemeContext } from '../App';
import { getTodayKey, calcSleepHours } from '../utils/dateUtils';

import { 
  ArrowLeft, Edit3, Mail, Phone, Calendar, 
  Bell, Shield, Globe, Lock, LogOut, ChevronRight 
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { logData } = useContext(DataContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const todayKey = getTodayKey();
  const todayEntry = logData[todayKey] || {};

  const displayName = user?.name || 'User';
  const firstName = displayName.split(' ')[0] || displayName;
  const lastName = displayName.split(' ').slice(1).join(' ') || '';
  const displayEmail = user?.email || '';

  const [mounted, setMounted] = useState(false);
  const [notifOn, setNotifOn] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const Toggle = ({ on, onToggle }) => (
    <div className={`prof-toggle ${on ? 'on' : 'off'}`} onClick={onToggle}>
      <div className="prof-toggle-knob" />
    </div>
  );

  return (
    <div className="prof-page">
      
      {/* Header */}
      <div className={`prof-header ${mounted ? 'fade-in' : ''}`}>
        <button className="prof-back-btn" onClick={() => navigate(-1)} aria-label="Back">
          <ArrowLeft size={18} strokeWidth={2.5} color="#111827" />
        </button>
        <h1 className="prof-title">Profile</h1>
        <div style={{ width: 40 }} /> {/* Spacer to center title */}
      </div>

      <div className="prof-scroll">
        
        {/* --- Top User Card --- */}
        <div className={`prof-card stagger-1 ${mounted ? 'active' : ''}`} style={{ textAlign: 'center', paddingTop: 32, paddingBottom: 24 }}>
          <div className="prof-avatar-wrap">
            <div className="prof-avatar-ring">
              <div className="prof-avatar" style={{
                backgroundImage: undefined,
                background: 'linear-gradient(135deg, #4a7c59, #2d6a4f)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 800,
                color: 'white',
                letterSpacing: -1,
              }}>
                {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            </div>
            <div className="prof-status-dot" />
          </div>
          <h2 className="prof-name">{displayName}</h2>
          <p className="prof-member-since">Member since {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          <button className="prof-edit-btn">
            <Edit3 size={14} strokeWidth={2.5} /> Edit Profile
          </button>
        </div>

        {/* --- Personal Information --- */}
        <div className={`prof-section-title stagger-2 ${mounted ? 'active' : ''}`}>
          <div className="prof-sec-line" />
          Personal Information
        </div>

        <div className={`prof-grid stagger-5 ${mounted ? 'active' : ''}`}>
          <div className="prof-field half">
            <label>First Name</label>
            <input type="text" className="prof-input" defaultValue={firstName} />
          </div>
          <div className="prof-field half">
            <label>Last Name</label>
            <input type="text" className="prof-input" defaultValue={lastName} />
          </div>
          <div className="prof-field full">
            <label>Email</label>
            <div className="prof-input-wrap">
              <Mail size={16} className="prof-input-icon" />
              <input type="email" className="prof-input icon-left" defaultValue={displayEmail} />
            </div>
          </div>
          <div className="prof-field full">
            <label>Phone Number</label>
            <div className="prof-input-wrap">
              <Phone size={16} className="prof-input-icon" />
              <input type="tel" className="prof-input icon-left" defaultValue="+1 234 567 890" />
            </div>
          </div>
          <div className="prof-field full">
            <label>Date of Birth</label>
            <div className="prof-input-wrap">
              <Calendar size={16} className="prof-input-icon" />
              <input type="text" className="prof-input icon-left" defaultValue="Jan 01, 1990" />
            </div>
          </div>
        </div>

        {/* --- Today's Summary --- */}
        <div className={`prof-section-title stagger-3 ${mounted ? 'active' : ''}`}>
          <div className="prof-sec-line" />
          Today's Summary
        </div>

        <div className={`prof-list-card stagger-4 ${mounted ? 'active' : ''}`}>
          {[
            { label: 'Steps', value: todayEntry.steps ? todayEntry.steps.toLocaleString() : '—', unit: 'steps' },
            { label: 'Water', value: todayEntry.water ? (todayEntry.water / 1000).toFixed(1) : '—', unit: 'L' },
            { label: 'Calories', value: todayEntry.calories || '—', unit: 'kcal' },
            { label: 'Sleep', value: calcSleepHours(todayEntry.sleepStart, todayEntry.sleepEnd) ?? '—', unit: 'hrs' },
          ].map((item, i) => (
            <div key={i}>
              <div className="prof-list-item">
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#374151' }}>{item.label}</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#4a7c59' }}>
                  {item.value} <span style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af' }}>{item.unit}</span>
                </span>
              </div>
              {i < 3 && <div className="prof-list-sep" />}
            </div>
          ))}
        </div>

        {/* --- Settings --- */}
        <div className={`prof-section-title stagger-6 ${mounted ? 'active' : ''}`}>
          <div className="prof-sec-line" />
          Settings
        </div>

        <div className={`prof-list-card stagger-7 ${mounted ? 'active' : ''}`}>
          <div className="prof-list-item">
            <div className="prof-item-left">
              <div className="prof-item-icon"><Bell size={16} /></div>
              <span>Notifications</span>
            </div>
            <Toggle on={notifOn} onToggle={() => setNotifOn(!notifOn)} />
          </div>
          <div className="prof-list-sep" />
          <div className="prof-list-item">
            <div className="prof-item-left">
              <div className="prof-item-icon">
                {theme === 'dark' ? '🌙' : '☀️'}
              </div>
              <span>Dark Mode</span>
            </div>
            <Toggle on={theme === 'dark'} onToggle={toggleTheme} />
          </div>
          <div className="prof-list-sep" />
          <div className="prof-list-item clickable">
            <div className="prof-item-left">
              <div className="prof-item-icon"><Shield size={16} /></div>
              <span>Privacy Settings</span>
            </div>
            <ChevronRight size={16} color="#9ca3af" />
          </div>
          <div className="prof-list-sep" />
          <div className="prof-list-item clickable">
            <div className="prof-item-left">
              <div className="prof-item-icon"><Globe size={16} /></div>
              <span>Language Preference</span>
            </div>
            <div className="prof-item-right">
              <span className="prof-val-text">English</span>
              <ChevronRight size={16} color="#9ca3af" />
            </div>
          </div>
        </div>

        {/* --- Account Actions --- */}
        <div className={`prof-section-title stagger-8 ${mounted ? 'active' : ''}`}>
          <div className="prof-sec-line" />
          Account Actions
        </div>

        <div className={`prof-list-card stagger-9 ${mounted ? 'active' : ''}`}>
          <div className="prof-list-item clickable">
            <div className="prof-item-left">
              <div className="prof-item-icon"><Lock size={16} /></div>
              <span>Change Password</span>
            </div>
            <ChevronRight size={16} color="#9ca3af" />
          </div>
        </div>

        <button className={`prof-logout-btn stagger-10 ${mounted ? 'active' : ''}`} onClick={handleLogout}>
          <LogOut size={16} strokeWidth={2.5} /> Log Out
        </button>

        <div className={`prof-footer stagger-11 ${mounted ? 'active' : ''}`}>
          VitalAI v1.0.0 · Made with <svg viewBox="0 0 24 24" width="12" height="12" fill="#4a7c59" stroke="#4a7c59" strokeWidth="0.5"><path d="M17 8C8 10 5.9 16.17 3.82 19.92C3.26 20.94 4.27 22 5.38 21.6C8.81 20.37 14.13 17.5 17 12C17 12 20 8 17 2C17 2 17 5.5 17 8Z"/><path d="M3.5 20C5 17 8.5 13.5 17 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>

      </div>

      <style>{`
        .prof-page { min-height: 100vh; background: #eef5ee; display: flex; flex-direction: column; font-family: 'Inter', sans-serif; }
        
        .prof-header { display: flex; align-items: center; justify-content: space-between; padding: 48px 20px 16px; position: sticky; top: 0; z-index: 10; opacity: 0; transform: translateY(-10px); transition: all 0.3s; }
        .prof-header.fade-in { opacity: 1; transform: translateY(0); }
        .prof-back-btn { width: 40px; height: 40px; border-radius: 12px; background: white; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: transform 0.2s; }
        .prof-back-btn:active { transform: scale(0.95); }
        .prof-title { font-size: 18px; font-weight: 800; color: #1a2e1a; letter-spacing: -0.2px; }

        .prof-scroll { flex: 1; overflow-y: auto; padding: 12px 20px 40px; display: flex; flex-direction: column; gap: 20px; }
        .prof-scroll::-webkit-scrollbar { display: none; }

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
        [class*="stagger-"].active { opacity: 1; transform: translateY(0); }

        .prof-card { background: white; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.02); }
        
        .prof-avatar-wrap { position: relative; width: 88px; height: 88px; margin: 0 auto 16px; }
        .prof-avatar-ring { width: 100%; height: 100%; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, #06b6d4, #a855f7, #ec4899); }
        .prof-avatar { width: 100%; height: 100%; border-radius: 50%; border: 3px solid white; background-size: cover; background-position: center; }
        .prof-status-dot { position: absolute; bottom: 2px; right: 2px; width: 16px; height: 16px; background: #22c55e; border-radius: 50%; border: 2.5px solid white; }
        
        .prof-name { font-size: 20px; font-weight: 800; color: #111827; letter-spacing: -0.3px; margin-bottom: 4px; }
        .prof-member-since { font-size: 12px; color: #9ca3af; font-weight: 500; margin-bottom: 16px; }
        .prof-edit-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 20px; border: 1.5px solid #d1fae5; background: #f0fdf4; color: #4a7c59; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .prof-edit-btn:hover { background: #dcfce7; border-color: #a7f3d0; }

        .prof-section-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 800; color: #1a2e1a; margin-top: 4px; }
        .prof-sec-line { width: 4px; height: 16px; background: #4a7c59; border-radius: 2px; }

        .prof-grid { display: flex; flex-wrap: wrap; gap: 12px; }
        .prof-field { display: flex; flex-direction: column; gap: 6px; }
        .prof-field.half { width: calc(50% - 6px); }
        .prof-field.full { width: 100%; }
        .prof-field label { font-size: 11.5px; font-weight: 700; color: #374151; margin-left: 2px; }
        
        .prof-input-wrap { position: relative; display: flex; align-items: center; }
        .prof-input-icon { position: absolute; left: 14px; color: #9ca3af; pointer-events: none; }
        .prof-input { width: 100%; background: white; border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 12px 14px; font-size: 14px; font-family: 'Inter', sans-serif; color: #111827; outline: none; transition: border-color 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.01); }
        .prof-input.icon-left { padding-left: 40px; }
        .prof-input:focus { border-color: #4a7c59; }

        .prof-list-card { background: white; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); overflow: hidden; }
        .prof-list-item { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: white; transition: background 0.2s; }
        .prof-list-item.clickable { cursor: pointer; }
        .prof-list-item.clickable:active { background: #f9fafb; }
        .prof-list-sep { height: 1px; background: #f3f4f6; margin: 0 16px; }
        .prof-item-left { display: flex; align-items: center; gap: 12px; font-size: 13.5px; font-weight: 600; color: #374151; }
        .prof-item-icon { width: 32px; height: 32px; border-radius: 10px; background: #f0fdf4; color: #4a7c59; display: flex; align-items: center; justify-content: center; }
        .prof-item-right { display: flex; align-items: center; gap: 6px; }
        .prof-val-text { font-size: 12px; font-weight: 600; color: #9ca3af; }

        .prof-toggle { width: 44px; height: 24px; border-radius: 12px; position: relative; transition: background 0.2s; cursor: pointer; border: 1.5px solid transparent; }
        .prof-toggle.on { background: white; border-color: #4a7c59; }
        .prof-toggle.off { background: #e5e7eb; }
        .prof-toggle-knob { position: absolute; top: 2px; left: 2px; width: 17px; height: 17px; background: white; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .prof-toggle.on .prof-toggle-knob { transform: translateX(20px); background: #4a7c59; }

        .prof-logout-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; background: #f5ecec; color: #dc2626; border: 1.5px solid #eedede; border-radius: 16px; font-size: 14px; font-weight: 700; font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
        .prof-logout-btn:active { transform: scale(0.98); }

        .prof-footer { text-align: center; font-size: 11px; font-weight: 600; color: #9ca3af; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 4px; }
      `}</style>
    </div>
  );
}
