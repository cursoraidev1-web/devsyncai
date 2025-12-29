import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Verify2FA.css';

const Verify2FA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verify2FA } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get email from location state or query params
  const email = location.state?.email || new URLSearchParams(location.search).get('email') || '';

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    if (!email) {
      setError('Email is required for 2FA verification');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verify2FA(email, code);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Invalid verification code. Please try again.');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-2fa-container">
      <div className="verify-2fa-card">
        <div className="verify-2fa-header">
          <h1>Two-Factor Authentication</h1>
          <p>Enter the 6-digit code from your authenticator app</p>
        </div>

        {error && (
          <div className="verify-2fa-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="verify-2fa-form">
          <div className="verify-2fa-input-group">
            <label htmlFor="code">Verification Code</label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={handleChange}
              placeholder="000000"
              className="verify-2fa-input"
              maxLength="6"
              autoComplete="one-time-code"
              autoFocus
              required
            />
          </div>

          <button 
            type="submit" 
            className="verify-2fa-submit-btn"
            disabled={loading || code.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="verify-2fa-footer">
          <p>
            Don't have access to your authenticator?{' '}
            <a href="/login" className="verify-2fa-link">
              Go back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;











