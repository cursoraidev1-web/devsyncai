import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { Building2, ChevronDown, Check, Plus } from 'lucide-react';
import { Modal } from './ui';
import { toast } from 'react-toastify';
import './CompanySwitcher.css';

const CompanySwitcher = () => {
  const { currentCompany, companies, switchCompany, createCompany, loading } = useCompany();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
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
    setShowCreateModal(true);
  };

  const handleCreateWorkspaceSubmit = async () => {
    if (!workspaceName.trim()) {
      toast.error('Workspace name is required');
      return;
    }

    setCreating(true);
    try {
      // Prepare payload - ensure we only send defined fields
      const payload = {
        name: workspaceName.trim()
      };
      
      // Only include description if it's not empty
      if (workspaceDescription.trim()) {
        payload.description = workspaceDescription.trim();
      }
      
      await createCompany(payload);
      toast.success('Workspace created successfully!');
      setShowCreateModal(false);
      setWorkspaceName('');
      setWorkspaceDescription('');
      // The switchCompany in createCompany will reload the page automatically
    } catch (error) {
      console.error('Failed to create workspace:', error);
      // Extract error message from various formats
      let errorMessage = 'Failed to create workspace';
      if (error?.response?.data) {
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      } else if (error?.data) {
        errorMessage = error.data.error || error.data.message || errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setCreating(false);
    }
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

      {/* Create Workspace Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          if (!creating) {
            setShowCreateModal(false);
            setWorkspaceName('');
            setWorkspaceDescription('');
          }
        }}
        title="Create New Workspace"
        size="md"
        footer={
          <>
            <button
              className="modal-btn-cancel"
              onClick={() => {
                if (!creating) {
                  setShowCreateModal(false);
                  setWorkspaceName('');
                  setWorkspaceDescription('');
                }
              }}
              disabled={creating}
            >
              Cancel
            </button>
            <button
              className="modal-btn-primary"
              onClick={handleCreateWorkspaceSubmit}
              disabled={creating || !workspaceName.trim()}
            >
              {creating ? 'Creating...' : 'Create Workspace'}
            </button>
          </>
        }
      >
        <div className="create-workspace-form">
          <div className="input-group">
            <label htmlFor="workspace-name">
              Workspace Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="workspace-name"
              type="text"
              placeholder="e.g., Acme Inc."
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              disabled={creating}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && workspaceName.trim() && !creating) {
                  handleCreateWorkspaceSubmit();
                }
              }}
            />
            <p className="help-text">This will be the name of your workspace</p>
          </div>

          <div className="input-group">
            <label htmlFor="workspace-description">Description (Optional)</label>
            <textarea
              id="workspace-description"
              rows={3}
              placeholder="Brief description of your workspace..."
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              disabled={creating}
            />
            <p className="help-text">A short description to help identify this workspace</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanySwitcher;










