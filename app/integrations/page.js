'use client';

import React, { useState, useEffect } from 'react';
import { Search, Check, X, Settings, ExternalLink, Github, Slack, CheckSquare, Palette, List, Zap } from 'lucide-react';
import { fetchIntegrations, connectIntegration, disconnectIntegration } from '../../api/integrations';
import { toast } from 'react-toastify';
import '../../styles/pages/Integrations.css';

const Integrations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setIntegrations(data);
        } else {
          // Use default catalog if no integrations from API
          setIntegrations(availableIntegrationsCatalog.map(integration => ({
            ...integration,
            connected: false
          })));
        }
      } catch (error) {
        console.error('Failed to load integrations:', error);
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
                      <button className="integration-action-btn">
                        <Settings size={16} />
                        Configure
                      </button>
                      <button className="integration-action-btn danger">
                        <X size={16} />
                        Disconnect
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
                  <button className="integration-connect-btn">
                    <ExternalLink size={16} />
                    Connect
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

