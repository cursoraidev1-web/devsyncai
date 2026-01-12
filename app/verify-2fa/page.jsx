'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import '../../styles/pages/Verify2FA.css';

function Verify2FAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verify2FA } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Get email from query params
  const email = searchParams.get('email') || '';

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index, value) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(0, 1);
    
    if (digit) {
      const newCode = [...code];
      newCode[index] = digit;
      setCode(newCode);
      setError('');

      // Auto-advance to next input
      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    } else {
      // Clear current input
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
    // Handle paste
    else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        const newCode = ['', '', '', '', '', ''];
        digits.split('').forEach((digit, i) => {
          if (i < 6) newCode[i] = digit;
        });
        setCode(newCode);
        setError('');
        // Focus the last filled input or next empty
        const nextIndex = Math.min(digits.length, 5);
        if (inputRefs.current[nextIndex]) {
          inputRefs.current[nextIndex].focus();
        }
      });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const digits = pastedText.replace(/\D/g, '').slice(0, 6);
    const newCode = ['', '', '', '', '', ''];
    digits.split('').forEach((digit, i) => {
      if (i < 6) newCode[i] = digit;
    });
    setCode(newCode);
    setError('');
    // Focus the last filled input or next empty
    const nextIndex = Math.min(digits.length, 5);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
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
      await verify2FA(email, fullCode);
      router.push('/dashboard');
    } catch (err) {
      setError(err?.message || 'Invalid verification code. Please try again.');
      setCode(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-2fa-container">
      <div className="verify-2fa-content">
        {/* Logo and Brand */}
        <div className="verify-2fa-logo-section">
          <Logo width={40} height={40} showText={true} textColor="#111827" />
        </div>

        {/* Instructions */}
        <div className="verify-2fa-header">
          <h1>Enter the 6-digit code from your app</h1>
          <p>Copy and paste code from authenticator</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="verify-2fa-error">
            {error}
          </div>
        )}

          {/* Code Input Fields */}
          <form onSubmit={handleSubmit} className="verify-2fa-form">
            <div className="verify-2fa-inputs-wrapper" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <div key={index} className="verify-2fa-digit-wrapper">
                  <input
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="verify-2fa-digit-input"
                    autoComplete="off"
                    disabled={loading}
                  />
                  {!digit && <span className="verify-2fa-digit-placeholder">-</span>}
                </div>
              ))}
            </div>

          <p className="verify-2fa-refresh-text">Codes refresh every 30 seconds</p>

          <button 
            type="submit" 
            className="verify-2fa-submit-btn"
            disabled={loading || code.join('').length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify and Enable'}
          </button>

          <a href="/login" className="verify-2fa-mail-link">
            Verify Via Mail
          </a>
        </form>

        {/* Footer Links */}
        <div className="verify-2fa-footer">
          <a href="/terms" className="verify-2fa-footer-link">Terms of Service</a>
          <a href="/privacy" className="verify-2fa-footer-link">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}

export default function Verify2FA() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-background)', color: 'var(--color-text-primary)' }}>Loading...</div>}>
      <Verify2FAContent />
    </Suspense>
  );
}
