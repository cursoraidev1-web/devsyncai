'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { Search, Check, X, Settings, ExternalLink, Github, Slack, CheckSquare, Palette, List, Zap } from 'lucide-react';
import { fetchIntegrations, connectIntegration, disconnectIntegration, getIntegrationConfig, updateIntegrationConfig } from '../../../services/api/integrations';
import { useApp } from '../../../context/AppContext';
import { toast } from 'react-toastify';
import '../../../styles/pages/Integrations.css';

const availableIntegrationsCatalog = [
  { id: 'github', name: 'GitHub', description: 'Connect your GitHub repositories to sync commits, pull requests, and issues.', icon: Github, category: 'Development', color: '#181717' },
  { id: 'slack', name: 'Slack', description: 'Get notifications and updates directly in your Slack workspace.', icon: Slack, category: 'Communication', color: '#4A154B' },
  { id: 'jira', name: 'Jira', description: 'Sync tasks and issues between ZynDrx and Jira.', icon: CheckSquare, category: 'Project Management', color: '#0052CC' },
  { id: 'figma', name: 'Figma', description: 'Import designs and assets directly from Figma.', icon: Palette, category: 'Design', color: '#F24E1E' },
  { id: 'linear', name: 'Linear', description: 'Sync issues and tasks with Linear.', icon: List, category: 'Project Management', color: '#5E6AD2' },
  { id: 'zapier', name: 'Zapier', description: 'Connect ZynDrx with 5000+ apps via Zapier.', icon: Zap, category: 'Automation', color: '#FF4A00' },
];

const mapApiToFrontend = (apiIntegration) => {
  const catalogItem = availableIntegrationsCatalog.find(
    item =>
      item.id === apiIntegration.type ||
      item.id === apiIntegration.id ||
      item.name?.toLowerCase() === apiIntegration.name?.toLowerCase()
  );
  return {
    ...(catalogItem || {
      id: apiIntegration.type || apiIntegration.id,
      name: apiIntegration.name,
      description: apiIntegration.description,
      category: apiIntegration.category,
      icon: Github,
      color: '#718096',
    }),
    connected: apiIntegration.connected || false,
    integration_id: apiIntegration.integration_id,
    connected_at: apiIntegration.connected_at,
    last_sync_at: apiIntegration.last_sync_at,
    config: apiIntegration.config || {},
    is_active: apiIntegration.is_active ?? true,
  };
};

