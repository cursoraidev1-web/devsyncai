import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import './Auth.css';

const VerifyEmail = () => {
  const userEmail = 'user@example.com'; // This would come from route params or state

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <div className="verify-email-header">
          <div className="verify-email-logo">ZynDrx</div>
          <div className="verify-email-icon">
            <Mail size={64} />
          </div>
          <h1 className="verify-email-title">Verify Your Email</h1>
          <p className="verify-email-description">
            We've sent a verification link to your email address.
          </p>
          <p className="verify-email-address">{userEmail}</p>
        </div>

        <button className="verify-email-resend-btn">
          Resend Verification Email
        </button>

        <div className="verify-email-footer">
          <Link to="/login" className="verify-email-link">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;


