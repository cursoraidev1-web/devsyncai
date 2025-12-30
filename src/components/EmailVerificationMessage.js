import React, { useState } from 'react';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EmailVerificationMessage.css';

/**
 * Email Verification Message Component
 * Shown after registration to prompt email verification
 */
const EmailVerificationMessage = ({ email, onResend }) => {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    if (resendLoading) return;
    
    setResendLoading(true);
    try {
      if (onResend) {
        await onResend();
      }
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="email-verification-message">
      <div className="verification-icon">
        <Mail size={48} />
      </div>
      <h2 className="verification-title">Check Your Email</h2>
      <p className="verification-description">
        We've sent a verification email to <strong>{email}</strong>.
        Please click the link in the email to verify your account before logging in.
      </p>
      
      <div className="verification-actions">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading || resendSuccess}
          className="btn-resend"
        >
          {resendLoading ? (
            <>
              <RefreshCw size={16} className="spinning" />
              Sending...
            </>
          ) : resendSuccess ? (
            <>
              <CheckCircle size={16} />
              Email Sent!
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Resend Verification Email
            </>
          )}
        </button>
      </div>

      <div className="verification-help">
        <p className="help-text">
          <strong>Didn't receive the email?</strong>
        </p>
        <ul className="help-list">
          <li>Check your spam or junk folder</li>
          <li>Make sure you entered the correct email address</li>
          <li>Wait a few minutes and try resending</li>
        </ul>
      </div>

      <div className="verification-footer">
        <Link to="/login" className="btn-go-to-login">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default EmailVerificationMessage;



