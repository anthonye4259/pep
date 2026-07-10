import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          background: 'var(--bg)',
          color: 'var(--text)',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: 360 }}>
            <h1 style={{ fontSize: '1.35rem', marginBottom: 8 }}>Something went wrong</h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>
              PeptidAI hit an unexpected error. Restart the app or reload this screen.
            </p>
            <button
              className="btn btn-primary btn-full"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.hash = '#/';
                window.location.reload();
              }}
            >
              Reload App
            </button>
            {this.state.error?.message && (
              <p style={{
                marginTop: 16,
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                wordBreak: 'break-word'
              }}>
                {this.state.error.message}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
