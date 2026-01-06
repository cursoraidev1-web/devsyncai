import React from 'react';
import Image from 'next/image';

/**
 * Reusable Logo Component
 * Uses the logo.svg from public folder
 */
const Logo = ({ 
  width = 40, 
  height = 40, 
  className = '',
  showText = false,
  textClassName = '',
  textColor = '#111827',
  priority = false 
}) => {
  return (
    <div className={`logo-wrapper ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Image
        src="/logo.svg"
        alt="Zyndrx Logo"
        width={width}
        height={height}
        priority={priority}
        className="logo-icon"
      />
      {showText && (
        <span className={`logo-text ${textClassName}`} style={{ 
          fontSize: '24px', 
          fontWeight: 700, 
          color: textColor 
        }}>
          Zyndrx
        </span>
      )}
    </div>
  );
};

export default Logo;



