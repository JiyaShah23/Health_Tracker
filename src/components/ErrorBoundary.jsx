import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('VitalAI Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f0fdf4',
          fontFamily: 'Inter, sans-serif',
          padding: '32px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#dcfce7', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 20, fontSize: 28,
          }}>
            🌿
          </div>
          <h2 style={{
            fontSize: 22, fontWeight: 800,
            color: '#111827', marginBottom: 10,
          }}>
            Something went wrong
          </h2>
          <p style={{
            fontSize: 14, color: '#6b7280',
            lineHeight: 1.6, maxWidth: 280,
            marginBottom: 28,
          }}>
            VitalAI hit an unexpected error. Your health data is safe — just reload the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #4a7c59, #2d6a4f)',
              color: 'white', border: 'none',
              borderRadius: 9999, padding: '14px 32px',
              fontSize: 15, fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(74,124,89,0.35)',
            }}
          >
            Reload App
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{
              marginTop: 24, fontSize: 11,
              color: '#ef4444', textAlign: 'left',
              background: '#fef2f2', padding: 12,
              borderRadius: 8, maxWidth: '100%',
              overflow: 'auto', maxHeight: 120,
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
