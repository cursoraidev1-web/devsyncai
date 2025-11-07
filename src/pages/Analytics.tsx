/**
 * Analytics & Reporting Page
 * Feature 10: Analytics & Reporting with predictive insights
 */

import React, { useState } from 'react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Analytics & Reporting</h1>
          <p className="page-subtitle">
            Performance metrics, delivery insights, and predictive analytics
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-between align-center mb-4">
          <div className="flex gap-2">
            <button
              className={`btn btn-sm ${timeRange === 'week' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTimeRange('week')}
            >
              This Week
            </button>
            <button
              className={`btn btn-sm ${timeRange === 'month' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTimeRange('month')}
            >
              This Month
            </button>
            <button
              className={`btn btn-sm ${timeRange === 'quarter' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setTimeRange('quarter')}
            >
              This Quarter
            </button>
          </div>
          <button className="btn btn-outline">
            <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-4 mb-4">
          <div className="metric-card">
            <h3 className="metric-label">Project Velocity</h3>
            <p className="metric-value">42 pts</p>
            <div className="progress-bar mt-2">
              <div className="progress-fill success" style={{ width: '84%' }}></div>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: 'var(--spacing-xs)', display: 'block' }}>
              ↑ 12% from last month
            </span>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">PRD Compliance</h3>
            <p className="metric-value">72%</p>
            <div className="progress-bar mt-2">
              <div className="progress-fill warning" style={{ width: '72%' }}></div>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-warning)', marginTop: 'var(--spacing-xs)', display: 'block' }}>
              ↑ 8% improvement
            </span>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Deployment Success</h3>
            <p className="metric-value success">94%</p>
            <div className="progress-bar mt-2">
              <div className="progress-fill success" style={{ width: '94%' }}></div>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: 'var(--spacing-xs)', display: 'block' }}>
              ↑ 3% increase
            </span>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Team Efficiency</h3>
            <p className="metric-value">A-</p>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
              92nd percentile
            </span>
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">
            <svg style={{ width: '1.5rem', height: '1.5rem', display: 'inline', marginRight: 'var(--spacing-sm)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Predictive Insights
          </h3>
          <div className="grid grid-2">
            <div className="alert alert-success">
              <strong>✓ On Track:</strong> Current sprint is projected to complete 95% of planned story points based on historical velocity.
            </div>
            <div className="alert alert-warning">
              <strong>⚠ Risk Alert:</strong> Feature "Real-time Notifications" may experience a 2-day delay due to dependency on external API integration.
            </div>
          </div>
        </div>

        {/* Sprint Progress */}
        <div className="grid grid-2 mb-4">
          <div className="card">
            <h3 className="card-title mb-3">Sprint Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Story Points Completed</span>
                <span style={{ fontWeight: 600 }}>35 / 42</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill success" style={{ width: '83%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-2">
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-xs)' }}>
                  Tasks Completed
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>24 / 32</p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-xs)' }}>
                  Days Remaining
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>3</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title mb-3">Team Capacity</h3>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <div className="flex justify-between align-center mb-2">
                <span>Frontend Team</span>
                <span className="badge badge-success">92% utilized</span>
              </div>
              <div className="progress-bar mb-3">
                <div className="progress-fill success" style={{ width: '92%' }}></div>
              </div>
              
              <div className="flex justify-between align-center mb-2">
                <span>Backend Team</span>
                <span className="badge badge-warning">78% utilized</span>
              </div>
              <div className="progress-bar mb-3">
                <div className="progress-fill warning" style={{ width: '78%' }}></div>
              </div>
              
              <div className="flex justify-between align-center mb-2">
                <span>QA Team</span>
                <span className="badge badge-error">105% utilized</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill error" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Quality Trends */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">Code Quality Trends</h3>
          <div className="grid grid-3">
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-sm)' }}>
                Test Coverage
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)' }}>85%</p>
              <div className="progress-bar">
                <div className="progress-fill success" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-sm)' }}>
                Code Review Time
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700 }}>2.3h</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>↓ 0.8h improvement</span>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-sm)' }}>
                Bug Density
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700 }}>0.8/KLOC</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>Industry avg: 1.2</span>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="card">
          <h3 className="card-title mb-3">Project Risk Factors</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Risk Factor</th>
                  <th>Severity</th>
                  <th>Probability</th>
                  <th>Impact</th>
                  <th>Mitigation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>External API Dependency Delay</td>
                  <td><span className="badge badge-warning">Medium</span></td>
                  <td>60%</td>
                  <td>2 days delay</td>
                  <td>Implement mock API fallback</td>
                </tr>
                <tr>
                  <td>QA Team Overutilization</td>
                  <td><span className="badge badge-error">High</span></td>
                  <td>85%</td>
                  <td>Testing bottleneck</td>
                  <td>Add 2 QA resources temporarily</td>
                </tr>
                <tr>
                  <td>Security Compliance Review</td>
                  <td><span className="badge badge-info">Low</span></td>
                  <td>30%</td>
                  <td>1 day delay</td>
                  <td>Scheduled review in advance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
