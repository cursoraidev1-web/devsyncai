'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
;
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle, signInWithGitHub } from '../../utils/oauth';
import DashboardPreview from '../../components/DashboardPreview';
import AccountLockoutMessage from '../../components/AccountLockoutMessage';
import { handleApiError } from '../../utils/errorHandler';
import { sanitizeInput } from '../../utils/inputSanitization';
import '../../styles/pages/Auth.css';

const Login = () => {
  const router = useRouter();
  const { login, googleLogin, githubLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [showResendVerification, setShowResendVerification] = useState(false);

  const handleChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: sanitizedValue
    });
    setError('');
    setLockoutTime(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Don't allow login if account is locked
    if (lockoutTime && lockoutTime > 0) {
      return;
    }

    setLoading(true);
    setError('');
    setLockoutTime(null);
    setShowResendVerification(false);
    
    try {
      const result = await login(formData.email, formData.password);
      if (result?.require2fa) {
        toast.info('Please enter your 2FA code');
        router.push('/verify-2fa', { state: { email: result.email || formData.email } });
        return;
      }
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      const errorInfo = handleApiError(err);
      
      // Handle account lockout (HTTP 423)
      if (errorInfo.type === 'LOCKED') {
        setLockoutTime(errorInfo.lockoutTime || 30);
        setError(errorInfo.message);
      }
      // Handle email not verified (HTTP 403 with email message)
      else if (errorInfo.type === 'EMAIL_NOT_VERIFIED') {
        setError(errorInfo.message);
        setShowResendVerification(true);
      }
      // Handle other errors
      else {
        setError(errorInfo.message);
      }
      
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider) => {
    setError('');
    try {
      if (provider === 'google') {
        await signInWithGoogle();
        // signInWithGoogle redirects automatically, so we don't need to do anything else
      } else if (provider === 'github') {
        await signInWithGitHub();
        // signInWithGitHub redirects automatically, so we don't need to do anything else
      }
    } catch (err) {
      const errorMsg = err?.message || `Failed to login with ${provider}`;
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('OAuth error:', err);
    }
  };

  return (
    <div className="login-container">
      {/* Left Column - Form */}
      <div className="login-left">
        <div className="login-form-container">
          <div className="login-logo-header">
            <div className="login-logo-square">
              <span className="login-logo-z">Z</span>
            </div>
            <span className="login-logo-text">Zyndrx</span>
          </div>
          
          <h2 className="login-form-title">Welcome Back</h2>

          {lockoutTime && lockoutTime > 0 && (
            <AccountLockoutMessage
              lockoutTime={lockoutTime}
              onDismiss={() => setLockoutTime(null)}
            />
          )}

          {error && !lockoutTime && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="login-social-buttons">
            <button
              type="button"
              className="login-social-btn"
              onClick={() => handleSocialLogin('google')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.467 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65455 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40681 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65455 3.57955 9 3.57955Z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="login-social-btn"
              onClick={() => handleSocialLogin('github')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <div className="login-divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="login-input"
                required
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password">Password</label>
              <div className="login-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your Password"
                  className="login-input"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="login-forgot-password">
                <Link href="/forgot-password" className="login-forgot-link">
                  forgot password?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              className="login-submit-btn" 
              disabled={loading || (lockoutTime && lockoutTime > 0)}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link href="/signup" className="login-link">
                Sign Up
              </Link>
              {' '}or{' '}
              <Link href="/register" className="login-link">
                Create Workspace
              </Link>
            </p>
          </div>

          <div className="login-terms">
            <p>
              By creating an account, you agree to our{' '}
              <Link href="#terms" className="login-terms-link">Terms of Service</Link>
              {' '}and{' '}
              <Link href="#privacy" className="login-terms-link">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Marketing Content */}
      <div className="login-right">
        <div className="login-right-content">
          <h1 className="login-headline">
            Modern collaboration and workflow management for engineering teams.
          </h1>
          <p className="login-description">
            Unlock seamless productivity and accelerate your development cycles with AI-powered tools designed for high-performing teams.
          </p>
          <div className="login-dashboard-preview">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
