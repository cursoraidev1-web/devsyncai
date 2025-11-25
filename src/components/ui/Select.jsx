import React from 'react';
import './Select.css';

const Select = ({ 
  label,
  error,
  helperText,
  size = 'md',
  fullWidth = true,
  className = '',
  required = false,
  children,
  ...props 
}) => {
  const selectClassNames = [
    'ds-select',
    `ds-select--${size}`,
    error && 'ds-select--error',
    fullWidth && 'ds-select--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`ds-select-wrapper ${fullWidth ? 'ds-select-wrapper--full-width' : ''}`}>
      {label && (
        <label className="ds-select-label">
          {label}
          {required && <span className="ds-select-required">*</span>}
        </label>
      )}
      <select className={selectClassNames} {...props}>
        {children}
      </select>
      {error && <span className="ds-select-error">{error}</span>}
      {helperText && !error && <span className="ds-select-helper">{helperText}</span>}
    </div>
  );
};

export default Select;
