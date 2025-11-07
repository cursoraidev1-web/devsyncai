/**
 * Development Insights Page
 * Feature 6: AI Development Insights - commit summaries, PR analysis, blocker detection
 */

import React, { useState } from 'react';

interface Commit {
  hash: string;
  message: string;
  author: string;
  time: string;
  files: number;
  additions: number;
  deletions: number;
}

interface Blocker {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedDev: string;
  suggestedSolution: string;
}

const DevelopmentInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState('commits');
  
  const [commits] = useState<Commit[]>([
    {
      hash: 'a3f5c9d',
      message: 'feat: implement user authentication with JWT',
      author: 'Sarah Chen',
      time: '2 hours ago',
      files: 8,
      additions: 245,
      deletions: 32,
    },
    {
      hash: 'b2e1f8c',
      message: 'fix: resolve memory leak in dashboard component',
      author: 'Mike Johnson',
      time: '4 hours ago',
      files: 3,
      additions: 18,
      deletions: 42,
    },
    {
      hash: 'c9d4a2b',
      message: 'refactor: optimize database queries for analytics',
      author: 'Alex Kumar',
      time: '1 day ago',
      files: 12,
      additions: 156,
      deletions: 203,
    },
  ]);

  const [blockers] = useState<Blocker[]>([
    {
      id: '1',
      severity: 'high',
      title: 'API Rate Limit Causing Test Failures',
      description: 'Integration tests are failing due to external API rate limiting.',
      affectedDev: 'Sarah Chen',
      suggestedSolution: 'Implement request caching or use mock API responses for tests.',
    },
    {
      id: '2',
      severity: 'medium',
      title: 'Dependency Version Conflict',
      description: 'React 18 and legacy UI library have compatibility issues.',
      affectedDev: 'Mike Johnson',
      suggestedSolution: 'Upgrade UI library to v4.2+ or downgrade React to v17.',
    },
  ]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Development Insights</h1>
          <p className="page-subtitle">
            AI-powered analysis of commits, PRs, and development blockers
          </p>
        </div>

        {/* Sprint Summary Cards */}
        <div className="grid grid-4 mb-4">
          <div className="metric-card">
            <h3 className="metric-label">Commits This Week</h3>
            <p className="metric-value">127</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>↑ 18% vs last week</span>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Open Pull Requests</h3>
            <p className="metric-value">12</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>3 need review</span>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Code Review Time</h3>
            <p className="metric-value">2.3h</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>↓ 0.8h improvement</span>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Active Blockers</h3>
            <p className="metric-value" style={{ color: 'var(--color-error)' }}>2</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-error)' }}>Requires attention</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'commits' ? 'active' : ''}`}
            onClick={() => setActiveTab('commits')}
          >
            Commits
          </button>
          <button
            className={`tab ${activeTab === 'prs' ? 'active' : ''}`}
            onClick={() => setActiveTab('prs')}
          >
            Pull Requests
          </button>
          <button
            className={`tab ${activeTab === 'blockers' ? 'active' : ''}`}
            onClick={() => setActiveTab('blockers')}
          >
            Blockers
          </button>
          <button
            className={`tab ${activeTab === 'velocity' ? 'active' : ''}`}
            onClick={() => setActiveTab('velocity')}
          >
            Team Velocity
          </button>
        </div>

        {/* Commits Tab */}
        {activeTab === 'commits' && (
          <>
            <div className="card mb-4">
              <h3 className="card-title mb-3">AI Commit Summary</h3>
              <div className="alert alert-info">
                <strong>Today's Development Summary:</strong> The team made 15 commits focused primarily on authentication features (8 commits), bug fixes (4 commits), and performance optimization (3 commits). Notable achievement: Sarah successfully implemented JWT-based auth system with refresh token support.
              </div>
            </div>

            <div className="card">
              <h3 className="card-title mb-3">Recent Commits</h3>
              <div className="timeline">
                {commits.map((commit) => (
                  <div key={commit.hash} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="flex justify-between align-center mb-2">
                        <code style={{ fontFamily: 'var(--font-family-mono)', fontWeight: 600 }}>
                          {commit.hash}
                        </code>
                        <span className="timeline-date">{commit.time}</span>
                      </div>
                      <div className="timeline-title">{commit.message}</div>
                      <div className="timeline-description">
                        <div className="flex gap-3" style={{ marginTop: 'var(--spacing-sm)' }}>
                          <span>{commit.author}</span>
                          <span style={{ color: 'var(--color-success)' }}>+{commit.additions}</span>
                          <span style={{ color: 'var(--color-error)' }}>-{commit.deletions}</span>
                          <span>{commit.files} files changed</span>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline mt-2">View Diff</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Pull Requests Tab */}
        {activeTab === 'prs' && (
          <div className="card">
            <h3 className="card-title mb-3">Open Pull Requests</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>PR #</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Reviews</th>
                    <th>CI/CD</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>#234</code></td>
                    <td>Add user authentication flow</td>
                    <td>Sarah Chen</td>
                    <td><span className="badge badge-warning">Review Pending</span></td>
                    <td>2/3 approved</td>
                    <td><span className="badge badge-success">✓ Passed</span></td>
                    <td><button className="btn btn-sm btn-primary">Review</button></td>
                  </tr>
                  <tr>
                    <td><code>#233</code></td>
                    <td>Fix dashboard memory leak</td>
                    <td>Mike Johnson</td>
                    <td><span className="badge badge-success">Approved</span></td>
                    <td>3/3 approved</td>
                    <td><span className="badge badge-success">✓ Passed</span></td>
                    <td><button className="btn btn-sm btn-success">Merge</button></td>
                  </tr>
                  <tr>
                    <td><code>#232</code></td>
                    <td>Optimize database queries</td>
                    <td>Alex Kumar</td>
                    <td><span className="badge badge-warning">Changes Requested</span></td>
                    <td>1/3 approved</td>
                    <td><span className="badge badge-error">✗ Failed</span></td>
                    <td><button className="btn btn-sm btn-outline">View</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blockers Tab */}
        {activeTab === 'blockers' && (
          <>
            <div className="alert alert-error mb-4">
              <strong>⚠ Attention Required:</strong> 2 high-priority blockers detected that may impact sprint delivery.
            </div>

            <div className="flex flex-column gap-3">
              {blockers.map((blocker) => (
                <div key={blocker.id} className="card">
                  <div className="flex justify-between align-center mb-3">
                    <div className="flex align-center gap-2">
                      <span className={`badge badge-${blocker.severity === 'high' ? 'error' : blocker.severity === 'medium' ? 'warning' : 'info'}`}>
                        {blocker.severity.toUpperCase()}
                      </span>
                      <h3 style={{ fontWeight: 600, margin: 0 }}>{blocker.title}</h3>
                    </div>
                    <button className="btn btn-primary">Resolve</button>
                  </div>
                  
                  <div className="mb-3">
                    <p style={{ marginBottom: 'var(--spacing-md)' }}><strong>Description:</strong> {blocker.description}</p>
                    <p style={{ marginBottom: 'var(--spacing-md)' }}><strong>Affected Developer:</strong> {blocker.affectedDev}</p>
                  </div>

                  <div className="alert alert-info">
                    <strong>💡 AI Suggestion:</strong> {blocker.suggestedSolution}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button className="btn btn-sm btn-outline">Assign to Team</button>
                    <button className="btn btn-sm btn-outline">View Similar Issues</button>
                    <button className="btn btn-sm btn-outline">Mark as Resolved</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Team Velocity Tab */}
        {activeTab === 'velocity' && (
          <>
            <div className="grid grid-3 mb-4">
              <div className="metric-card">
                <h3 className="metric-label">Sprint Velocity</h3>
                <p className="metric-value">42 pts</p>
                <div className="progress-bar mt-2">
                  <div className="progress-fill success" style={{ width: '84%' }}></div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', marginTop: 'var(--spacing-xs)', display: 'block' }}>84% of planned capacity</span>
              </div>
              <div className="metric-card">
                <h3 className="metric-label">Code Quality Score</h3>
                <p className="metric-value success">A</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Test coverage: 85%</span>
              </div>
              <div className="metric-card">
                <h3 className="metric-label">Deployment Frequency</h3>
                <p className="metric-value">2.4/day</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>↑ 15% improvement</span>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title mb-3">Team Member Activity</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Developer</th>
                      <th>Commits</th>
                      <th>PRs Opened</th>
                      <th>PRs Reviewed</th>
                      <th>Lines Changed</th>
                      <th>Efficiency Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sarah Chen</td>
                      <td>45</td>
                      <td>8</td>
                      <td>12</td>
                      <td><span style={{ color: 'var(--color-success)' }}>+1,245</span> <span style={{ color: 'var(--color-error)' }}>-320</span></td>
                      <td><span className="badge badge-success">95%</span></td>
                    </tr>
                    <tr>
                      <td>Mike Johnson</td>
                      <td>38</td>
                      <td>6</td>
                      <td>15</td>
                      <td><span style={{ color: 'var(--color-success)' }}>+890</span> <span style={{ color: 'var(--color-error)' }}>-410</span></td>
                      <td><span className="badge badge-success">92%</span></td>
                    </tr>
                    <tr>
                      <td>Alex Kumar</td>
                      <td>44</td>
                      <td>7</td>
                      <td>9</td>
                      <td><span style={{ color: 'var(--color-success)' }}>+1,567</span> <span style={{ color: 'var(--color-error)' }}>-890</span></td>
                      <td><span className="badge badge-success">89%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DevelopmentInsights;
