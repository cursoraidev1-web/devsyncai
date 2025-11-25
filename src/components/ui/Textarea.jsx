import React from 'react';
import './Textarea.css';

const Textarea = ({ 
  label,
  error,
  helperText,
  rows = 4,
  fullWidth = true,
  className = '',
  required = false,
  ...props 
}) => {
  const textareaClassNames = [
    'ds-textarea',
    error && 'ds-textarea--error',
    fullWidth && 'ds-textarea--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`ds-textarea-wrapper ${fullWidth ? 'ds-textarea-wrapper--full-width' : ''}`}>
      {label && (
        <label className="ds-textarea-label">
          {label}
          {required && <span className="ds-textarea-required">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={textareaClassNames}
        {...props}
      />
      {error && <span className="ds-textarea-error">{error}</span>}
      {helperText && !error && <span className="ds-textarea-helper">{helperText}</span>}
    </div>
  );
};

export default Textarea;
