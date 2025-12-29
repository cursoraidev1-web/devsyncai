import React, { useState } from 'react';
import { useCompany } from '../context/CompanyContext';
import { Building2, ChevronDown, Check } from 'lucide-react';
import './CompanySwitcher.css';

const CompanySwitcher = () => {
  const { currentCompany, companies, switchCompany, loading } = useCompany();
  const [isOpen, setIsOpen] = useState(false);

  if (loading || !currentCompany) {
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

  // Don't show switcher if user only has one company
  if (companies.length <= 1) {
    return (
      <div className="company-switcher-single">
        <Building2 size={16} />
        <span>{currentCompany.name}</span>
      </div>
    );
  }

  return (
    <div className="company-switcher">
      <button
        className="company-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch company"
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
              <span>Switch Workspace</span>
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
          </div>
        </>
      )}
    </div>
  );
};

export default CompanySwitcher;








