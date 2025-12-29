import React from 'react';
import './LoadingSpinner.css';

/**
 * Reusable loading spinner component
 * @param {Object} props
 * @param {'small'|'medium'|'large'} props.size - Size of the spinner
 * @param {string} props.message - Optional message to display
 * @param {boolean} props.fullScreen - If true, renders full screen overlay
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const containerClass = fullScreen 
    ? 'loading-spinner-container fullscreen' 
    : 'loading-spinner-container inline';

  return (
    <div className={containerClass}>
      <div className="loading-spinner-content">
        <div className={`loading-spinner ${sizeClasses[size]}`} />
        {message && (
          <p className="loading-spinner-message">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;


