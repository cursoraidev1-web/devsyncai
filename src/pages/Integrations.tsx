/**
 * Integrations Page
 * Feature 8: Integrations with external tools and services
 */

import React, { useState } from 'react';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'connected' | 'available' | 'coming-soon';
  icon: string;
}

const Integrations: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'connected'>('all');
  
  const [integrations] = useState<Integration[]>([
    {
      id: 'github',
      name: 'GitHub',
      category: 'Version Control',
      description: 'Sync repositories, pull requests, and commit history',
      status: 'connected',
      icon: '🐙',
    },
    {
      id: 'figma',
      name: 'Figma',
      category: 'Design',
      description: 'Import designs and maintain design system sync',
      status: 'connected',
      icon: '🎨',
    },
    {
      id: 'slack',
      name: 'Slack',
      category: 'Communication',
      description: 'Receive notifications and updates in Slack channels',
      status: 'connected',
      icon: '💬',
    },
    {
      id: 'jira',
      name: 'Jira',
      category: 'Project Management',
      description: 'Import issues and sync project status',
      status: 'available',
      icon: '📊',
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      category: 'Version Control',
      description: 'Alternative Git hosting with CI/CD integration',
      status: 'available',
      icon: '🦊',
    },
    {
      id: 'aws',
      name: 'AWS',
      category: 'Cloud',
      description: 'Deploy and monitor AWS infrastructure',
      status: 'available',
      icon: '☁️',
    },
    {
      id: 'notion',
      name: 'Notion',
      category: 'Documentation',
      description: 'Sync documentation and knowledge base',
      status: 'available',
      icon: '📝',
    },
    {
      id: 'vscode',
      name: 'VS Code',
      category: 'IDE',
      description: 'DevSync extension for VS Code',
      status: 'coming-soon',
      icon: '💻',
    },
  ]);

  const filteredIntegrations = integrations.filter(i => 
    filter === 'all' || i.status === 'connected'
  );

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Integrations</h1>
          <p className="page-subtitle">
            Connect DevSync AI with your favorite tools and services
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-3 mb-4">
          <div className="metric-card">
            <h3 className="metric-label">Connected Integrations</h3>
            <p className="metric-value">{connectedCount}</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Available Integrations</h3>
            <p className="metric-value">{integrations.filter(i => i.status === 'available').length}</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Coming Soon</h3>
            <p className="metric-value">{integrations.filter(i => i.status === 'coming-soon').length}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('all')}
          >
            All Integrations
          </button>
          <button
            className={`btn btn-sm ${filter === 'connected' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('connected')}
          >
            Connected Only
          </button>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-3">
          {filteredIntegrations.map((integration) => (
            <div key={integration.id} className="card">
              <div className="flex align-center gap-3 mb-3">
                <div
                  style={{
                    fontSize: '2.5rem',
                    width: '4rem',
                    height: '4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--color-gray-100)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  {integration.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                    {integration.name}
                  </h3>
                  <span className="badge badge-info">{integration.category}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-lg)' }}>
                {integration.description}
              </p>

              {integration.status === 'connected' && (
                <>
                  <div className="alert alert-success mb-3" style={{ padding: 'var(--spacing-sm)' }}>
                    <strong>✓ Connected</strong> - Syncing data automatically
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-outline" style={{ flex: 1 }}>
                      Configure
                    </button>
                    <button className="btn btn-sm btn-outline">Disconnect</button>
                  </div>
                </>
              )}

              {integration.status === 'available' && (
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  Connect {integration.name}
                </button>
              )}

              {integration.status === 'coming-soon' && (
                <button className="btn btn-outline" style={{ width: '100%' }} disabled>
                  Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Webhooks Section */}
        <div className="card mt-4">
          <h3 className="card-title mb-3">Webhooks & API</h3>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-lg)' }}>
            Configure webhooks for custom integrations and third-party connections
          </p>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>URL</th>
                  <th>Events</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CI/CD Pipeline Webhook</td>
                  <td><code>https://api.example.com/webhook/ci</code></td>
                  <td><span className="badge badge-info">deployment, build</span></td>
                  <td><span className="badge badge-success">Active</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-sm btn-outline">Edit</button>
                      <button className="btn btn-sm btn-outline">Test</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Slack Notifications</td>
                  <td><code>https://hooks.slack.com/services/...</code></td>
                  <td><span className="badge badge-info">alert, handoff</span></td>
                  <td><span className="badge badge-success">Active</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-sm btn-outline">Edit</button>
                      <button className="btn btn-sm btn-outline">Test</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className="btn btn-primary mt-3">
            <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Webhook
          </button>
        </div>

        {/* API Keys Section */}
        <div className="card mt-4">
          <h3 className="card-title mb-3">API Keys</h3>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-lg)' }}>
            Manage API keys for programmatic access to DevSync AI
          </p>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Key</th>
                  <th>Created</th>
                  <th>Last Used</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Production API Key</td>
                  <td><code>sk_live_••••••••••••4f2a</code></td>
                  <td>2025-10-15</td>
                  <td>2 hours ago</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-sm btn-outline">Regenerate</button>
                      <button className="btn btn-sm btn-outline">Revoke</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Development API Key</td>
                  <td><code>sk_test_••••••••••••8b9c</code></td>
                  <td>2025-11-01</td>
                  <td>1 day ago</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-sm btn-outline">Regenerate</button>
                      <button className="btn btn-sm btn-outline">Revoke</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className="btn btn-primary mt-3">
            <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Generate New API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
