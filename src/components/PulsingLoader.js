import React from 'react';
import './PulsingLoader.css';

/**
 * Pulsing dots loader component
 * @param {Object} props
 * @param {string} props.message - Optional message to display
 * @param {boolean} props.fullScreen - If true, renders full screen overlay
 * @param {string} props.color - Color of the pulsing dots (CSS color value)
 */
const PulsingLoader = ({ 
  message = 'Loading...', 
  fullScreen = false,
  color = '#6b46c1'
}) => {
  const containerClass = fullScreen 
    ? 'pulsing-loader-container fullscreen' 
    : 'pulsing-loader-container inline';

  return (
    <div className={containerClass}>
      <div className="pulsing-loader-content">
        <div className="pulsing-dots" style={{ '--dot-color': color }}>
          <div className="pulsing-dot" style={{ animationDelay: '0ms' }} />
          <div className="pulsing-dot" style={{ animationDelay: '200ms' }} />
          <div className="pulsing-dot" style={{ animationDelay: '400ms' }} />
        </div>
        {message && (
          <p className="pulsing-loader-message">{message}</p>
        )}
      </div>
    </div>
  );
};

export default PulsingLoader;


