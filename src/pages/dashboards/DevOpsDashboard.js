import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Server, 
  Activity, 
  GitBranch, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import './Dashboard.css';

const DevOpsDashboard = () => {
  const navigate = useNavigate();

  // TODO: Load stats from CI/CD API when available
  const stats = [
    {
      label: 'Active Deployments',
      value: 0,
      icon: Server,
      color: '#4f46e5',
      trend: 'No active deployments'
    },
    {
      label: 'Build Success',
      value: '0%',
      icon: CheckCircle,
      color: '#10b981',
      trend: 'No builds yet'
    },
    {
      label: 'System Uptime',
      value: 'N/A',
      icon: Activity,
      color: '#8b5cf6',
      trend: 'Connect CI/CD to monitor'
    },
    {
      label: 'Open Incidents',
      value: 0,
      icon: AlertCircle,
      color: '#f59e0b',
      trend: 'No incidents'
    }
  ];

  // TODO: Load deployments from CI/CD API when available
  const deployments = [];

  // TODO: Load pipelines from CI/CD API when available
  const pipelines = [];

  // TODO: Load server metrics from monitoring API when available
  const serverMetrics = [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>DevOps Dashboard</h1>
          <p className="dashboard-subtitle">Monitor deployments and infrastructure</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/ci-cd')}>
          <GitBranch size={18} />
          View CI/CD
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-trend">
                <TrendingUp size={14} />
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Deployments */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Deployments</h2>
            <button className="btn btn-outline" onClick={() => navigate('/ci-cd')}>
              View All
            </button>
          </div>
          <div className="deployments-list">
            {deployments.length > 0 ? (
              deployments.map(deploy => (
              <div key={deploy.id} className="deployment-card">
                <div className="deployment-status">
                  {deploy.status === 'success' ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : deploy.status === 'failed' ? (
                    <XCircle size={20} className="text-danger" />
                  ) : (
                    <Activity size={20} className="text-primary" />
                  )}
                </div>
                <div className="deployment-info">
                  <h3>{deploy.project}</h3>
                  <div className="deployment-meta">
                    <span className={`badge badge-${
                      deploy.environment === 'Production' ? 'danger' : 
                      deploy.environment === 'Staging' ? 'warning' : 
                      'secondary'
                    }`}>
                      {deploy.environment}
                    </span>
                    <span className="badge badge-secondary">{deploy.version}</span>
                    <span className="deployment-time">{deploy.time}</span>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="empty-state">
                <Server size={48} />
                <p>No deployments yet</p>
                <p style={{ fontSize: '14px', color: '#718096' }}>Connect CI/CD to see deployment history</p>
              </div>
            )}
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Pipeline Status</h2>
            <button className="btn btn-outline" onClick={() => navigate('/ci-cd')}>
              View Details
            </button>
          </div>
          <div className="pipelines-list">
            {pipelines.length > 0 ? (
              pipelines.map(pipeline => (
              <div key={pipeline.id} className="pipeline-card">
                <div className="pipeline-header">
                  <h3>{pipeline.name}</h3>
                  <span className={`badge ${
                    pipeline.status === 'passing' ? 'badge-success' : 
                    pipeline.status === 'running' ? 'badge-warning' : 
                    'badge-danger'
                  }`}>
                    {pipeline.status}
                  </span>
                </div>
                <div className="pipeline-stats">
                  <div className="pipeline-stat">
                    <CheckCircle size={16} className="text-success" />
                    <span>{pipeline.success} passed</span>
                  </div>
                  {pipeline.failed > 0 && (
                    <div className="pipeline-stat">
                      <XCircle size={16} className="text-danger" />
                      <span>{pipeline.failed} failed</span>
                    </div>
                  )}
                </div>
                <div className="pipeline-footer">
                  Last run: {pipeline.lastRun}
                </div>
              </div>
              ))
            ) : (
              <div className="empty-state">
                <GitBranch size={48} />
                <p>No pipelines configured</p>
                <p style={{ fontSize: '14px', color: '#718096' }}>Set up CI/CD pipelines to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Server Metrics */}
        <div className="dashboard-section full-width">
          <div className="section-header">
            <h2>Server Metrics</h2>
            <button className="btn btn-outline" onClick={() => navigate('/analytics')}>
              View Details
            </button>
          </div>
          <div className="servers-grid">
            {serverMetrics.length > 0 ? (
              serverMetrics.map((server, idx) => (
              <div key={idx} className="server-card">
                <div className="server-header">
                  <div className="server-icon">
                    <Server size={24} />
                  </div>
                  <div>
                    <h3>{server.name}</h3>
                    <span className={`badge badge-${
                      server.status === 'healthy' ? 'success' : 
                      server.status === 'warning' ? 'warning' : 
                      'danger'
                    }`}>
                      {server.status}
                    </span>
                  </div>
                </div>
                <div className="server-metrics">
                  <div className="metric">
                    <div className="metric-header">
                      <span className="metric-label">CPU Usage</span>
                      <span className="metric-value">{server.cpu}%</span>
                    </div>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ 
                          width: `${server.cpu}%`,
                          backgroundColor: server.cpu > 70 ? '#ef4444' : '#10b981'
                        }}
                      />
                    </div>
                  </div>
                  <div className="metric">
                    <div className="metric-header">
                      <span className="metric-label">Memory Usage</span>
                      <span className="metric-value">{server.memory}%</span>
                    </div>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ 
                          width: `${server.memory}%`,
                          backgroundColor: server.memory > 80 ? '#ef4444' : '#10b981'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="empty-state">
                <Server size={48} />
                <p>No server metrics available</p>
                <p style={{ fontSize: '14px', color: '#718096' }}>Connect monitoring tools to see server metrics</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevOpsDashboard;
