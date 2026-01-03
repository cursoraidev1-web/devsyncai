'use client';

import React from 'react';
import './AppPreloader.css';

/**
 * App Preloader - Shows during initial app load and data fetching
 * @param {Object} props
 * @param {string} props.message - Optional custom loading message
 * @param {boolean} props.showProgress - Whether to show progress indicator
 */
const AppPreloader = ({ 
  message = 'Loading Zyndrx...',
  showProgress = false 
}) => {
  return (
    <div className="app-preloader">
      <div className="app-preloader-content">
        {/* Logo/Brand */}
        <div className="app-preloader-logo">
          <div className="app-preloader-logo-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="8" fill="url(#gradient)" />
              <path
                d="M24 16L32 24L24 32M16 24H32"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Spinner */}
        <div className="app-preloader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>

        {/* Message */}
        {message && (
          <p className="app-preloader-message">{message}</p>
        )}

        {/* Progress dots */}
        {showProgress && (
          <div className="app-preloader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppPreloader;



