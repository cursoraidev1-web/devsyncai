import React from 'react';
import './ContentContainer.css';

const ContentContainer = ({ 
  children,
  maxWidth = '1440px',
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`ds-content-container ${className}`} 
      style={{ maxWidth }}
      {...props}
    >
      {children}
    </div>
  );
};

export default ContentContainer;
