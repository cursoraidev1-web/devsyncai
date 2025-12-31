import React from 'react';
import './Input.css';

const Input = ({ 
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  type = 'text',
  size = 'md',
  fullWidth = true,
  className = '',
  required = false,
  ...props 
}) => {
  const inputClassNames = [
    'ds-input',
    `ds-input--${size}`,
    icon && `ds-input--with-icon-${iconPosition}`,
    error && 'ds-input--error',
    fullWidth && 'ds-input--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`ds-input-wrapper ${fullWidth ? 'ds-input-wrapper--full-width' : ''}`}>
      {label && (
        <label className="ds-input-label">
          {label}
          {required && <span className="ds-input-required">*</span>}
        </label>
      )}
      <div className="ds-input-container">
        {icon && iconPosition === 'left' && (
          <span className="ds-input-icon ds-input-icon--left">{icon}</span>
        )}
        <input
          type={type}
          className={inputClassNames}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="ds-input-icon ds-input-icon--right">{icon}</span>
        )}
      </div>
      {error && <span className="ds-input-error">{error}</span>}
      {helperText && !error && <span className="ds-input-helper">{helperText}</span>}
    </div>
  );
};

export default Input;
