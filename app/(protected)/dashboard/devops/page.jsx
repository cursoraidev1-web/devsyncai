'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
;
import { fetchDeployments, fetchPipelines, getCICDMetrics } from '../../../../api/cicd';
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
import PulsingLoader from '../../../../components/PulsingLoader';
import '../../../../styles/pages/Dashboard.css';

const DevOpsDashboard = () => {
  const router = useRouter();
  const [deployments, setDeployments] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCICDData();
  }, []);

  const loadCICDData = async () => {
    setLoading(true);
    try {
      const [deploymentsData, pipelinesData, metricsData] = await Promise.all([
        fetchDeployments({ limit: 10 }),
        fetchPipelines({ limit: 10 }),
        getCICDMetrics()
      ]);
      setDeployments(Array.isArray(deploymentsData) ? deploymentsData : []);
      setPipelines(Array.isArray(pipelinesData) ? pipelinesData : []);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load CI/CD data:', error);
      setDeployments([]);
      setPipelines([]);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  };

  const activeDeployments = deployments.filter(d => 
    d.status === 'active' || d.status === 'deploying' || d.status === 'running'
  ).length;
  const buildSuccessRate = metrics?.build_success_rate || metrics?.successRate || 0;
  const systemUptime = metrics?.uptime || metrics?.system_uptime || null;
  const openIncidents = metrics?.incidents?.open || metrics?.open_incidents || 0;

  const stats = [
    {
      label: 'Active Deployments',
      value: activeDeployments,
      icon: Server,
      color: '#4f46e5',
      trend: activeDeployments > 0 ? `${activeDeployments} active` : 'No active deployments'
    },
    {
      label: 'Build Success',
      value: typeof buildSuccessRate === 'number' ? `${buildSuccessRate}%` : buildSuccessRate || '0%',
      icon: CheckCircle,
      color: '#10b981',
      trend: buildSuccessRate > 0 ? `${buildSuccessRate}% success rate` : 'No builds yet'
    },
    {
      label: 'System Uptime',
      value: systemUptime || 'N/A',
      icon: Activity,
      color: '#8b5cf6',
      trend: systemUptime ? `${systemUptime}` : 'Connect CI/CD to monitor'
    },
    {
      label: 'Open Incidents',
      value: openIncidents,
      icon: AlertCircle,
      color: '#f59e0b',
      trend: openIncidents > 0 ? `${openIncidents} open` : 'No incidents'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>DevOps Dashboard</h1>
          <p className="dashboard-subtitle">Monitor deployments and infrastructure</p>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/ci-cd')}>
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
            <button className="btn btn-outline" onClick={() => router.push('/ci-cd')}>
              View All
            </button>
          </div>
          <div className="deployments-list">
            {loading ? (
              <PulsingLoader message="Loading deployments..." />
            ) : deployments.length > 0 ? (
              deployments.map(deploy => (
              <div key={deploy.id} className="deployment-card">
                <div className="deployment-status">
                  {deploy.status === 'success' || deploy.status === 'completed' ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : deploy.status === 'failed' || deploy.status === 'error' ? (
                    <XCircle size={20} className="text-danger" />
                  ) : (
                    <Activity size={20} className="text-primary" />
                  )}
                </div>
                <div className="deployment-info">
                  <h3>{deploy.project || deploy.project_name || deploy.name || 'Deployment'}</h3>
                  <div className="deployment-meta">
                    <span className={`badge badge-${
                      (deploy.environment || deploy.env) === 'Production' || (deploy.environment || deploy.env) === 'production' ? 'danger' : 
                      (deploy.environment || deploy.env) === 'Staging' || (deploy.environment || deploy.env) === 'staging' ? 'warning' : 
                      'secondary'
                    }`}>
                      {deploy.environment || deploy.env || 'Unknown'}
                    </span>
                    <span className="badge badge-secondary">{deploy.version || deploy.tag || 'N/A'}</span>
                    <span className="deployment-time">
                      {deploy.time || deploy.created_at || deploy.timestamp || 'Recently'}
                    </span>
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
            <button className="btn btn-outline" onClick={() => router.push('/ci-cd')}>
              View Details
            </button>
          </div>
          <div className="pipelines-list">
            {loading ? (
              <PulsingLoader message="Loading pipelines..." />
            ) : pipelines.length > 0 ? (
              pipelines.map(pipeline => (
              <div key={pipeline.id} className="pipeline-card">
                <div className="pipeline-header">
                  <h3>{pipeline.name || pipeline.pipeline_name || 'Pipeline'}</h3>
                  <span className={`badge ${
                    pipeline.status === 'passing' || pipeline.status === 'success' || pipeline.status === 'completed' ? 'badge-success' : 
                    pipeline.status === 'running' || pipeline.status === 'in_progress' ? 'badge-warning' : 
                    'badge-danger'
                  }`}>
                    {pipeline.status || 'unknown'}
                  </span>
                </div>
                <div className="pipeline-stats">
                  <div className="pipeline-stat">
                    <CheckCircle size={16} className="text-success" />
                    <span>{pipeline.success || pipeline.success_count || 0} passed</span>
                  </div>
                  {(pipeline.failed || pipeline.failed_count || 0) > 0 && (
                    <div className="pipeline-stat">
                      <XCircle size={16} className="text-danger" />
                      <span>{pipeline.failed || pipeline.failed_count || 0} failed</span>
                    </div>
                  )}
                </div>
                <div className="pipeline-footer">
                  Last run: {pipeline.lastRun || pipeline.last_run || pipeline.updated_at || 'N/A'}
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
            <button className="btn btn-outline" onClick={() => router.push('/analytics')}>
              View Details
            </button>
          </div>
          <div className="servers-grid">
            {metrics?.servers && metrics.servers.length > 0 ? (
              metrics.servers.map((server, idx) => (
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


