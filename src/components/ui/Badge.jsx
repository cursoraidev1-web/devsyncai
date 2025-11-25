import React from 'react';
import './Badge.css';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props 
}) => {
  const classNames = [
    'ds-badge',
    `ds-badge--${variant}`,
    `ds-badge--${size}`,
    dot && 'ds-badge--dot',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...props}>
      {dot && <span className="ds-badge__dot"></span>}
      {children}
    </span>
  );
};

export default Badge;
