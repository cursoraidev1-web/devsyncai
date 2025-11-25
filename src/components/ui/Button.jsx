import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const classNames = [
    'ds-button',
    `ds-button--${variant}`,
    `ds-button--${size}`,
    fullWidth && 'ds-button--full-width',
    disabled && 'ds-button--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="ds-button__icon">{icon}</span>}
      {children && <span className="ds-button__text">{children}</span>}
      {icon && iconPosition === 'right' && <span className="ds-button__icon">{icon}</span>}
    </button>
  );
};

export default Button;
