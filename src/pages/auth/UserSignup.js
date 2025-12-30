import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { signInWithGoogle, signInWithGitHub } from '../../utils/oauth';
import DashboardPreview from '../../components/DashboardPreview';
import PasswordInput from '../../components/PasswordInput';
import EmailVerificationMessage from '../../components/EmailVerificationMessage';
import RateLimitMessage from '../../components/RateLimitMessage';
import { validatePassword } from '../../utils/passwordValidation';
import { sanitizeInput } from '../../utils/inputSanitization';
import { handleApiError } from '../../utils/errorHandler';
import { resendVerificationEmail } from '../../api/auth';
import './Auth.css';

const UserSignup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [retryAfter, setRetryAfter] = useState(null);

  const handleChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: sanitizedValue
    });
    setError('');
    setRetryAfter(null);
  };

  const handlePasswordChange = (value) => {
    setFormData({
      ...formData,
      password: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields (no workspace name for normal user signup)
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      const errorMsg = 'Please fill in all required fields';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      const errorMsg = passwordValidation.errors[0] || 'Password does not meet requirements';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError('');
    setRetryAfter(null);

    try {
      const registerPayload = {
        email: formData.email.trim(),
        password: formData.password,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        // No workspaceName - normal user signup
      };

      await register(registerPayload);
      
      // Show email verification message instead of auto-login
      setShowVerificationMessage(true);
      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (err) {
      console.error('Registration error details:', err);
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      
      // Handle rate limiting
      if (errorInfo.type === 'RATE_LIMIT') {
        setRetryAfter(errorInfo.retryAfter);
      }
      
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail(formData.email);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast.error(errorInfo.message);
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
      const errorMsg = err?.message || `Failed to sign up with ${provider}`;
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('OAuth error:', err);
    }
  };

  // Show email verification message after successful registration
  if (showVerificationMessage) {
    return (
      <div className="register-container">
        <div className="register-left">
          <div className="register-form-container">
            <div className="register-logo-header">
              <div className="register-logo-square">
                <span className="register-logo-z">Z</span>
              </div>
              <span className="register-logo-text">Zyndrx</span>
            </div>
            <EmailVerificationMessage
              email={formData.email}
              onResend={handleResendVerification}
            />
          </div>
        </div>
        <div className="register-right">
          <div className="register-right-content">
            <h1 className="register-headline">
              Modern collaboration and workflow management for engineering teams.
            </h1>
            <p className="register-description">
              Unlock seamless productivity and accelerate your development cycles with AI-powered tools designed for high-performing teams.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      {/* Left Column - Form */}
      <div className="register-left">
        <div className="register-form-container">
          <div className="register-logo-header">
            <div className="register-logo-square">
              <span className="register-logo-z">Z</span>
            </div>
            <span className="register-logo-text">Zyndrx</span>
          </div>
          
          <h2 className="register-form-title">
            Create Your Account
          </h2>

          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
            Join the platform and get invited to workspaces or create your own later.
          </p>

          {retryAfter && (
            <RateLimitMessage retryAfter={retryAfter} />
          )}

          {error && !retryAfter && (
            <div className="register-error">
              {error}
            </div>
          )}

          <div className="register-social-buttons">
            <button
              type="button"
              className="register-social-btn"
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
              className="register-social-btn"
              onClick={() => handleSocialLogin('github')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <div className="register-divider">
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-form-row">
              <div className="register-input-group">
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="register-input"
                  required
                />
              </div>

              <div className="register-input-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="register-input"
                  required
                />
              </div>
            </div>

            <div className="register-input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="register-input"
                required
              />
            </div>

            <div className="register-input-group">
              <label htmlFor="password">Password</label>
              <PasswordInput
                value={formData.password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                showRequirements={true}
                required
              />
            </div>

            <div className="register-input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <PasswordInput
                value={formData.confirmPassword}
                onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                placeholder="Confirm your password"
                showRequirements={false}
                required
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div className="password-error" style={{ marginTop: '8px', color: '#dc2626', fontSize: '13px' }}>
                  Passwords do not match
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="register-submit-btn" 
              disabled={loading || !!retryAfter}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="register-link">
                Sign In
              </Link>
            </p>
            <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
              Want to create a workspace?{' '}
              <Link to="/register" className="register-link">
                Sign up as admin
              </Link>
            </p>
          </div>

          <div className="register-terms">
            <p>
              By creating an account, you agree to our{' '}
              <Link to="#terms" className="register-terms-link">Terms of Service</Link>
              {' '}and{' '}
              <Link to="#privacy" className="register-terms-link">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Marketing Content */}
      <div className="register-right">
        <div className="register-right-content">
          <h1 className="register-headline">
            Modern collaboration and workflow management for engineering teams.
          </h1>
          <p className="register-description">
            Unlock seamless productivity and accelerate your development cycles with AI-powered tools designed for high-performing teams.
          </p>
          <div className="register-dashboard-preview">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;

