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

  const stats = [
    {
      label: 'Active Deployments',
      value: 3,
      icon: Server,
      color: '#4f46e5',
      trend: '2 in progress'
    },
    {
      label: 'Build Success',
      value: '98.5%',
      icon: CheckCircle,
      color: '#10b981',
      trend: '+1.2% this week'
    },
    {
      label: 'System Uptime',
      value: '99.9%',
      icon: Activity,
      color: '#8b5cf6',
      trend: '30 days streak'
    },
    {
      label: 'Open Incidents',
      value: 2,
      icon: AlertCircle,
      color: '#f59e0b',
      trend: '-1 from yesterday'
    }
  ];

  const deployments = [
    { 
      id: 1, 
      project: 'E-Commerce Platform', 
      environment: 'Production', 
      status: 'success', 
      time: '2 hours ago',
      version: 'v2.4.1'
    },
    { 
      id: 2, 
      project: 'Mobile App Backend', 
      environment: 'Staging', 
      status: 'in-progress', 
      time: 'Now',
      version: 'v1.8.0'
    },
    { 
      id: 3, 
      project: 'Admin Dashboard', 
      environment: 'Production', 
      status: 'success', 
      time: '5 hours ago',
      version: 'v3.1.2'
    },
    { 
      id: 4, 
      project: 'API Gateway', 
      environment: 'Development', 
      status: 'failed', 
      time: '1 day ago',
      version: 'v2.0.0-beta'
    }
  ];

  const pipelines = [
    { id: 1, name: 'Main CI Pipeline', status: 'passing', lastRun: '10 min ago', success: 45, failed: 2 },
    { id: 2, name: 'Staging Deploy', status: 'running', lastRun: 'Now', success: 23, failed: 0 },
    { id: 3, name: 'Integration Tests', status: 'passing', lastRun: '1 hour ago', success: 67, failed: 3 }
  ];

  const serverMetrics = [
    { name: 'Production Server', cpu: 45, memory: 62, status: 'healthy' },
    { name: 'Staging Server', cpu: 28, memory: 48, status: 'healthy' },
    { name: 'Database Server', cpu: 71, memory: 85, status: 'warning' }
  ];

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
            {deployments.map(deploy => (
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
            ))}
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
            {pipelines.map(pipeline => (
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
            ))}
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
            {serverMetrics.map((server, idx) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevOpsDashboard;
