import React from 'react';
import './Switch.css';

const Switch = ({ 
  checked = false,
  onChange,
  disabled = false,
  label,
  size = 'md',
  className = '',
  ...props 
}) => {
  const classNames = [
    'ds-switch-wrapper',
    className
  ].filter(Boolean).join(' ');

  const switchClassNames = [
    'ds-switch',
    `ds-switch--${size}`,
    checked && 'ds-switch--checked',
    disabled && 'ds-switch--disabled'
  ].filter(Boolean).join(' ');

  return (
    <label className={classNames}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked, e)}
        disabled={disabled}
        className="ds-switch__input"
        {...props}
      />
      <span className={switchClassNames}>
        <span className="ds-switch__slider"></span>
      </span>
      {label && <span className="ds-switch__label">{label}</span>}
    </label>
  );
};

export default Switch;
