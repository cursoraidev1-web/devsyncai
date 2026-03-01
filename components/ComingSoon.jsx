'use client';

import React, { useEffect } from 'react';
import './ComingSoon.css';

export default function ComingSoon() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="coming-soon-overlay">
      <div className="coming-soon-card">
        <div className="icon-pulse-container">
          <div className="pulse-ring" />
          <div className="pulse-ring pulse-ring--delay" />
          <div className="icon-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        </div>

        <div className="status-badge">STATUS: IN DEVELOPMENT</div>

        <h1 className="coming-soon-title">Coming Soon.</h1>
        <p className="coming-soon-subtext">
          We are putting the final polish on this space. Check back shortly.
        </p>

        <button
          type="button"
          className="btn-return"
          onClick={() => window.history.back()}
        >
          Return to previous page
        </button>
      </div>
    </div>
  );
}
