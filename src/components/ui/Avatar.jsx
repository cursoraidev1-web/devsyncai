import React from 'react';
import './Avatar.css';

const Avatar = ({ 
  src,
  alt = '',
  name,
  size = 'md',
  className = '',
  ...props 
}) => {
  const classNames = [
    'ds-avatar',
    `ds-avatar--${size}`,
    className
  ].filter(Boolean).join(' ');

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={classNames} {...props}>
      {src ? (
        <img src={src} alt={alt || name} className="ds-avatar__image" />
      ) : (
        <span className="ds-avatar__initials">{getInitials(name || alt)}</span>
      )}
    </div>
  );
};

export default Avatar;
