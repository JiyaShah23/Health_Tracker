import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart2, MessageSquare, User, Plus } from 'lucide-react';

const LEFT_ITEMS  = [
  { icon: Home,        label: 'Home',     path: '/dashboard' },
  { icon: BarChart2,   label: 'Insights', path: '/insights'  },
];
const RIGHT_ITEMS = [
  { icon: MessageSquare, label: 'Chat',    path: '/chatbot'  },
  { icon: User,          label: 'Profile', path: '/profile'  },
];

export default function BottomNav() {
  const navigate   = useNavigate();
  const { pathname } = useLocation();

  const NavBtn = ({ icon: Icon, label, path }) => {
    const active = pathname === path;
    return (
      <button className={`bnav-item ${active ? 'active' : ''}`}
        onClick={() => navigate(path)} aria-label={label}>
        <Icon size={21} />
        <span className="bnav-label">{label}</span>
      </button>
    );
  };

  return (
    <nav className="bnav">
      {LEFT_ITEMS.map(i  => <NavBtn key={i.path} {...i} />)}

      <div className="bnav-center-wrap">
        <button
          className={`bnav-center ${pathname === '/log' ? 'log-active' : ''}`}
          onClick={() => navigate('/log')}
          aria-label="Log"
        >
          <Plus size={26} color="white" strokeWidth={2.5} />
        </button>
        <span className="bnav-center-label">Log</span>
      </div>

      {RIGHT_ITEMS.map(i => <NavBtn key={i.path} {...i} />)}

      <style>{`
        .bnav {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 72px;
          background: white;
          border-top: 1px solid #f0f0f0;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.07);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 4px;
          z-index: 100;
        }
        .bnav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border: none;
          background: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 8px 0;
          transition: color 0.18s, transform 0.12s;
          font-family: 'Inter', sans-serif;
        }
        .bnav-item:active { transform: scale(0.92); }
        .bnav-item.active { color: var(--primary); }
        .bnav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.02em; }
        .bnav-center-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding-bottom: 4px;
          position: relative;
        }
        .bnav-center {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border: 3px solid white;
          box-shadow: 0 4px 16px var(--primary-glow);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.12s, box-shadow 0.12s;
          margin-top: -24px;
        }
        .bnav-center.log-active {
          box-shadow: 0 4px 20px rgba(74,124,89,0.65);
          transform: scale(1.08);
        }
        .bnav-center:active {
          transform: scale(0.92);
          box-shadow: 0 2px 8px rgba(74,124,89,0.3);
        }
        .bnav-center-label {
          font-size: 10px;
          font-weight: 600;
          color: #9ca3af;
          font-family: 'Inter', sans-serif;
          margin-top: 1px;
        }
      `}</style>
    </nav>
  );
}
