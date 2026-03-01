import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  componentDidUpdate(_, prevState) {
    if (this.state.hasError && !prevState.hasError) {
      document.body.style.overflow = 'hidden';
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  handleReset = () => {
    document.body.style.overflow = '';
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    document.body.style.overflow = '';
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">
              <AlertCircle size={48} strokeWidth={1.5} aria-hidden />
            </div>
            <p className="error-boundary-badge">Something went wrong</p>
            <h1 className="error-boundary-title">We hit a snag</h1>
            <p className="error-boundary-message">
              Something unexpected happened. Try again, or head back to the dashboard. If it keeps happening, contact support.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error details (dev only)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button type="button" className="error-boundary-btn error-boundary-btn-primary" onClick={this.handleReset}>
                <RefreshCw size={18} aria-hidden />
                Try again
              </button>
              <button type="button" className="error-boundary-btn error-boundary-btn-secondary" onClick={this.handleGoHome}>
                <Home size={18} aria-hidden />
                Go to dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

