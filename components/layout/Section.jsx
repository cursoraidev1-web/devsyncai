import React from 'react';
import './Section.css';

const Section = ({ 
  children,
  title,
  spacing = 'lg',
  className = '',
  ...props 
}) => {
  const classNames = [
    'ds-section',
    `ds-section--spacing-${spacing}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={classNames} {...props}>
      {title && <h2 className="ds-section__title">{title}</h2>}
      <div className="ds-section__content">
        {children}
      </div>
    </section>
  );
};

export default Section;
