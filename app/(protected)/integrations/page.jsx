'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { Search, Check, X, Settings, ExternalLink, Github, Slack, CheckSquare, Palette, List, Zap } from 'lucide-react';
import { fetchIntegrations, connectIntegration, disconnectIntegration, getIntegrationConfig, updateIntegrationConfig } from '../../../api/integrations';
import { useApp } from '../../../context/AppContext';
import { toast } from 'react-toastify';
import '../../../styles/pages/Integrations.css';

const Integrations = () => {
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [disconnecting, setDisconnecting] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(null);

  // Available integrations catalog (not connected by default)
  const availableIntegrationsCatalog = [
    {
      id: 1,
      name: 'GitHub',
      description: 'Connect your GitHub repositories to sync commits, pull requests, and issues.',
      icon: Github,
      category: 'Development',
      color: '#181717'
    },
    {
      id: 2,
      name: 'Slack',
      description: 'Get notifications and updates directly in your Slack workspace.',
      icon: Slack,
      category: 'Communication',
      color: '#4A154B'
    },
    {
      id: 3,
      name: 'Jira',
      description: 'Sync tasks and issues between ZynDrx and Jira.',
      icon: CheckSquare,
      category: 'Project Management',
      color: '#0052CC'
    },
    {
      id: 4,
      name: 'Figma',
      description: 'Import designs and assets directly from Figma.',
      icon: Palette,
      category: 'Design',
      color: '#F24E1E'
    },
    {
      id: 5,
      name: 'Linear',
      description: 'Sync issues and tasks with Linear.',
      icon: List,
      category: 'Project Management',
      color: '#5E6AD2'
    },
    {
      id: 6,
      name: 'Zapier',
      description: 'Connect ZynDrx with 5000+ apps via Zapier.',
      icon: Zap,
      category: 'Automation',
      color: '#FF4A00'
    }
  ];

  // Load integrations from API
  useEffect(() => {
    const loadIntegrations = async () => {
      try {
        const data = await fetchIntegrations();
        if (Array.isArray(data) && data.length > 0) {
          // Map API data to frontend format
          const mappedIntegrations = data.map(apiIntegration => {
            const catalogItem = availableIntegrationsCatalog.find(
              item => item.id === apiIntegration.id || item.name.toLowerCase() === apiIntegration.name?.toLowerCase()
            );
            return {
              ...(catalogItem || {
                id: apiIntegration.id || apiIntegration.type,
                name: apiIntegration.name,
                description: apiIntegration.description,
                category: apiIntegration.category,
                icon: Github, // Default icon
                color: '#718096'
              }),
              connected: apiIntegration.connected || false,
              integration_id: apiIntegration.integration_id,
              connected_at: apiIntegration.connected_at,
              last_sync_at: apiIntegration.last_sync_at,
              config: apiIntegration.config || {},
              is_active: apiIntegration.is_active ?? true
            };
          });
          setIntegrations(mappedIntegrations);
        } else {
          // Use default catalog if no integrations from API
          setIntegrations(availableIntegrationsCatalog.map(integration => ({
            ...integration,
            connected: false
          })));
        }
      } catch (error) {
        console.error('Failed to load integrations:', error);
        toast.error('Failed to load integrations');
        // Use default catalog on error
        setIntegrations(availableIntegrationsCatalog.map(integration => ({
          ...integration,
          connected: false
        })));
      } finally {
        setLoading(false);
      }
    };
    loadIntegrations();
  }, []);

  const handleConnect = async (integration) => {
    setConnecting(integration.id);
    try {
      const result = await connectIntegration(integration.id, {
        // Add any initial config here
      });
      toast.success(`${integration.name} connected successfully!`);
      // Reload integrations
      const data = await fetchIntegrations();
      if (Array.isArray(data) && data.length > 0) {
        const mappedIntegrations = data.map(apiIntegration => {
          const catalogItem = availableIntegrationsCatalog.find(
            item => item.id === apiIntegration.id || item.name.toLowerCase() === apiIntegration.name?.toLowerCase()
          );
          return {
            ...(catalogItem || {
              id: apiIntegration.id || apiIntegration.type,
              name: apiIntegration.name,
              description: apiIntegration.description,
              category: apiIntegration.category,
              icon: Github,
              color: '#718096'
            }),
            connected: apiIntegration.connected || false,
            integration_id: apiIntegration.integration_id,
            config: apiIntegration.config || {}
          };
        });
        setIntegrations(mappedIntegrations);
      }
    } catch (error) {
      console.error('Failed to connect integration:', error);
      toast.error(error?.response?.data?.error || error?.message || 'Failed to connect integration');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (integration) => {
    if (!window.confirm(`Are you sure you want to disconnect ${integration.name}?`)) {
      return;
    }
    setDisconnecting(integration.integration_id || integration.id);
    try {
      await disconnectIntegration(integration.integration_id || integration.id);
      toast.success(`${integration.name} disconnected successfully!`);
      // Reload integrations
      const data = await fetchIntegrations();
      if (Array.isArray(data) && data.length > 0) {
        const mappedIntegrations = data.map(apiIntegration => {
          const catalogItem = availableIntegrationsCatalog.find(
            item => item.id === apiIntegration.id || item.name.toLowerCase() === apiIntegration.name?.toLowerCase()
          );
          return {
            ...(catalogItem || {
              id: apiIntegration.id || apiIntegration.type,
              name: apiIntegration.name,
              description: apiIntegration.description,
              category: apiIntegration.category,
              icon: Github,
              color: '#718096'
            }),
            connected: apiIntegration.connected || false,
            integration_id: apiIntegration.integration_id,
            config: apiIntegration.config || {}
          };
        });
        setIntegrations(mappedIntegrations);
      }
    } catch (error) {
      console.error('Failed to disconnect integration:', error);
      toast.error(error?.response?.data?.error || error?.message || 'Failed to disconnect integration');
    } finally {
      setDisconnecting(null);
    }
  };

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.category.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h2 className="integrations-section-title">
          Available ({availableIntegrations.length})
        </h2>
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
    </div>
  );
};

export default Integrations;