const Integrations = () => {
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [disconnecting, setDisconnecting] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(null);

  const refreshIntegrations = async () => {
    const data = await fetchIntegrations();
    if (Array.isArray(data) && data.length > 0) {
      setIntegrations(data.map(mapApiToFrontend));
    } else {
      setIntegrations(availableIntegrationsCatalog.map(i => ({ ...i, connected: false })));
    }
  };

  useEffect(() => {
    const loadIntegrations = async () => {
      try {
        await refreshIntegrations();
      } catch (error) {
        console.error('Failed to load integrations:', error);
        toast.error('Failed to load integrations');
        setIntegrations(availableIntegrationsCatalog.map(i => ({ ...i, connected: false })));
      } finally {
        setLoading(false);
      }
    };
    loadIntegrations();
  }, []);

  const handleConnect = async (integration) => {
    setConnecting(integration.id);
    try {
      await connectIntegration(integration.id, {});
      toast.success(`${integration.name} connected successfully!`);
      await refreshIntegrations();
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message || 'Failed to connect integration');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (integration) => {
    if (!window.confirm(`Are you sure you want to disconnect ${integration.name}?`)) return;
    setDisconnecting(integration.integration_id || integration.id);
    try {
      await disconnectIntegration(integration.integration_id || integration.id);
      toast.success(`${integration.name} disconnected successfully!`);
      await refreshIntegrations();
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message || 'Failed to disconnect integration');
    } finally {
      setDisconnecting(null);
    }
  };

  const filteredIntegrations = integrations.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const connectedIntegrations = integrations.filter(i => i.connected);
  const availableIntegrations = integrations.filter(i => !i.connected);

  if (loading) {
    return (
      <div className="integrations-page">
        <div className="integrations-header">
          <div>
            <h1>Integrations</h1>
            <p className="integrations-subtitle">Connect your favorite tools and services to enhance your workflow.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="integrations-page">
      <div className="integrations-header">
        <div>
          <h1>Integrations</h1>
          <p className="integrations-subtitle">Connect your favorite tools and services to enhance your workflow.</p>
        </div>
      </div>

      <div className="integrations-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {connectedIntegrations.length > 0 && (
        <div className="integrations-section">
          <h2 className="integrations-section-title">Connected ({connectedIntegrations.length})</h2>
          <div className="integrations-grid">
            {connectedIntegrations
              .filter(i => filteredIntegrations.includes(i))
              .map(integration => {
                const Icon = integration.icon;
                return (
                  <div key={integration.id} className="integration-card connected">
                    <div className="integration-card-header">
                      <div className="integration-icon" style={{ backgroundColor: `${integration.color}15` }}>
                        <Icon size={24} style={{ color: integration.color }} />
                      </div>
                      <div className="integration-status">
                        <Check size={16} className="status-check" />
                        <span>Connected</span>
                      </div>
                    </div>
                    <h3 className="integration-name">{integration.name}</h3>
                    <p className="integration-description">{integration.description}</p>
                    <div className="integration-category">{integration.category}</div>
                    <div className="integration-actions">
                      <button
                        className="integration-action-btn"
                        onClick={() => setShowConfigModal(integration)}
                      >
                        <Settings size={16} />
                        Configure
                      </button>
                      <button
                        className="integration-action-btn danger"
                        onClick={() => handleDisconnect(integration)}
                        disabled={disconnecting === (integration.integration_id || integration.id)}
                      >
                        {disconnecting === (integration.integration_id || integration.id) ? (
                          'Disconnecting...'
                        ) : (
                          <>
                            <X size={16} />
                            Disconnect
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="integrations-section">
        <h2 className="integrations-section-title">Available ({availableIntegrations.length})</h2>
        <div className="integrations-grid">
          {availableIntegrations
            .filter(i => filteredIntegrations.includes(i))
            .map(integration => {
              const Icon = integration.icon;
              return (
                <div key={integration.id} className="integration-card">
                  <div className="integration-card-header">
                    <div className="integration-icon" style={{ backgroundColor: `${integration.color}15` }}>
                      <Icon size={24} style={{ color: integration.color }} />
                    </div>
                  </div>
                  <h3 className="integration-name">{integration.name}</h3>
                  <p className="integration-description">{integration.description}</p>
                  <div className="integration-category">{integration.category}</div>
                  <button
                    className="integration-connect-btn"
                    onClick={() => handleConnect(integration)}
                    disabled={connecting === integration.id}
                  >
                    {connecting === integration.id ? (
                      'Connecting...'
                    ) : (
                      <>
                        <ExternalLink size={16} />
                        Connect
                      </>
                    )}
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="integrations-empty">
          <p>No integrations found matching your search.</p>
        </div>
      )}

      {/* Configure Integration Modal */}
      {showConfigModal && (
        <IntegrationConfigModal
          integration={showConfigModal}
          onClose={() => setShowConfigModal(null)}
          onSave={async (config) => {
            try {
              await updateIntegrationConfig(showConfigModal.integration_id || showConfigModal.id, config);
              toast.success(`${showConfigModal.name} configuration saved!`);
              setShowConfigModal(null);
            } catch (error) {
              toast.error(error?.message || 'Failed to save configuration');
            }
          }}
        />
      )}
    </div>
  );
};

/** Configure Integration Modal */
const IntegrationConfigModal = ({ integration, onClose, onSave }) => {
  const Icon = integration.icon;
  const [config, setConfig] = useState(integration.config || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(config);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: `${integration.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={22} style={{ color: integration.color }} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px' }}>{integration.name} Configuration</h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{integration.category}</p>
          </div>
        </div>

        {integration.connected_at && (
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
            Connected on {new Date(integration.connected_at).toLocaleDateString()}
            {integration.last_sync_at && ` · Last synced ${new Date(integration.last_sync_at).toLocaleDateString()}`}
          </p>
        )}

        {Object.keys(config).length > 0 ? (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Configuration</h3>
            {Object.entries(config).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px', textTransform: 'capitalize' }}>
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px', background: '#f9fafb', borderRadius: '8px', marginBottom: '24px' }}>
            <Settings size={32} style={{ color: '#9ca3af', marginBottom: '8px' }} />
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>No configuration options available for {integration.name}.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="modal-btn-cancel" onClick={onClose} disabled={saving}>
            Close
          </button>
          {Object.keys(config).length > 0 && (
            <button className="modal-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
