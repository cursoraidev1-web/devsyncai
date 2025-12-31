import React from 'react';
import './PageHeader.css';

const PageHeader = ({ 
  title, 
  subtitle,
  breadcrumbs,
  actions,
  className = '',
  ...props 
}) => {
  return (
    <div className={`ds-page-header ${className}`} {...props}>
      <div className="ds-page-header__content">
        {breadcrumbs && (
          <div className="ds-page-header__breadcrumbs">
            {breadcrumbs}
          </div>
        )}
        <div className="ds-page-header__text">
          <h1 className="ds-page-header__title">{title}</h1>
          {subtitle && <p className="ds-page-header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="ds-page-header__actions">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
