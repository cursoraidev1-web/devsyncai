import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './Auth.css';

const ResetPasswordSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="reset-password-success-container">
      <div className="reset-password-success-card">
        <div className="reset-password-success-icon">
          <CheckCircle size={48} />
        </div>
        <h1 className="reset-password-success-title">Password Reset Successfully</h1>
        <p className="reset-password-success-description">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <button 
          className="reset-password-success-btn"
          onClick={() => navigate('/login')}
        >
          Continue to Sign In
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;


