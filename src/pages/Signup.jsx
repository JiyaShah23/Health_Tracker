import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Eye, EyeOff } from 'lucide-react';

/* ── Leaf SVG icon ── */
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
      <path
        d="M17 8C8 10 5.9 16.17 3.82 19.92C3.26 20.94 4.27 22 5.38 21.6C8.81 20.37 14.13 17.5 17 12C17 12 20 8 17 2C17 2 17 5.5 17 8Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
        strokeLinejoin="round"
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

/* ── Password strength ── */
function getStrength(pw) {
  if (pw.length === 0) return { level: 0, label: '', color: '' };
  if (pw.length < 6) return { level: 1, label: 'Weak', color: '#ef4444' };
  if (pw.length < 9) return { level: 2, label: 'Fair', color: '#f59e0b' };
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw))
    return { level: 4, label: 'Strong', color: '#22c55e' };
  return { level: 3, label: 'Good', color: '#16a34a' };
}

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!agreed) e.agreed = 'Please agree to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setUser({ email: form.email, name: form.firstName });
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="su-page">
      {/* Green blob */}
      <div className="su-blob" />

      {/* Scrollable content */}
      <div className="su-scroll">
        {/* Logo */}
        <div className="su-logo-wrap">
          <div className="su-logo-box">
            <LeafIcon />
          </div>
          <h1 className="su-brand">VitalAI</h1>
          <p className="su-tagline">Your AI-powered health companion</p>
        </div>

        {/* Card */}
        <div className="su-card">
          <h2 className="su-card-title">Create your account</h2>
          <p className="su-card-sub">Start your wellness journey today</p>

          <form onSubmit={handleSubmit} className="su-form">
            {/* Name Row */}
            <div className="su-row">
              <div className="su-field half">
                <label className="su-label">First Name</label>
                <input className={`su-input ${errors.firstName ? 'su-err' : ''}`}
                  placeholder="John" value={form.firstName}
                  onChange={e => set('firstName', e.target.value)} />
                {errors.firstName && <span className="su-ferr">{errors.firstName}</span>}
              </div>
              <div className="su-field half">
                <label className="su-label">Last Name</label>
                <input className={`su-input ${errors.lastName ? 'su-err' : ''}`}
                  placeholder="Doe" value={form.lastName}
                  onChange={e => set('lastName', e.target.value)} />
                {errors.lastName && <span className="su-ferr">{errors.lastName}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="su-field">
              <label className="su-label">Email</label>
              <div className="su-input-wrap">
                <svg className="su-icon" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
                  <path d="M2 7l8 5 8-5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input className={`su-input icon-left ${errors.email ? 'su-err' : ''}`}
                  type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => set('email', e.target.value)} />
              </div>
              {errors.email && <span className="su-ferr">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="su-field">
              <label className="su-label">Password</label>
              <div className="su-input-wrap">
                <svg className="su-icon" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="#9ca3af" strokeWidth="1.5"/>
                  <circle cx="10" cy="10" r="2" fill="#9ca3af"/>
                </svg>
                <input className={`su-input icon-left icon-right ${errors.password ? 'su-err' : ''}`}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" className="su-eye" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={17} color="#9ca3af"/> : <Eye size={17} color="#9ca3af"/>}
                </button>
              </div>
              {/* Strength bars */}
              {form.password.length > 0 && (
                <div className="su-strength-wrap">
                  <div className="su-bars">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="su-bar"
                        style={{ background: i <= strength.level ? strength.color : '#e5e7eb' }} />
                    ))}
                  </div>
                  <div className="su-strength-row">
                    <span>Strength: <strong style={{ color: strength.color }}>{strength.label}</strong></span>
                    <span className="su-hint">Use 8+ chars, symbols</span>
                  </div>
                </div>
              )}
              {!form.password && (
                <div className="su-strength-row" style={{marginTop:4}}>
                  <span></span>
                  <span className="su-hint">Use 8+ chars, symbols</span>
                </div>
              )}
              {errors.password && <span className="su-ferr">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="su-field">
              <label className="su-label">Confirm Password</label>
              <div className="su-input-wrap">
                <svg className="su-icon" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="#9ca3af" strokeWidth="1.5"/>
                  <circle cx="10" cy="10" r="2" fill="#9ca3af"/>
                </svg>
                <input className={`su-input icon-left icon-right ${errors.confirm ? 'su-err' : ''}`}
                  type={showCf ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                <button type="button" className="su-eye" onClick={() => setShowCf(!showCf)}>
                  {showCf ? <EyeOff size={17} color="#9ca3af"/> : <Eye size={17} color="#9ca3af"/>}
                </button>
              </div>
              {errors.confirm && <span className="su-ferr">{errors.confirm}</span>}
            </div>

            {/* Terms checkbox */}
            <label className="su-terms">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="su-checkbox" />
              <span>
                I agree to the <a href="#" className="su-link">Terms of Service</a> and{' '}
                <a href="#" className="su-link">Privacy Policy</a> of VitalAI
              </span>
            </label>
            {errors.agreed && <span className="su-ferr" style={{marginTop:-8}}>{errors.agreed}</span>}

            {/* Sign Up Button */}
            <button type="submit" className="su-btn-primary" disabled={loading} id="signup-submit">
              {loading
                ? <span className="su-spinner" />
                : <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight:6}}>
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="white"/>
                    </svg>
                    Sign Up
                  </>
              }
            </button>

            {/* Divider */}
            <div className="su-divider"><span>Or sign up with</span></div>

            {/* Social buttons */}
            <button type="button" className="su-social-btn apple">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </button>

            <button type="button" className="su-social-btn google">
              <GoogleG />
              Continue with Google
            </button>

            {/* Login link */}
            <p className="su-login-link">
              Already have an account?{' '}
              <button type="button" className="su-link-btn" onClick={() => navigate('/login')}>Log in</button>
            </p>
          </form>
        </div>
        <div style={{height: 24}} />
      </div>

      <style>{`
        .su-page {
          min-height: 100vh;
          background: #eef5ee;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .su-blob {
          position: fixed;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 340px;
          height: 340px;
          background: radial-gradient(ellipse, rgba(74,124,89,0.22) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          border-radius: 50%;
        }
        .su-scroll {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 20px 0;
          max-width: 430px;
          margin: 0 auto;
        }
        .su-logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          margin-bottom: 28px;
        }
        .su-logo-box {
          width: 64px;
          height: 64px;
          background: var(--primary);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px var(--primary-glow);
          margin-bottom: 6px;
        }
        .su-brand {
          font-size: 24px;
          font-weight: 800;
          color: #1a2e1a;
          letter-spacing: -0.4px;
        }
        .su-tagline {
          font-size: 13px;
          color: #6b7280;
          font-weight: 400;
        }
        .su-card {
          background: white;
          border-radius: 24px;
          padding: 28px 24px 24px;
          width: 100%;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
        }
        .su-card-title {
          font-size: 22px;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.4px;
          margin-bottom: 4px;
        }
        .su-card-sub {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 22px;
        }
        .su-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .su-row {
          display: flex;
          gap: 12px;
        }
        .su-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .su-field.half { flex: 1; }
        .su-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }
        .su-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .su-icon {
          position: absolute;
          left: 14px;
          width: 17px;
          height: 17px;
          pointer-events: none;
          z-index: 1;
        }
        .su-eye {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }
        .su-input {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 13px 14px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #111827;
          background: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .su-input.icon-left { padding-left: 42px; }
        .su-input.icon-right { padding-right: 42px; }
        .su-input::placeholder { color: #9ca3af; }
        .su-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }
        .su-input.su-err { border-color: #ef4444; }
        .su-ferr { font-size: 11px; color: #ef4444; margin-top: -2px; }
        .su-strength-wrap { display: flex; flex-direction: column; gap: 4px; }
        .su-bars { display: flex; gap: 4px; margin-top: 6px; }
        .su-bar { flex: 1; height: 4px; border-radius: 2px; transition: background 0.3s; }
        .su-strength-row {
          display: flex; justify-content: space-between;
          font-size: 11px; color: #6b7280;
        }
        .su-hint { font-size: 11px; color: #9ca3af; }
        .su-terms {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 12.5px;
          color: #374151;
          line-height: 1.5;
          cursor: pointer;
        }
        .su-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          flex-shrink: 0;
          margin-top: 1px;
          accent-color: var(--primary);
          cursor: pointer;
        }
        .su-link { color: var(--primary); font-weight: 600; text-decoration: none; }
        .su-link:hover { text-decoration: underline; }
        .su-btn-primary {
          width: 100%;
          background: var(--primary);
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
          box-shadow: 0 4px 16px var(--primary-glow);
          margin-top: 4px;
        }
        .su-btn-primary:hover { background: #3d6b4a; transform: translateY(-1px); }
        .su-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .su-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #9ca3af;
          font-size: 12.5px;
          text-align: center;
        }
        .su-divider::before, .su-divider::after {
          content: ''; flex: 1; height: 1px; background: #e5e7eb;
        }
        .su-social-btn {
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
        .su-social-btn.apple {
          background: white;
          color: #111827;
          border: 1.5px solid #e5e7eb;
        }
        .su-social-btn.apple:hover { background: #f9fafb; }
        .su-social-btn.google {
          background: white;
          color: #111827;
          border: 1.5px solid #e5e7eb;
        }
        .su-social-btn.google:hover { background: #f9fafb; }
        .su-login-link {
          text-align: center;
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
        }
        .su-link-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }
        .su-link-btn:hover { text-decoration: underline; }
        .su-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>
    </div>
  );
}
