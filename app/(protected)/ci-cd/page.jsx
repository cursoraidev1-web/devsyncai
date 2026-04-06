'use client';

import React, { useState, useEffect } from 'react';
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
  Square,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import {
  fetchPipelines,
  fetchDeployments,
  fetchCommits,
  getCICDMetrics,
  getPipelineLogs,
  triggerPipeline,
  cancelPipeline,
  rollbackDeployment,
} from '../../../services/api/cicd';
import { useApp } from '../../../context/AppContext';
import { toast } from 'react-toastify';
import PulsingLoader from '../../../components/PulsingLoader';
import '../../../styles/pages/CICDIntegration.css';

const CICDIntegration = () => {
  const { projects } = useApp();
  const [activeTab, setActiveTab] = useState('pipelines');
  const [pipelines, setPipelines] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [commits, setCommits] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const projectId = projects?.[0]?.id;

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = projectId ? { project_id: projectId } : {};
      const [pipelinesData, deploymentsData, commitsData, metricsData] = await Promise.all([
        fetchPipelines(filters).catch(() => []),
        fetchDeployments(filters).catch(() => []),
        fetchCommits(filters).catch(() => []),
        getCICDMetrics(filters).catch(() => null),
      ]);

      setPipelines(Array.isArray(pipelinesData) ? pipelinesData : []);
      setDeployments(Array.isArray(deploymentsData) ? deploymentsData : []);
      setCommits(Array.isArray(commitsData) ? commitsData : []);
      setMetrics(metricsData);
    } catch (error) {
      toast.error(error?.data?.error || error?.message || 'Failed to load CI/CD data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleViewLogs = async (pipeline) => {
    setLogsLoading(true);
    try {
      const filters = projectId ? { project_id: projectId } : {};
      const logs = await getPipelineLogs(pipeline.id, filters);
      setSelectedRun(logs);
    } catch (error) {
      toast.error(error?.data?.error || error?.message || 'Failed to load workflow jobs');
    } finally {
      setLogsLoading(false);
    }
  };

  const handlePipelineAction = async (pipeline, action) => {
    setActionLoading(`${action}-${pipeline.id}`);
    try {
      const filters = projectId ? { project_id: projectId } : {};
      if (action === 'rerun') {
        await triggerPipeline(pipeline.id, filters);
        toast.success('Workflow rerun requested');
      } else {
        await cancelPipeline(pipeline.id, filters);
        toast.success('Workflow cancellation requested');
      }
      await loadData();
    } catch (error) {
      toast.error(error?.data?.error || error?.message || `Failed to ${action} workflow`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRollback = async (deployment) => {
    setActionLoading(`rollback-${deployment.id}`);
    try {
      const filters = projectId ? { project_id: projectId } : {};
      await rollbackDeployment(deployment.id, filters);
      toast.success('Rollback deployment requested');
      await loadData();
    } catch (error) {
      toast.error(error?.data?.error || error?.message || 'Rollback failed');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'active':
        return <CheckCircle size={20} className="status-icon success" />;
      case 'failed':
      case 'failure':
      case 'error':
        return <XCircle size={20} className="status-icon failed" />;
      case 'running':
      case 'queued':
      case 'pending':
      case 'in_progress':
        return <RefreshCw size={20} className="status-icon running" />;
      default:
        return <Clock size={20} className="status-icon pending" />;
    }
  };

  if (loading) {
    return (
      <div className="cicd-integration">
        <div className="cicd-header">
          <div>
            <h1>CI/CD Integration</h1>
            <p className="page-subtitle">Monitor GitHub workflows, deployments, and commits</p>
          </div>
        </div>
        <PulsingLoader message="Loading CI/CD data..." />
      </div>
    );
  }

  const providerConnected = Boolean(metrics?.repository || pipelines.length || deployments.length || commits.length);

  return (
    <div className="cicd-integration">
      <div className="cicd-header">
        <div>
          <h1>CI/CD Integration</h1>
          <p className="page-subtitle">
            {providerConnected
              ? `GitHub repository: ${metrics?.repository || 'Connected'}`
              : 'Connect GitHub in Integrations to unlock CI/CD visibility.'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={loadData}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="cicd-overview">
        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{metrics?.success_rate ?? 'N/A'}{metrics?.success_rate != null ? '%' : ''}</div>
            <div className="overview-label">Build Success Rate</div>
            <div className="overview-trend" style={{ color: '#718096' }}>
              {providerConnected ? 'Last 20 workflow runs' : 'Requires GitHub integration'}
            </div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
            <Activity size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{metrics?.active_pipelines ?? 0}</div>
            <div className="overview-label">Active Pipelines</div>
            <div className="overview-trend" style={{ color: '#718096' }}>Running or queued workflow runs</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
            <Server size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{metrics?.deployments_today ?? 0}</div>
            <div className="overview-label">Deployments Today</div>
            <div className="overview-trend" style={{ color: '#718096' }}>GitHub deployment activity</div>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-icon" style={{ backgroundColor: '#dbeafe', color: '#3b82f6' }}>
            <Code size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{metrics?.commits_this_week ?? 0}</div>
            <div className="overview-label">Commits This Week</div>
            <div className="overview-trend" style={{ color: '#718096' }}>Repository activity over 7 days</div>
          </div>
        </div>
      </div>

      <div className="cicd-tabs">
        <button className={`tab-btn ${activeTab === 'pipelines' ? 'active' : ''}`} onClick={() => setActiveTab('pipelines')}>
          <GitBranch size={18} />
          Pipelines
        </button>
        <button className={`tab-btn ${activeTab === 'deployments' ? 'active' : ''}`} onClick={() => setActiveTab('deployments')}>
          <Server size={18} />
          Deployments
        </button>
        <button className={`tab-btn ${activeTab === 'commits' ? 'active' : ''}`} onClick={() => setActiveTab('commits')}>
          <Code size={18} />
          Commits
        </button>
      </div>

      {activeTab === 'pipelines' && (
        <div className="cicd-content">
          {pipelines.length > 0 ? (
            <div className="pipelines-list">
              {pipelines.map((pipeline) => (
                <div key={pipeline.id} className="pipeline-item">
                  <div className="pipeline-status">{getStatusIcon(pipeline.status)}</div>
                  <div className="pipeline-info">
                    <div className="pipeline-header">
                      <h3>{pipeline.name}</h3>
                      <span className={`badge badge-${pipeline.status === 'success' ? 'success' : pipeline.status === 'failed' ? 'danger' : 'warning'}`}>
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
                  </div>
                  <div className="pipeline-meta">
                    <div className="pipeline-time">
                      <Clock size={14} />
                      {pipeline.last_run ? new Date(pipeline.last_run).toLocaleString() : 'Unknown'}
                    </div>
                    <div className="pipeline-duration">{pipeline.duration || 'Duration unavailable'}</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => handleViewLogs(pipeline)} disabled={logsLoading}>
                        View Jobs
                      </button>
                      {pipeline.rerunnable ? (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handlePipelineAction(pipeline, 'rerun')}
                          disabled={actionLoading === `rerun-${pipeline.id}`}
                        >
                          <Play size={14} />
                          {actionLoading === `rerun-${pipeline.id}` ? 'Running...' : 'Rerun'}
                        </button>
                      ) : null}
                      {pipeline.cancellable ? (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handlePipelineAction(pipeline, 'cancel')}
                          disabled={actionLoading === `cancel-${pipeline.id}`}
                        >
                          <Square size={14} />
                          {actionLoading === `cancel-${pipeline.id}` ? 'Canceling...' : 'Cancel'}
                        </button>
                      ) : null}
                      {pipeline.provider_url ? (
                        <a className="btn btn-outline btn-sm" href={pipeline.provider_url} target="_blank" rel="noreferrer">
                          <ExternalLink size={14} />
                          GitHub
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <GitBranch size={48} style={{ color: '#718096', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No pipeline data available</h3>
              <p style={{ color: '#718096', marginBottom: '24px' }}>
                Connect a GitHub integration with a repository to view workflow runs here.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'deployments' && (
        <div className="cicd-content">
          {deployments.length > 0 ? (
            <div className="deployments-grid">
              {deployments.map((deploy) => (
                <div key={deploy.id} className="deployment-item">
                  <div className="deployment-header">
                    <div className="deployment-env">
                      <Server size={20} />
                      <h3>{deploy.environment}</h3>
                    </div>
                    {getStatusIcon(deploy.status)}
                  </div>
                  <div className="deployment-body">
                    <div className="deployment-detail">
                      <span className="detail-label">Version</span>
                      <span className="detail-value badge badge-primary">{deploy.version}</span>
                    </div>
                    <div className="deployment-detail">
                      <span className="detail-label">Created</span>
                      <span className="detail-value">{new Date(deploy.created_at).toLocaleString()}</span>
                    </div>
                    <div className="deployment-detail">
                      <span className="detail-label">Status</span>
                      <span className="detail-value">{deploy.description || deploy.status}</span>
                    </div>
                  </div>
                  <div className="deployment-actions">
                    {deploy.provider_url ? (
                      <a className="btn btn-outline btn-sm" href={deploy.provider_url} target="_blank" rel="noreferrer">
                        <ExternalLink size={14} />
                        View on GitHub
                      </a>
                    ) : null}
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleRollback(deploy)}
                      disabled={!deploy.rollback_supported || actionLoading === `rollback-${deploy.id}`}
                    >
                      {actionLoading === `rollback-${deploy.id}` ? 'Rolling back...' : 'Rollback'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Server size={48} style={{ color: '#718096', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No deployments found</h3>
              <p style={{ color: '#718096', marginBottom: '24px' }}>
                GitHub deployment activity will appear here when the connected repository publishes deployments.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'commits' && (
        <div className="cicd-content">
          {commits.length > 0 ? (
            <div className="commits-list">
              {commits.map((commit) => (
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
                      <span className="commit-time">
                        {commit.time ? new Date(commit.time).toLocaleString() : 'Unknown time'}
                      </span>
                    </div>
                  </div>
                  {commit.provider_url ? (
                    <a className="btn btn-outline btn-sm" href={commit.provider_url} target="_blank" rel="noreferrer">
                      <ExternalLink size={14} />
                      View on GitHub
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Code size={48} style={{ color: '#718096', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No commit data available</h3>
              <p style={{ color: '#718096', marginBottom: '24px' }}>
                Recent repository commits will appear here once GitHub is connected.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedRun ? (
        <div className="modal-overlay" onClick={() => setSelectedRun(null)}>
          <div className="modal-content modal-large" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{selectedRun.name}</h3>
                <p className="modal-subtitle">Workflow jobs from GitHub Actions</p>
              </div>
              <button className="modal-close" onClick={() => setSelectedRun(null)}>×</button>
            </div>
            <div className="modal-body">
              {selectedRun.jobs?.length ? (
                selectedRun.jobs.map((job) => (
                  <div key={job.id} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong>{job.name}</strong>
                      <span>{job.status}</span>
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {job.steps?.map((step) => (
                        <div key={`${job.id}-${step.number}`} style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <span>{step.number}. {step.name}</span>
                            <span>{step.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <AlertCircle size={32} style={{ color: '#718096', marginBottom: '12px' }} />
                  <p style={{ color: '#718096' }}>GitHub did not return job details for this workflow run.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedRun(null)}>
                Close
              </button>
              {selectedRun.provider_url ? (
                <a className="btn btn-primary" href={selectedRun.provider_url} target="_blank" rel="noreferrer">
                  <ExternalLink size={14} />
                  Open in GitHub
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CICDIntegration;
