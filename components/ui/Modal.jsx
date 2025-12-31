import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

const Modal = ({ 
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  className = '',
  ...props 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ds-modal-overlay" onClick={onClose}>
      <div 
        className={`ds-modal ds-modal--${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {/* Header */}
        <div className="ds-modal__header">
          <div className="ds-modal__header-content">
            <h3 className="ds-modal__title">{title}</h3>
            {subtitle && <p className="ds-modal__subtitle">{subtitle}</p>}
          </div>
          <button 
            className="ds-modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="ds-modal__body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="ds-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
