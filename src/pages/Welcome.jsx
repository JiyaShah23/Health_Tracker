import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, Activity, Moon, Flame, Heart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const SLIDES = [
  {
    title: 'Track Your Health,',
    highlight: 'Smarter',
    sub: 'Monitor steps, sleep, and wellness in one simple dashboard',
  },
  {
    title: 'Your Personal',
    highlight: 'AI Coach',
    sub: 'Get real-time insights and personalized health recommendations',
  },
  {
    title: 'Reach Your',
    highlight: 'Wellness Goals',
    sub: 'Set targets, track progress, and celebrate every milestone',
  },
];

const FEATURES = [
  { icon: Activity, label: 'Activity', color: '#22c55e', bg: '#f0fdf4' },
  { icon: Moon, label: 'Sleep', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: Flame, label: 'Calories', color: '#ea580c', bg: '#fff7ed' },
  { icon: Heart, label: 'Vitals', color: '#e11d48', bg: '#fff1f2' },
];

export default function Welcome() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayRef = useRef(null);

  // Auto advance slides
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setSlide(prev => (prev + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(autoPlayRef.current);
  }, []);

  // Reset timer when user manually changes slide
  const goToSlide = (i) => {
    clearInterval(autoPlayRef.current);
    setSlide(i);
    autoPlayRef.current = setInterval(() => {
      setSlide(prev => (prev + 1) % SLIDES.length);
    }, 3000);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left — next slide
        goToSlide((slide + 1) % SLIDES.length);
      } else {
        // Swiped right — previous slide
        goToSlide((slide - 1 + SLIDES.length) % SLIDES.length);
      }
    }
  };

  return (
    <div className="wlc-page">
      {/* Background blobs */}
      <div className="wlc-blob wlc-blob-1" />
      <div className="wlc-blob wlc-blob-2" />
      <div className="wlc-blob wlc-blob-3" />

      {/* Header */}
      <div className="wlc-header">
        <div className="wlc-logo">
          <div className="wlc-logo-icon">
            <Activity size={16} color="white" />
          </div>
          <span className="wlc-logo-text">VitalAI</span>
        </div>
        <button className="wlc-skip" onClick={() => navigate('/login')}>
          Skip
        </button>
      </div>

      {/* Illustration Card */}
      <div
        className="wlc-card-wrap"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Floating badge top-right */}
        <div className="wlc-float wlc-float-tr">
          <Heart size={13} color="#e11d48" />
          <span>72 BPM</span>
        </div>
        {/* Floating badge bottom-left */}
        <div className="wlc-float wlc-float-bl">
          <Moon size={13} color="#7c3aed" />
          <span>7.5 hrs</span>
        </div>

        <div className="wlc-img-card">
          <img
            src="/yoga.png"
            alt="Yoga wellness illustration"
            className="wlc-img"
            draggable={false}
          />
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="wlc-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`wlc-dot ${i === slide ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
      <div className="wlc-progress">
        <div
          className="wlc-progress-bar"
          style={{ width: `${((slide + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Text */}
      <div className="wlc-text animate-fade-up" key={slide}>
        <h1 className="wlc-title">
          {SLIDES[slide].title}
          <br />
          <span className="wlc-highlight">{SLIDES[slide].highlight}</span>
        </h1>
        <p className="wlc-sub">{SLIDES[slide].sub}</p>
      </div>

      {/* Feature Icons */}
      <div className="wlc-features">
        {FEATURES.map(({ icon: Icon, label, color, bg }, i) => (
          <div key={i} className="wlc-feature">
            <div className="wlc-feature-icon" style={{ background: bg }}>
              <Icon size={18} color={color} />
            </div>
            <span className="wlc-feature-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Dividers between features */}
      <p style={{
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: 600,
        letterSpacing: '0.05em',
        zIndex: 2,
        marginBottom: -8,
      }}>
        {slide + 1} / {SLIDES.length}
      </p>

      {/* CTA Buttons */}
      <div className="wlc-actions">
        <button
          className="wlc-btn-primary"
          onClick={() => navigate('/signup')}
          id="welcome-get-started"
        >
          Get Started
          <div className="wlc-btn-arrow">
            <ArrowRight size={16} color="white" />
          </div>
        </button>

        <button
          className="wlc-btn-secondary"
          onClick={() => navigate('/login')}
          id="welcome-login"
        >
          <User size={15} color="#4b5563" />
          I already have an account
        </button>
      </div>

      <style>{`
        .wlc-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f1f7f1;
          position: relative;
          overflow: hidden;
          padding: 0 20px 32px;
          max-width: 430px;
          margin: 0 auto;
        }

        /* Background blobs */
        .wlc-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .wlc-blob-1 {
          width: 280px;
          height: 280px;
          background: rgba(34, 197, 94, 0.12);
          top: -80px;
          left: -80px;
          animation: blobFloat 6s ease-in-out infinite;
        }
        .wlc-blob-2 {
          width: 200px;
          height: 200px;
          background: rgba(134, 239, 172, 0.2);
          top: 40px;
          right: -60px;
          animation: blobFloat 8s ease-in-out infinite reverse;
        }
        .wlc-blob-3 {
          width: 160px;
          height: 160px;
          background: rgba(220, 252, 231, 0.5);
          bottom: 180px;
          left: -40px;
          animation: blobFloat 7s ease-in-out infinite 1s;
        }

        @keyframes blobFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        /* Header */
        .wlc-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 52px 0 20px;
          position: relative;
          z-index: 2;
        }
        .wlc-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wlc-logo-icon {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(34,197,94,0.35);
        }
        .wlc-logo-text {
          font-size: 15px;
          font-weight: 700;
          color: #1a2e1a;
          letter-spacing: -0.2px;
        }
        .wlc-skip {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          background: rgba(255,255,255,0.7);
          border: none;
          border-radius: 20px;
          padding: 6px 16px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .wlc-skip:hover {
          background: white;
          color: #22c55e;
        }

        /* Illustration Card */
        .wlc-card-wrap {
          position: relative;
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
          z-index: 2;
        }
        .wlc-img-card {
          background: #f5f0e8;
          border-radius: 28px;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 4/4.2;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
          position: relative;
        }
        .wlc-img {
          width: 85%;
          height: 90%;
          object-fit: contain;
          object-position: center bottom;
          user-select: none;
        }

        /* Floating badges */
        .wlc-float {
          position: absolute;
          background: white;
          border-radius: 20px;
          padding: 7px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #1a2e1a;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          z-index: 3;
          white-space: nowrap;
          animation: floatBob 3s ease-in-out infinite;
        }
        .wlc-float-tr {
          top: 24px;
          right: -16px;
          animation-delay: 0s;
        }
        .wlc-float-bl {
          bottom: 36px;
          left: -16px;
          animation-delay: 1.5s;
        }

        @keyframes floatBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* Pagination dots */
        .wlc-dots {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 20px 0 18px;
          z-index: 2;
        }
        .wlc-dot {
          height: 8px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(34,197,94,0.25);
          width: 8px;
          padding: 0;
        }
        .wlc-dot.active {
          background: #22c55e;
          width: 24px;
          box-shadow: 0 0 8px rgba(34,197,94,0.4);
        }
        .wlc-progress {
          width: 120px;
          height: 3px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 2px;
          overflow: hidden;
          z-index: 2;
          margin-top: -12px;
          margin-bottom: 6px;
        }
        .wlc-progress-bar {
          height: 100%;
          background: var(--primary);
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        /* Text block */
        .wlc-text {
          text-align: center;
          z-index: 2;
          margin-bottom: 24px;
        }
        .wlc-title {
          font-size: 28px;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.6px;
          line-height: 1.2;
          margin-bottom: 10px;
        }
        .wlc-highlight {
          color: #22c55e;
          font-weight: 900;
        }
        .wlc-sub {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          max-width: 270px;
          margin: 0 auto;
        }

        /* Feature Icons */
        .wlc-features {
          display: flex;
          align-items: center;
          gap: 0;
          width: 100%;
          max-width: 320px;
          background: white;
          border-radius: 20px;
          padding: 14px 8px;
          margin-bottom: 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          z-index: 2;
        }
        .wlc-feature {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
        }
        .wlc-feature:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 32px;
          background: #e5e7eb;
        }
        .wlc-feature-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wlc-feature-label {
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          letter-spacing: 0.02em;
        }

        /* Action Buttons */
        .wlc-actions {
          width: 100%;
          max-width: 340px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 2;
        }
        .wlc-btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          border-radius: var(--radius-full, 9999px);
          padding: 16px 28px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s;
          box-shadow: 0 6px 24px rgba(34,197,94,0.4);
          letter-spacing: 0.01em;
        }
        .wlc-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(34,197,94,0.5);
        }
        .wlc-btn-primary:active {
          transform: translateY(0);
        }
        .wlc-btn-arrow {
          width: 28px;
          height: 28px;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wlc-btn-secondary {
          width: 100%;
          background: white;
          color: #4b5563;
          border: 1.5px solid #e5e7eb;
          border-radius: var(--radius-full, 9999px);
          padding: 15px 28px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .wlc-btn-secondary:hover {
          border-color: #22c55e;
          color: #22c55e;
        }

        /* Tablet — centered card */
        @media (min-width: 768px) and (max-width: 1199px) {
          .wlc-page {
            max-width: 430px;
            margin: 0 auto;
            min-height: 100vh;
            background: #f1f7f1;
          }
          body {
            background: linear-gradient(135deg, #e8f5e9, #f0fdf4, #e3f2fd);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
        }

        /* Desktop — two column layout */
        @media (min-width: 1200px) {
          .wlc-page {
            max-width: 100%;
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
            padding: 0;
            align-items: stretch;
            background: white;
          }

          /* Left side — illustration + branding */
          .wlc-header {
            grid-column: 1;
            grid-row: 1;
            padding: 48px 60px 0;
            background: linear-gradient(145deg, #2d6a4f, #4a7c59);
          }
          .wlc-logo-text { color: white; }
          .wlc-skip {
            background: rgba(255,255,255,0.2);
            color: white;
          }
          .wlc-blob-1, .wlc-blob-2, .wlc-blob-3 { display: none; }

          .wlc-card-wrap {
            grid-column: 1;
            grid-row: 2 / 6;
            max-width: 100%;
            background: linear-gradient(145deg, #2d6a4f, #4a7c59);
            border-radius: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 60px;
            margin: 0;
          }

          .wlc-img-card {
            width: 320px;
            height: 320px;
            background: rgba(255,255,255,0.15);
            border-radius: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          }

          .wlc-float-tr {
            right: 20px;
            top: 40px;
            background: white;
          }
          .wlc-float-bl {
            left: 20px;
            bottom: 60px;
            background: white;
          }

          /* Right side — text + actions */
          .wlc-dots {
            grid-column: 2;
            grid-row: 1;
            padding: 60px 60px 0;
            justify-content: flex-start;
            margin: 0;
          }

          .wlc-progress {
            grid-column: 2;
            grid-row: 2;
            margin: 0;
            padding: 0 60px;
            width: auto;
          }

          .wlc-text {
            grid-column: 2;
            grid-row: 3;
            text-align: left;
            padding: 32px 60px 0;
            margin: 0;
          }

          .wlc-title {
            font-size: 44px;
            letter-spacing: -1px;
          }

          .wlc-sub {
            max-width: 380px;
            margin: 0;
            font-size: 16px;
          }

          .wlc-features {
            grid-column: 2;
            grid-row: 4;
            max-width: 100%;
            margin: 0;
            padding: 24px 60px;
            background: none;
            box-shadow: none;
            border-radius: 0;
            justify-content: flex-start;
            gap: 24px;
          }

          .wlc-feature {
            flex: 0;
            flex-direction: row;
            gap: 10px;
            align-items: center;
          }

          .wlc-feature::after { display: none; }

          .wlc-feature-icon {
            width: 44px;
            height: 44px;
            border-radius: 14px;
          }

          .wlc-feature-label {
            font-size: 13px;
            color: var(--text-secondary);
            white-space: nowrap;
          }

          .wlc-actions {
            grid-column: 2;
            grid-row: 5;
            max-width: 400px;
            padding: 0 60px 60px;
            margin: 0;
            justify-content: flex-start;
          }

          .wlc-btn-primary {
            width: auto;
            padding: 16px 48px;
          }

          .wlc-btn-secondary {
            width: auto;
            padding: 15px 48px;
          }
        }
      `}</style>
    </div>
  );
}
