import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { Building2, ChevronDown, Check, Plus } from 'lucide-react';
import './CompanySwitcher.css';

const CompanySwitcher = () => {
  const { currentCompany, companies, switchCompany, loading } = useCompany();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (loading) {
    return (
      <div className="company-switcher-button">
        <Building2 size={16} />
        <span>Loading...</span>
      </div>
    );
  }

  if (!currentCompany) {
    return null;
  }

  const handleSwitch = async (companyId) => {
    if (companyId === currentCompany.id) {
      setIsOpen(false);
      return;
    }

    try {
      await switchCompany(companyId);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch company:', error);
    }
  };

  const handleCreateWorkspace = () => {
    setIsOpen(false);
    navigate('/register');
  };

  return (
    <div className="company-switcher" ref={dropdownRef}>
      <button
        className="company-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch workspace"
      >
        <Building2 size={16} />
        <span className="company-switcher-name">{currentCompany.name}</span>
        <ChevronDown size={16} className={`company-switcher-chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="company-switcher-backdrop" onClick={() => setIsOpen(false)} />
          <div className="company-switcher-dropdown">
            <div className="company-switcher-header">
              <span>Workspaces</span>
            </div>
            <div className="company-switcher-list">
              {companies.map((company) => (
                <button
                  key={company.id}
                  className={`company-switcher-item ${company.id === currentCompany.id ? 'active' : ''}`}
                  onClick={() => handleSwitch(company.id)}
                >
                  <div className="company-switcher-item-content">
                    <Building2 size={16} />
                    <span>{company.name}</span>
                  </div>
                  {company.id === currentCompany.id && (
                    <Check size={16} className="company-switcher-check" />
                  )}
                </button>
              ))}
            </div>
            <div className="company-switcher-footer">
              <button
                className="company-switcher-create"
                onClick={handleCreateWorkspace}
              >
                <Plus size={16} />
                <span>Create Workspace</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompanySwitcher;










