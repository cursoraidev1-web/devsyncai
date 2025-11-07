/**
 * Security Dashboard Page
 * Feature 9: Security and Compliance Layer with AI audit assistant
 */

import React, { useState } from 'react';

interface SecurityIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affected: string;
  detectedAt: string;
  status: 'open' | 'in-progress' | 'resolved';
}

const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [issues] = useState<SecurityIssue[]>([
    {
      id: '1',
      severity: 'high',
      title: 'SQL Injection Vulnerability',
      description: 'User input in search endpoint not properly sanitized',
      affected: '/api/search endpoint',
      detectedAt: '2 hours ago',
      status: 'in-progress',
    },
    {
      id: '2',
      severity: 'medium',
      title: 'Outdated Dependency: lodash@4.17.15',
      description: 'Known security vulnerability in lodash version',
      affected: 'package.json',
      detectedAt: '1 day ago',
      status: 'open',
    },
    {
      id: '3',
      severity: 'critical',
      title: 'Exposed API Keys in Repository',
      description: 'AWS credentials found in .env file committed to git',
      affected: '.env file (commit a3f5c9d)',
      detectedAt: '3 days ago',
      status: 'resolved',
    },
  ]);

  const getSeverityColor = (severity: SecurityIssue['severity']) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Security & Compliance</h1>
          <p className="page-subtitle">
            Automated security audits and compliance monitoring
          </p>
        </div>

        {/* Security Score Overview */}
        <div className="grid grid-4 mb-4">
          <div className="metric-card">
            <h3 className="metric-label">Security Score</h3>
            <p className="metric-value" style={{ color: 'var(--color-warning)' }}>B+</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>78/100</span>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Open Vulnerabilities</h3>
            <p className="metric-value" style={{ color: 'var(--color-error)' }}>2</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>Requires attention</span>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Last Security Scan</h3>
            <p className="metric-value" style={{ fontSize: '1.25rem' }}>2h ago</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Automated daily</span>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Compliance Status</h3>
            <p className="metric-value success">✓ Passed</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>All checks passed</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'vulnerabilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('vulnerabilities')}
          >
            Vulnerabilities
          </button>
          <button
            className={`tab ${activeTab === 'compliance' ? 'active' : ''}`}
            onClick={() => setActiveTab('compliance')}
          >
            Compliance
          </button>
          <button
            className={`tab ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            Audit Logs
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Critical Alerts */}
            <div className="alert alert-error mb-4">
              <strong>⚠ Critical Alert:</strong> 1 critical vulnerability detected. Immediate action required to prevent potential security breach.
            </div>

            {/* Security Issues by Severity */}
            <div className="card mb-4">
              <h3 className="card-title mb-3">Issues by Severity</h3>
              <div className="grid grid-4">
                <div>
                  <div className="flex align-center gap-2 mb-2">
                    <div className="status-dot error"></div>
                    <span style={{ fontWeight: 600 }}>Critical</span>
                  </div>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-error)' }}>1</p>
                  <div className="progress-bar mt-2">
                    <div className="progress-fill error" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex align-center gap-2 mb-2">
                    <div className="status-dot error"></div>
                    <span style={{ fontWeight: 600 }}>High</span>
                  </div>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-error)' }}>1</p>
                  <div className="progress-bar mt-2">
                    <div className="progress-fill error" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex align-center gap-2 mb-2">
                    <div className="status-dot warning"></div>
                    <span style={{ fontWeight: 600 }}>Medium</span>
                  </div>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning)' }}>1</p>
                  <div className="progress-bar mt-2">
                    <div className="progress-fill warning" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex align-center gap-2 mb-2">
                    <div className="status-dot info"></div>
                    <span style={{ fontWeight: 600 }}>Low</span>
                  </div>
                  <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-gray-600)' }}>0</p>
                  <div className="progress-bar mt-2">
                    <div className="progress-fill info" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Security Events */}
            <div className="card">
              <h3 className="card-title mb-3">Recent Security Events</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker" style={{ backgroundColor: 'var(--color-error)' }}></div>
                  <div className="timeline-content">
                    <div className="timeline-date">2 hours ago</div>
                    <div className="timeline-title" style={{ color: 'var(--color-error)' }}>
                      SQL Injection vulnerability detected
                    </div>
                    <div className="timeline-description">
                      Automated scan found unsanitized user input in search endpoint
                    </div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker" style={{ backgroundColor: 'var(--color-success)' }}></div>
                  <div className="timeline-content">
                    <div className="timeline-date">1 day ago</div>
                    <div className="timeline-title" style={{ color: 'var(--color-success)' }}>
                      Security patch applied successfully
                    </div>
                    <div className="timeline-description">
                      Updated authentication middleware to v2.3.1
                    </div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker" style={{ backgroundColor: 'var(--color-success)' }}></div>
                  <div className="timeline-content">
                    <div className="timeline-date">3 days ago</div>
                    <div className="timeline-title" style={{ color: 'var(--color-success)' }}>
                      Exposed API keys resolved
                    </div>
                    <div className="timeline-description">
                      Removed credentials from repository and rotated keys
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Vulnerabilities Tab */}
        {activeTab === 'vulnerabilities' && (
          <>
            <div className="flex justify-between align-center mb-4">
              <p style={{ color: 'var(--color-gray-600)' }}>
                Showing {issues.length} security issues
              </p>
              <button className="btn btn-primary">
                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Run Security Scan
              </button>
            </div>

            <div className="flex flex-column gap-3">
              {issues.map((issue) => (
                <div key={issue.id} className="card" style={{ borderLeft: `4px solid var(--color-${getSeverityColor(issue.severity)})` }}>
                  <div className="flex justify-between align-center mb-3">
                    <div className="flex align-center gap-2">
                      <span className={`badge badge-${getSeverityColor(issue.severity)}`}>
                        {issue.severity.toUpperCase()}
                      </span>
                      <h4 style={{ fontWeight: 600, margin: 0 }}>{issue.title}</h4>
                    </div>
                    <span className={`badge ${issue.status === 'resolved' ? 'badge-success' : issue.status === 'in-progress' ? 'badge-warning' : 'badge-error'}`}>
                      {issue.status}
                    </span>
                  </div>

                  <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-gray-700)' }}>
                    {issue.description}
                  </p>

                  <div className="grid grid-2 mb-3">
                    <div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Affected Component:</p>
                      <code style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.875rem' }}>{issue.affected}</code>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Detected:</p>
                      <p style={{ fontWeight: 500 }}>{issue.detectedAt}</p>
                    </div>
                  </div>

                  {issue.status !== 'resolved' && (
                    <div className="alert alert-info mb-3">
                      <strong>💡 AI Recommendation:</strong> {issue.id === '1' ? 'Use parameterized queries or ORM to prevent SQL injection. Implement input validation middleware.' : 'Update package.json to lodash@4.17.21 or higher. Run npm audit fix.'}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {issue.status !== 'resolved' && (
                      <>
                        <button className="btn btn-sm btn-primary">Fix Now</button>
                        <button className="btn btn-sm btn-outline">View Details</button>
                      </>
                    )}
                    <button className="btn btn-sm btn-outline">Assign to Engineer</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="card">
            <h3 className="card-title mb-3">Compliance Checklist</h3>
            <div className="flex flex-column gap-3">
              <div className="flex align-center gap-3" style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600 }}>OWASP Top 10 Compliance</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>All vulnerabilities from OWASP Top 10 addressed</p>
                </div>
                <span className="badge badge-success">Passed</span>
              </div>

              <div className="flex align-center gap-3" style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600 }}>GDPR Compliance</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Data privacy requirements met</p>
                </div>
                <span className="badge badge-success">Passed</span>
              </div>

              <div className="flex align-center gap-3" style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-warning)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600 }}>SOC 2 Type II</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Audit in progress, expected completion in 14 days</p>
                </div>
                <span className="badge badge-warning">In Progress</span>
              </div>

              <div className="flex align-center gap-3" style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                <svg style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600 }}>PCI DSS</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Payment card data handling compliant</p>
                </div>
                <span className="badge badge-success">Passed</span>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="card">
            <h3 className="card-title mb-3">Security Audit Logs</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Event Type</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>IP Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2025-11-07 14:32:15</td>
                    <td><span className="badge badge-warning">Auth</span></td>
                    <td>john.doe@company.com</td>
                    <td>Login attempt</td>
                    <td><code>192.168.1.45</code></td>
                    <td><span className="badge badge-success">Success</span></td>
                  </tr>
                  <tr>
                    <td>2025-11-07 13:15:22</td>
                    <td><span className="badge badge-error">Security</span></td>
                    <td>System</td>
                    <td>Vulnerability detected</td>
                    <td><code>-</code></td>
                    <td><span className="badge badge-error">Alert</span></td>
                  </tr>
                  <tr>
                    <td>2025-11-07 12:08:33</td>
                    <td><span className="badge badge-info">Access</span></td>
                    <td>sarah.chen@company.com</td>
                    <td>API key generated</td>
                    <td><code>192.168.1.82</code></td>
                    <td><span className="badge badge-success">Success</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Security;
