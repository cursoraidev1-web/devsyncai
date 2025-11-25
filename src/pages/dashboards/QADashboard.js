import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
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

  const qaTasks = tasks.filter(t => t.assignee === 'qa' || t.tags.includes('testing'));
  
  const stats = [
    {
      label: 'Test Cases',
      value: 45,
      icon: CheckCircle,
      color: '#4f46e5',
      trend: '+12 this week'
    },
    {
      label: 'Open Bugs',
      value: 8,
      icon: Bug,
      color: '#ef4444',
      trend: '-3 from last week'
    },
    {
      label: 'Tests Pending',
      value: 12,
      icon: Clock,
      color: '#f59e0b',
      trend: '5 critical'
    },
    {
      label: 'Pass Rate',
      value: '94%',
      icon: TrendingUp,
      color: '#10b981',
      trend: '+2% improvement'
    }
  ];

  const testResults = [
    { id: 1, name: 'Authentication Flow', status: 'passed', tests: 24, failed: 0 },
    { id: 2, name: 'User Dashboard', status: 'passed', tests: 18, failed: 0 },
    { id: 3, name: 'Payment Integration', status: 'failed', tests: 15, failed: 3 },
    { id: 4, name: 'API Endpoints', status: 'running', tests: 32, failed: 0 }
  ];

  const recentBugs = [
    { id: 1, title: 'Login button not responsive on mobile', severity: 'high', status: 'open' },
    { id: 2, title: 'Dashboard data not loading', severity: 'critical', status: 'in-progress' },
    { id: 3, title: 'Typo in success message', severity: 'low', status: 'resolved' }
  ];

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
            {testResults.map(test => (
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
            ))}
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
            {recentBugs.map(bug => (
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
            ))}
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
