/**
 * Login Page
 * Authentication page for user login
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate credentials here
    navigate('/');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--color-gray-50)',
    }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', margin: 'var(--spacing-lg)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill="var(--color-primary)" />
              <path d="M16 32L28 20L28 44L16 32Z" fill="white" />
              <path d="M36 20L48 32L36 44L36 20Z" fill="white" />
            </svg>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--spacing-xs)' }}>
            DevSync AI
          </h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <a href="#" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <input type="checkbox" style={{ marginRight: 'var(--spacing-sm)' }} />
              Remember me for 30 days
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-md)', 
          margin: 'var(--spacing-xl) 0' 
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-gray-200)' }}></div>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-gray-200)' }}></div>
        </div>

        {/* SSO Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <button className="btn btn-outline" style={{ width: '100%' }}>
            <svg style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <button className="btn btn-outline" style={{ width: '100%' }}>
            <svg style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <p style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
          Don't have an account?{' '}
          <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
            Sign up for free
          </a>
        </p>

        {/* Demo Credentials */}
        <div className="alert alert-info" style={{ marginTop: 'var(--spacing-lg)' }}>
          <strong>Demo Credentials:</strong><br />
          Email: demo@devsync.ai<br />
          Password: demo123
        </div>
      </div>
    </div>
  );
};

export default Login;
