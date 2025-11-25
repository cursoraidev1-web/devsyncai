import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Clock,
  Activity,
  Server,
  Code,
  RefreshCw,
  Play,
  Settings
} from 'lucide-react';
import './CICDIntegration.css';

const CICDIntegration = () => {
  const [activeTab, setActiveTab] = useState('pipelines');

  const pipelines = [
    {
      id: 1,
      name: 'Main CI/CD Pipeline',
      branch: 'main',
      status: 'success',
      lastRun: '10 minutes ago',
      duration: '4m 32s',
      commit: '4398a8d: Fix authentication bug',
      author: 'John Doe',
      tests: { passed: 45, failed: 0, total: 45 }
    },
    {
      id: 2,
      name: 'Staging Deployment',
      branch: 'staging',
      status: 'running',
      lastRun: 'Now',
      duration: '2m 15s',
      commit: '08bc01b: Update dashboard UI',
      author: 'Jane Smith',
      tests: { passed: 23, failed: 0, total: 30 }
    },
    {
      id: 3,
      name: 'Feature Branch Build',
      branch: 'feature/user-auth',
      status: 'failed',
      lastRun: '1 hour ago',
      duration: '3m 18s',
      commit: '2f6c81a: Add OAuth integration',
      author: 'Mike Johnson',
      tests: { passed: 38, failed: 5, total: 43 }
    },
    {
      id: 4,
      name: 'Production Deploy',
      branch: 'main',
      status: 'success',
      lastRun: '2 hours ago',
      duration: '6m 42s',
      commit: '25d2e6c: Release v2.4.1',
      author: 'Sarah Wilson',
      tests: { passed: 52, failed: 0, total: 52 }
    }
  ];

  const deployments = [
    { id: 1, env: 'Production', version: 'v2.4.1', status: 'success', time: '2 hours ago', uptime: '99.9%' },
    { id: 2, env: 'Staging', version: 'v2.5.0-rc1', status: 'success', time: '30 minutes ago', uptime: '100%' },
    { id: 3, env: 'Development', version: 'v2.5.0-beta', status: 'running', time: 'Now', uptime: '98.5%' }
  ];

  const commits = [
    { id: 1, hash: '4398a8d', message: 'Fix authentication bug', author: 'John Doe', time: '10 minutes ago', branch: 'main' },
    { id: 2, hash: '08bc01b', message: 'Update dashboard UI', author: 'Jane Smith', time: '1 hour ago', branch: 'staging' },
    { id: 3, hash: '2f6c81a', message: 'Add OAuth integration', author: 'Mike Johnson', time: '2 hours ago', branch: 'feature/user-auth' },
    { id: 4, hash: '25d2e6c', message: 'Release v2.4.1', author: 'Sarah Wilson', time: '3 hours ago', branch: 'main' },
    { id: 5, hash: '1a4ed74', message: 'Refactor API endpoints', author: 'Tom Brown', time: '5 hours ago', branch: 'develop' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} className="status-icon success" />;
      case 'failed':
        return <XCircle size={20} className="status-icon failed" />;
      case 'running':
        return <RefreshCw size={20} className="status-icon running" />;
      default:
        return <Clock size={20} className="status-icon pending" />;
    }
  };

  return (
    <div className="cicd-integration">
      <div className="cicd-header">
        <div>
          <h1>CI/CD Integration</h1>
          <p className="page-subtitle">Monitor builds, deployments, and code activity</p>
        </div>
        <button className="btn btn-primary">
          <Settings size={18} />
          Configure
        </button>
      </div>

      {/* Overview Cards */}
      <div className="cicd-overview">
        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">98.5%</div>
            <div className="overview-label">Build Success Rate</div>
            <div className="overview-trend success">+2.3% this week</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
            <Activity size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">3</div>
            <div className="overview-label">Active Pipelines</div>
            <div className="overview-trend">Running now</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
            <Server size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">45</div>
            <div className="overview-label">Deployments Today</div>
            <div className="overview-trend success">+12 from yesterday</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}>
            <Code size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">127</div>
            <div className="overview-label">Commits This Week</div>
            <div className="overview-trend success">+18 from last week</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="cicd-tabs">
        <button
          className={`tab-btn ${activeTab === 'pipelines' ? 'active' : ''}`}
          onClick={() => setActiveTab('pipelines')}
        >
          <GitBranch size={18} />
          Pipelines
        </button>
        <button
          className={`tab-btn ${activeTab === 'deployments' ? 'active' : ''}`}
          onClick={() => setActiveTab('deployments')}
        >
          <Server size={18} />
          Deployments
        </button>
        <button
          className={`tab-btn ${activeTab === 'commits' ? 'active' : ''}`}
          onClick={() => setActiveTab('commits')}
        >
          <Code size={18} />
          Commits
        </button>
      </div>

      {/* Pipelines Tab */}
      {activeTab === 'pipelines' && (
        <div className="cicd-content">
          <div className="pipelines-list">
            {pipelines.map(pipeline => (
              <div key={pipeline.id} className="pipeline-item">
                <div className="pipeline-status">
                  {getStatusIcon(pipeline.status)}
                </div>
                <div className="pipeline-info">
                  <div className="pipeline-header">
                    <h3>{pipeline.name}</h3>
                    <span className={`badge badge-${
                      pipeline.status === 'success' ? 'success' : 
                      pipeline.status === 'failed' ? 'danger' : 
                      pipeline.status === 'running' ? 'warning' : 
                      'secondary'
                    }`}>
                      {pipeline.status}
                    </span>
                  </div>
                  <div className="pipeline-details">
                    <div className="pipeline-branch">
                      <GitBranch size={14} />
                      {pipeline.branch}
                    </div>
                    <div className="pipeline-commit">{pipeline.commit}</div>
                    <div className="pipeline-author">by {pipeline.author}</div>
                  </div>
                  <div className="pipeline-tests">
                    <div className="test-result">
                      <CheckCircle size={14} className="text-success" />
                      <span>{pipeline.tests.passed} passed</span>
                    </div>
                    {pipeline.tests.failed > 0 && (
                      <div className="test-result">
                        <XCircle size={14} className="text-danger" />
                        <span>{pipeline.tests.failed} failed</span>
                      </div>
                    )}
                    <div className="test-result">
                      <span className="text-gray">{pipeline.tests.total} total</span>
                    </div>
                  </div>
                </div>
                <div className="pipeline-meta">
                  <div className="pipeline-time">
                    <Clock size={14} />
                    {pipeline.lastRun}
                  </div>
                  <div className="pipeline-duration">{pipeline.duration}</div>
                  <button className="btn btn-outline btn-sm">
                    <Play size={14} />
                    Run
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployments Tab */}
      {activeTab === 'deployments' && (
        <div className="cicd-content">
          <div className="deployments-grid">
            {deployments.map(deploy => (
              <div key={deploy.id} className="deployment-item">
                <div className="deployment-header">
                  <div className="deployment-env">
                    <Server size={20} />
                    <h3>{deploy.env}</h3>
                  </div>
                  {getStatusIcon(deploy.status)}
                </div>
                <div className="deployment-body">
                  <div className="deployment-detail">
                    <span className="detail-label">Version</span>
                    <span className="detail-value badge badge-primary">{deploy.version}</span>
                  </div>
                  <div className="deployment-detail">
                    <span className="detail-label">Deployed</span>
                    <span className="detail-value">{deploy.time}</span>
                  </div>
                  <div className="deployment-detail">
                    <span className="detail-label">Uptime</span>
                    <span className="detail-value success">{deploy.uptime}</span>
                  </div>
                </div>
                <div className="deployment-actions">
                  <button className="btn btn-outline btn-sm">View Logs</button>
                  <button className="btn btn-outline btn-sm">Rollback</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commits Tab */}
      {activeTab === 'commits' && (
        <div className="cicd-content">
          <div className="commits-list">
            {commits.map(commit => (
              <div key={commit.id} className="commit-item">
                <div className="commit-icon">
                  <GitBranch size={18} />
                </div>
                <div className="commit-info">
                  <div className="commit-message">{commit.message}</div>
                  <div className="commit-meta">
                    <span className="commit-hash">#{commit.hash}</span>
                    <span className="commit-author">{commit.author}</span>
                    <span className="badge badge-secondary">{commit.branch}</span>
                    <span className="commit-time">{commit.time}</span>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm">
                  <Code size={14} />
                  View Code
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CICDIntegration;
