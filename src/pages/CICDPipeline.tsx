/**
 * CI/CD Pipeline Page
 * Feature 5: Smart CI/CD Auto Agent monitoring and deployment
 */

import React, { useState } from 'react';

interface Pipeline {
  id: string;
  name: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  branch: string;
  commit: string;
  author: string;
  duration: string;
  timestamp: string;
}

interface PipelineStage {
  name: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  duration: string;
}

const CICDPipeline: React.FC = () => {
  const [activePipeline, setActivePipeline] = useState<string | null>('1');
  
  const [pipelines] = useState<Pipeline[]>([
    {
      id: '1',
      name: 'Build #1247',
      status: 'success',
      branch: 'main',
      commit: 'a3f5c9d',
      author: 'Sarah Chen',
      duration: '4m 32s',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      name: 'Build #1246',
      status: 'running',
      branch: 'feature/auth',
      commit: 'b2e1f8c',
      author: 'Mike Johnson',
      duration: '2m 15s',
      timestamp: '5 minutes ago',
    },
    {
      id: '3',
      name: 'Build #1245',
      status: 'failed',
      branch: 'develop',
      commit: 'c9d4a2b',
      author: 'Alex Kumar',
      duration: '3m 08s',
      timestamp: '1 day ago',
    },
  ]);

  const stages: PipelineStage[] = [
    { name: 'Source', status: 'success', duration: '12s' },
    { name: 'Build', status: 'success', duration: '1m 45s' },
    { name: 'Test', status: 'success', duration: '2m 10s' },
    { name: 'Security Scan', status: 'success', duration: '25s' },
    { name: 'Deploy', status: 'success', duration: '10s' },
  ];

  const getStatusColor = (status: Pipeline['status']) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'error';
      case 'running': return 'info';
      case 'pending': return 'warning';
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">CI/CD Pipeline</h1>
          <p className="page-subtitle">
            Monitor deployments and automate builds with AI optimization
          </p>
        </div>

        {/* Pipeline Statistics */}
        <div className="grid grid-4 mb-4">
          <div className="metric-card">
            <h3 className="metric-label">Success Rate</h3>
            <p className="metric-value success">94%</p>
            <div className="progress-bar mt-2">
              <div className="progress-fill success" style={{ width: '94%' }}></div>
            </div>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Avg Build Time</h3>
            <p className="metric-value">3m 42s</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Deployments Today</h3>
            <p className="metric-value">12</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Active Pipelines</h3>
            <p className="metric-value">2</p>
          </div>
        </div>

        <div className="grid grid-2">
          {/* Pipeline List */}
          <div className="card">
            <div className="flex justify-between align-center mb-3">
              <h3 className="card-title">Recent Builds</h3>
              <button className="btn btn-sm btn-primary">
                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Trigger Build
              </button>
            </div>

            <div className="flex flex-column gap-2">
              {pipelines.map((pipeline) => (
                <div
                  key={pipeline.id}
                  className="card"
                  style={{
                    padding: 'var(--spacing-md)',
                    cursor: 'pointer',
                    border: activePipeline === pipeline.id ? '2px solid var(--color-primary)' : undefined,
                  }}
                  onClick={() => setActivePipeline(pipeline.id)}
                >
                  <div className="flex justify-between align-center mb-2">
                    <h4 style={{ fontWeight: 600 }}>{pipeline.name}</h4>
                    <span className={`badge badge-${getStatusColor(pipeline.status)}`}>
                      {pipeline.status}
                    </span>
                  </div>
                  <div className="flex gap-3 mb-2" style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                    <span>Branch: <code style={{ fontFamily: 'var(--font-family-mono)' }}>{pipeline.branch}</code></span>
                    <span>Commit: <code style={{ fontFamily: 'var(--font-family-mono)' }}>{pipeline.commit}</code></span>
                  </div>
                  <div className="flex justify-between align-center" style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>
                    <span>{pipeline.author}</span>
                    <span>{pipeline.duration} • {pipeline.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Details */}
          <div className="card">
            <h3 className="card-title mb-3">Pipeline Stages</h3>
            
            {/* Visual Pipeline Flow */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              {stages.map((stage, index) => (
                <div key={stage.name} style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div className="flex align-center gap-3">
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: stage.status === 'success' ? 'var(--color-success)' : 'var(--color-gray-300)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="flex justify-between align-center mb-1">
                        <span style={{ fontWeight: 600 }}>{stage.name}</span>
                        <span className={`badge badge-${getStatusColor(stage.status)}`}>
                          {stage.status}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress-fill ${getStatusColor(stage.status)}`} style={{ width: '100%' }}></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                        {stage.duration}
                      </span>
                    </div>
                  </div>
                  {index < stages.length - 1 && (
                    <div style={{ marginLeft: '1.25rem', width: '2px', height: '1rem', backgroundColor: 'var(--color-gray-200)' }}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Build Logs Preview */}
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Build Log (Last 10 lines)</h4>
              <div className="code-block">
                <div>[2025-11-07 14:32:15] Starting build process...</div>
                <div>[2025-11-07 14:32:18] Fetching dependencies</div>
                <div>[2025-11-07 14:33:45] Running tests... 124 passed</div>
                <div>[2025-11-07 14:34:02] Running security scan...</div>
                <div>[2025-11-07 14:34:20] No vulnerabilities found</div>
                <div>[2025-11-07 14:34:25] Building Docker image...</div>
                <div>[2025-11-07 14:35:10] Pushing to registry...</div>
                <div>[2025-11-07 14:35:45] Deploying to production...</div>
                <div style={{ color: 'var(--color-success)' }}>[2025-11-07 14:36:00] ✓ Deployment successful!</div>
              </div>
              <button className="btn btn-outline btn-sm mt-2">View Full Logs</button>
            </div>
          </div>
        </div>

        {/* AI Optimization Recommendations */}
        <div className="card mt-4">
          <h3 className="card-title mb-3">
            <svg style={{ width: '1.5rem', height: '1.5rem', display: 'inline', marginRight: 'var(--spacing-sm)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Optimization Insights
          </h3>
          <div className="grid grid-2">
            <div className="alert alert-warning">
              <strong>Build Time Optimization:</strong> Consider caching node_modules to reduce build time by ~40 seconds.
            </div>
            <div className="alert alert-success">
              <strong>Great Job!</strong> Your test coverage increased from 78% to 85% this week.
            </div>
          </div>
        </div>

        {/* Deployment History */}
        <div className="card mt-4">
          <h3 className="card-title mb-3">Deployment History</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Environment</th>
                  <th>Version</th>
                  <th>Deployed By</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge badge-success">Production</span></td>
                  <td><code>v2.1.3</code></td>
                  <td>Sarah Chen</td>
                  <td><span className="badge badge-success">Active</span></td>
                  <td>2 hours ago</td>
                  <td><button className="btn btn-sm btn-outline">Rollback</button></td>
                </tr>
                <tr>
                  <td><span className="badge badge-warning">Staging</span></td>
                  <td><code>v2.2.0-beta</code></td>
                  <td>Mike Johnson</td>
                  <td><span className="badge badge-success">Active</span></td>
                  <td>30 minutes ago</td>
                  <td><button className="btn btn-sm btn-primary">Promote</button></td>
                </tr>
                <tr>
                  <td><span className="badge badge-info">Development</span></td>
                  <td><code>v2.2.0-alpha</code></td>
                  <td>Alex Kumar</td>
                  <td><span className="badge badge-success">Active</span></td>
                  <td>1 hour ago</td>
                  <td><button className="btn btn-sm btn-outline">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CICDPipeline;
