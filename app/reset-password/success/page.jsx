'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../../../components/Logo';
import './success.css';

const ResetPasswordSuccess = () => {
  const router = useRouter();

  return (
    <div className="reset-success-container">
      <div className="reset-success-card">
        {/* Logo */}
        <div className="reset-success-logo">
          <Logo width={40} height={40} showText={true} priority={true} />
        </div>

        {/* Success Icon - Shield with Lock */}
        <div className="success-icon-wrapper">
          <svg className="success-shield" width="160" height="180" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Back shield - gray */}
            <path d="M40 30L80 10L120 30V90C120 120 100 150 80 170C60 150 40 120 40 90V30Z" fill="#E5E7EB" opacity="0.5"/>
            {/* Main shield - green */}
            <path d="M50 40L80 20L110 40V95C110 122 92 145 80 160C68 145 50 122 50 95V40Z" fill="#10B981"/>
            {/* Lock icon */}
            <g transform="translate(65, 70)">
              {/* Lock body */}
              <rect x="0" y="15" width="30" height="25" rx="3" fill="white"/>
              {/* Lock shackle */}
              <path d="M8 15V10C8 5.58172 11.5817 2 16 2V2C20.4183 2 24 5.58172 24 10V15" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
              {/* Keyhole */}
              <circle cx="15" cy="27" r="3" fill="#10B981"/>
              <rect x="13.5" y="27" width="3" height="5" fill="#10B981"/>
            </g>
          </svg>
        </div>

        {/* Success Message */}
        <div className="reset-success-content">
          <h1>Password Reset Successful</h1>
          <p>Your password has been updated. you can now sign in with your new password</p>
        </div>

        {/* Continue Button */}
        <button
          className="continue-btn"
          onClick={() => router.push('/login')}
        >
          Continue to sign in
        </button>

        {/* Footer Links */}
        <div className="reset-success-footer">
          <a href="/terms" className="footer-link">Terms of Service</a>
          <span> and </span>
          <a href="/privacy" className="footer-link">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;

