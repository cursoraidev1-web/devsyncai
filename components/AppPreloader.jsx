'use client';

import React from 'react';
import './AppPreloader.css';

/**
 * App Preloader - Premium full-screen loader (message can be custom e.g. "Zyndrx is Coming — Anticipate!")
 */
const AppPreloader = ({
  message = 'Zyndrx is Coming — Anticipate!',
  showProgress = false,
}) => {
  const [headline, subline] = message.includes('—')
    ? message.split('—').map((s) => s.trim())
    : [message, ''];

  return (
    <div className="app-preloader" role="status" aria-live="polite" aria-label="Loading">
      <div className="app-preloader-noise" aria-hidden />
      <div className="app-preloader-content">
        <div className="app-preloader-brand">
          <span className="app-preloader-wordmark">Z</span>
        </div>
        <h1 className="app-preloader-headline">{headline || message}</h1>
        {subline && <p className="app-preloader-subline">{subline}</p>}
        <div className="app-preloader-indicator">
          <div className="app-preloader-ring" aria-hidden />
          {showProgress && <div className="app-preloader-line" aria-hidden />}
        </div>
      </div>
    </div>
  );
};

export default AppPreloader;
