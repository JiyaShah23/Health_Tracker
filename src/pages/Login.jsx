import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Eye, EyeOff } from 'lucide-react';

/* ── Leaf SVG icon ── */
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
      <path
        d="M17 8C8 10 5.9 16.17 3.82 19.92C3.26 20.94 4.27 22 5.38 21.6C8.81 20.37 14.13 17.5 17 12C17 12 20 8 17 2C17 2 17 5.5 17 8Z"
        fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"
      />
      <path d="M3.5 20C5 17 8.5 13.5 17 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Google G ── */
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.185l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setUser({ email, name: email.split('@')[0] });
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="lg-page">
      {/* Green glow blob top-left */}
      <div className="lg-blob" />

      {/* Left panel — only visible on desktop */}
      <div className="lg-left-panel" style={{ display: 'none' }} 
        ref={el => { if (el) el.style.display = window.innerWidth >= 768 ? 'flex' : 'none'; }}>
        <div className="lg-logo-circle" style={{ width: 80, height: 80, marginBottom: 8 }}>
          <svg viewBox="0 0 24 24" fill="none" width="36" height="36">
            <path d="M17 8C8 10 5.9 16.17 3.82 19.92C3.26 20.94 4.27 22 5.38 21.6C8.81 20.37 14.13 17.5 17 12C17 12 20 8 17 2C17 2 17 5.5 17 8Z" fill="white" stroke="white" strokeWidth="0.5"/>
            <path d="M3.5 20C5 17 8.5 13.5 17 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="lg-left-title">Your AI Health<br />Coach Awaits</h1>
        <p className="lg-left-sub">Track your wellness journey with personalized AI insights powered by VitalAI.</p>
        <div className="lg-feature-list">
          {[
            { e: '🏃', t: 'Track steps & activity' },
            { e: '💧', t: 'Monitor hydration' },
            { e: '🌙', t: 'Analyze sleep patterns' },
            { e: '🤖', t: 'AI-powered coaching' },
          ].map((f, i) => (
            <div key={i} className="lg-feature-item">
              <span style={{ fontSize: 20 }}>{f.e}</span>
              {f.t}
            </div>
          ))}
        </div>
      </div>

      <div className="lg-inner">
        {/* Logo */}
        <div className="lg-logo-wrap">
          <div className="lg-logo-circle">
            <LeafIcon />
          </div>
          <h1 className="lg-title">Welcome back</h1>
          <p className="lg-sub">Enter your details to access your wellness journey.</p>
        </div>

        {/* Form card */}
        <div className="lg-card">
          <form onSubmit={handleLogin} className="lg-form">

            {/* Email */}
            <div className="lg-field">
              <label className="lg-label">Email address</label>
              <div className="lg-input-wrap">
                <svg className="lg-icon" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
                  <path d="M2 7l8 5 8-5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  className="lg-input icon-left"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="lg-field">
              <label className="lg-label">Password</label>
              <div className="lg-input-wrap">
                <svg className="lg-icon" viewBox="0 0 20 20" fill="none">
                  <rect x="5" y="9" width="10" height="8" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
                  <path d="M7 9V6a3 3 0 016 0v3" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  className="lg-input icon-left icon-right"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="lg-eye" onClick={() => setShowPw(!showPw)} aria-label="Toggle">
                  {showPw ? <EyeOff size={17} color="#9ca3af"/> : <Eye size={17} color="#9ca3af"/>}
                </button>
              </div>
              <div className="lg-forgot-row">
                <button type="button" className="lg-forgot">Forgot password?</button>
              </div>
            </div>

            {error && <div className="lg-error">{error}</div>}

            {/* Log in button */}
            <button type="submit" className="lg-btn-primary" disabled={loading} id="login-submit">
              {loading ? <span className="lg-spinner" /> : 'Log in'}
            </button>

            {/* Divider */}
            <div className="lg-divider"><span>OR CONTINUE WITH</span></div>

            {/* Social buttons */}
            <button type="button" className="lg-social apple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </button>

            <button type="button" className="lg-social google">
              <GoogleG />
              Continue with Google
            </button>

            {/* Signup link */}
            <p className="lg-signup-link">
              New here?{' '}
              <button type="button" className="lg-link-btn" onClick={() => navigate('/signup')} id="go-signup">
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        .lg-page {
          min-height: 100vh;
          background: var(--bg-surface);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
        }
        .lg-blob {
          position: fixed;
          top: -120px;
          left: -80px;
          width: 300px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(74,124,89,0.2) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .lg-inner {
          width: 100%;
          max-width: 390px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          position: relative;
          z-index: 1;
        }
        .lg-logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
        }
        .lg-logo-circle {
          width: 60px;
          height: 60px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px var(--primary-glow);
          margin-bottom: 4px;
        }
        .lg-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }
        .lg-sub {
          font-size: 13.5px;
          color: var(--text-secondary);
          line-height: 1.55;
          max-width: 260px;
        }
        .lg-card {
          background: var(--bg-card);
          border-radius: 24px;
          padding: 28px 24px;
          width: 100%;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
        }
        .lg-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .lg-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .lg-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .lg-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .lg-icon {
          position: absolute;
          left: 14px;
          width: 17px;
          height: 17px;
          pointer-events: none;
          z-index: 1;
        }
        .lg-eye {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .lg-input {
          width: 100%;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 13px 14px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
          background: var(--bg-card);
          outline: none;
          transition: border-color 0.2s;
        }
        .lg-input.icon-left { padding-left: 42px; }
        .lg-input.icon-right { padding-right: 42px; }
        .lg-input::placeholder { color: var(--text-muted); }
        .lg-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }
        .lg-forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -2px;
        }
        .lg-forgot {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
        }
        .lg-forgot:hover { text-decoration: underline; }
        .lg-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #dc2626;
        }
        .lg-btn-primary {
          width: 100%;
          background: var(--primary-light);
          color: white;
          border: none;
          border-radius: 14px;
          padding: 15px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 14px var(--primary-glow);
          letter-spacing: 0.01em;
        }
        .lg-btn-primary:hover { background: var(--primary-light); transform: translateY(-1px); }
        .lg-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .lg-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .lg-divider::before, .lg-divider::after {
          content: ''; flex: 1; height: 1px; background: #e5e7eb;
        }
        .lg-social {
          width: 100%;
          border-radius: 14px;
          padding: 13px 16px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
        }
        .lg-social.apple {
          background: #111827;
          color: white;
          border: none;
        }
        .lg-social.apple:hover { background: #1f2937; }
        .lg-social.google {
          background: var(--bg-card);
          color: var(--text-primary);
          border: 1.5px solid var(--border);
        }
        .lg-social.google:hover { background: #f9fafb; }
        .lg-signup-link {
          text-align: center;
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .lg-link-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }
        .lg-link-btn:hover { text-decoration: underline; }
        .lg-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @media (min-width: 768px) {
          .lg-page {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: stretch;
            padding: 0;
          }
          .lg-inner {
            max-width: 100%;
            padding: 60px 48px;
            justify-content: center;
            height: 100vh;
            overflow-y: auto;
          }
          .lg-left-panel {
            background: linear-gradient(135deg, #2d6a4f, #4a7c59);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 48px;
            color: white;
            gap: 24px;
          }
          .lg-left-title {
            font-size: 36px;
            font-weight: 800;
            color: white;
            line-height: 1.2;
            letter-spacing: -0.5px;
            text-align: center;
          }
          .lg-left-sub {
            font-size: 16px;
            color: rgba(255,255,255,0.8);
            text-align: center;
            line-height: 1.6;
            max-width: 320px;
          }
          .lg-feature-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-top: 16px;
            width: 100%;
            max-width: 320px;
          }
          .lg-feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
            color: white;
          }
        }
      `}</style>
    </div>
  );
}
