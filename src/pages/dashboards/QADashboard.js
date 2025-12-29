import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Bug, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Clock,
  XCircle,
  ArrowRight
} from 'lucide-react';
import './Dashboard.css';

const QADashboard = () => {
  const navigate = useNavigate();
  const { tasks } = useApp();
  const { user } = useAuth();

  // Filter tasks assigned to current QA user or tagged with testing
  const qaTasks = tasks.filter(t => 
    t.assigned_to === user?.id || 
    t.assignee_id === user?.id ||
    t.tags?.includes('testing') ||
    (user?.role === 'qa' && !t.assigned_to && !t.assignee_id) // Fallback: unassigned tasks for QA
  );
  
  // Calculate stats from actual tasks
  const testTasks = qaTasks.filter(t => t.tags?.includes('testing') || t.type === 'test');
  const bugTasks = qaTasks.filter(t => t.tags?.includes('bug') || t.priority === 'high');
  const pendingTasks = qaTasks.filter(t => t.status === 'todo' || t.status === 'in-progress');
  const completedTasks = qaTasks.filter(t => t.status === 'completed');
  const passRate = qaTasks.length > 0 ? Math.round((completedTasks.length / qaTasks.length) * 100) : 0;

  const stats = [
    {
      label: 'Test Cases',
      value: testTasks.length,
      icon: CheckCircle,
      color: '#4f46e5',
      trend: testTasks.length > 0 ? `${testTasks.length} active` : 'No test cases'
    },
    {
      label: 'Open Bugs',
      value: bugTasks.length,
      icon: Bug,
      color: '#ef4444',
      trend: bugTasks.length > 0 ? `${bugTasks.length} open` : 'No open bugs'
    },
    {
      label: 'Tests Pending',
      value: pendingTasks.length,
      icon: Clock,
      color: '#f59e0b',
      trend: pendingTasks.length > 0 ? `${pendingTasks.length} pending` : 'No pending tests'
    },
    {
      label: 'Pass Rate',
      value: `${passRate}%`,
      icon: TrendingUp,
      color: '#10b981',
      trend: qaTasks.length > 0 ? `${completedTasks.length} completed` : 'No tests run'
    }
  ];

  // TODO: Load test results from API when CI/CD integration is available
  const testResults = [];

  // Use actual bug tasks instead of demo data
  const recentBugs = bugTasks.slice(0, 5).map(task => ({
    id: task.id,
    title: task.title,
    severity: task.priority || 'medium',
    status: task.status
  }));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>QA Dashboard</h1>
          <p className="dashboard-subtitle">Testing status and bug tracking</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
          <Bug size={18} />
          Report Bug
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
        {/* Test Results */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Test Results</h2>
            <button className="btn btn-outline" onClick={() => navigate('/tasks')}>
              View All
            </button>
          </div>
          <div className="test-results-list">
            {testResults.length > 0 ? (
              testResults.map(test => (
              <div key={test.id} className="test-result-card">
                <div className="test-header">
                  <h3>{test.name}</h3>
                  <span className={`badge ${
                    test.status === 'passed' ? 'badge-success' : 
                    test.status === 'failed' ? 'badge-danger' : 
                    'badge-warning'
                  }`}>
                    {test.status}
                  </span>
                </div>
                <div className="test-stats">
                  <div className="test-stat">
                    <span className="test-stat-label">Total Tests</span>
                    <span className="test-stat-value">{test.tests}</span>
                  </div>
                  <div className="test-stat">
                    <span className="test-stat-label">Failed</span>
                    <span className="test-stat-value" style={{ color: test.failed > 0 ? '#ef4444' : '#10b981' }}>
                      {test.failed}
                    </span>
                  </div>
                  <div className="test-stat">
                    <span className="test-stat-label">Pass Rate</span>
                    <span className="test-stat-value">
                      {Math.round(((test.tests - test.failed) / test.tests) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="empty-state">
                <CheckCircle size={48} />
                <p>No test results yet</p>
                <p style={{ fontSize: '14px', color: '#718096' }}>Connect CI/CD to see test results</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Bugs */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Bugs</h2>
            <button className="btn btn-outline" onClick={() => navigate('/tasks')}>
              View All
            </button>
          </div>
          <div className="activity-list">
            {recentBugs.length > 0 ? (
              recentBugs.map(bug => (
              <div key={bug.id} className="activity-item">
                <div className="activity-icon">
                  {bug.status === 'resolved' ? (
                    <CheckCircle size={18} className="text-success" />
                  ) : bug.severity === 'critical' ? (
                    <XCircle size={18} className="text-danger" />
                  ) : (
                    <AlertCircle size={18} className="text-warning" />
                  )}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{bug.title}</div>
                  <div className="activity-meta">
                    <span className={`badge badge-${
                      bug.severity === 'critical' ? 'danger' : 
                      bug.severity === 'high' ? 'warning' : 
                      'secondary'
                    }`}>
                      {bug.severity}
                    </span>
                    <span className="badge badge-secondary">{bug.status}</span>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="empty-state">
                <Bug size={48} />
                <p>No bugs reported</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section full-width">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button className="action-card" onClick={() => navigate('/tasks')}>
              <div className="action-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                <Bug size={24} />
              </div>
              <div className="action-content">
                <h3>Report New Bug</h3>
                <p>Create a new bug report</p>
              </div>
              <ArrowRight size={20} />
            </button>
            
            <button className="action-card" onClick={() => navigate('/documents')}>
              <div className="action-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
                <CheckCircle size={24} />
              </div>
              <div className="action-content">
                <h3>Test Documentation</h3>
                <p>Access test cases & plans</p>
              </div>
              <ArrowRight size={20} />
            </button>
            
            <button className="action-card" onClick={() => navigate('/analytics')}>
              <div className="action-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
                <TrendingUp size={24} />
              </div>
              <div className="action-content">
                <h3>View Reports</h3>
                <p>Check testing analytics</p>
              </div>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QADashboard;
