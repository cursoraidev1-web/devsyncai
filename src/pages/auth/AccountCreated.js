import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './Auth.css';

const AccountCreated = () => {
  const navigate = useNavigate();

  return (
    <div className="account-created-container">
      <div className="account-created-card">
        <div className="account-created-icon">
          <div className="account-created-icon-circle">
            <CheckCircle size={32} />
          </div>
        </div>
        <h1 className="account-created-title">Account Created Successfully</h1>
        <p className="account-created-description">
          Your ZynDrx account is ready. You may need to verify your email before signing in.
        </p>
        <button 
          className="account-created-continue-btn"
          onClick={() => navigate('/login')}
        >
          Continue
        </button>
        <Link to="/login" className="account-created-link">
          Go to Sign In
        </Link>
      </div>
    </div>
  );
};

export default AccountCreated;


