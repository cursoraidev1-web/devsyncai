import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title,
  subtitle,
  actions,
  padding = 'lg',
  noPadding = false,
  className = '',
  ...props 
}) => {
  const classNames = [
    'ds-card',
    noPadding && 'ds-card--no-padding',
    !noPadding && `ds-card--padding-${padding}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {(title || actions) && (
        <div className="ds-card__header">
          <div className="ds-card__header-content">
            {title && <h3 className="ds-card__title">{title}</h3>}
            {subtitle && <p className="ds-card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="ds-card__actions">{actions}</div>}
        </div>
      )}
      <div className="ds-card__content">
        {children}
      </div>
    </div>
  );
};

export default Card;
