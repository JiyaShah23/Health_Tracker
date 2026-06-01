import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, createContext, useContext, useEffect } from 'react';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Log from './pages/Log';
import Notifications from './pages/Notifications';
import BottomNav from './components/BottomNav';
import './index.css';

export const AuthContext = createContext(null);
export const DataContext = createContext(null);

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <div className="page-content">{children}</div>
      <BottomNav />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/welcome" replace />;
  return <AppShell>{children}</AppShell>;
}

function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ht_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [logData, setLogData] = useState(() => {
    try {
      const saved = localStorage.getItem('ht_log_data');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ht_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ht_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ht_log_data', JSON.stringify(logData));
  }, [logData]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <DataContext.Provider value={{ logData, setLogData }}>
        <BrowserRouter>
          <Routes>
          {/* Public / onboarding */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
          <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup"  element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Protected app screens */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chatbot"   element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/insights"  element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/log"       element={<ProtectedRoute><Log /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/welcome" replace />} />
          </Routes>
        </BrowserRouter>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
}
