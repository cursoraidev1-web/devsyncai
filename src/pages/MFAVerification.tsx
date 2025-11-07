/**
 * MFA Verification Page
 * Two-factor authentication code entry
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MFAVerification: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { verifyMFA } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (codeValue?: string) => {
    const verificationCode = codeValue || code.join('');
    
    if (verificationCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await verifyMFA(verificationCode);

    setIsLoading(false);

    if (result.success) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid verification code');
      setCode(['', '', '', '', '', '']);
      const firstInput = document.getElementById('code-0');
      firstInput?.focus();
    }
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
            Two-Factor Authentication
          </h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
            {error}
          </div>
        )}

        {/* Demo Code Info */}
        <div className="alert alert-info" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <strong>Demo Code:</strong> 123456
        </div>

        {/* Code Input */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-xl)',
        }}>
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              style={{
                width: '3rem',
                height: '3.5rem',
                fontSize: '1.5rem',
                textAlign: 'center',
                border: '2px solid var(--color-gray-300)',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-gray-300)';
              }}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          onClick={() => handleSubmit()}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
          disabled={isLoading || code.some(digit => !digit)}
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <button
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>

        {/* Help Text */}
        <p style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
          Don't have access to your authenticator?{' '}
          <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
            Use backup code
          </a>
        </p>
      </div>
    </div>
  );
};

export default MFAVerification;
