'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
;
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { fetchCommits, getCICDMetrics } from '../../../api/cicd';
import { 
  Code, 
  GitBranch, 
  CheckCircle, 
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import '../../../../styles/pages/Dashboard.css';

const DeveloperDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { tasks } = useApp();
  const [commits, setCommits] = useState([]);
  const [cicdMetrics, setCicdMetrics] = useState(null);
  const [loadingCICD, setLoadingCICD] = useState(false);

  useEffect(() => {
    loadCICDData();
  }, []);

  const loadCICDData = async () => {
    setLoadingCICD(true);
    try {
      const [commitsData, metricsData] = await Promise.all([
        fetchCommits({ limit: 5 }),
        getCICDMetrics()
      ]);
      setCommits(Array.isArray(commitsData) ? commitsData : []);
      setCicdMetrics(metricsData);
    } catch (error) {
      console.error('Failed to load CI/CD data:', error);
      setCommits([]);
      setCicdMetrics(null);
    } finally {
      setLoadingCICD(false);
    }
  };

  // Filter tasks assigned to current user (by user ID, not role)
  const myTasks = tasks.filter(t => 
    t.assigned_to === user?.id || 
    t.assignee_id === user?.id ||
    (user?.role === 'developer' && !t.assigned_to && !t.assignee_id) // Fallback: unassigned tasks for developers
  );
  const completedTasks = myTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = myTasks.filter(t => t.status === 'todo').length;

  const stats = [
    {
      label: 'In Progress',
      value: inProgressTasks,
      icon: Code,
      color: '#4f46e5',
      trend: inProgressTasks > 0 ? `${inProgressTasks} active` : 'No tasks in progress'
    },
    {
      label: 'To Do',
      value: todoTasks,
      icon: Clock,
      color: '#f59e0b',
      trend: todoTasks > 0 ? `${todoTasks} pending` : 'No tasks to do'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: '#10b981',
      trend: completedTasks > 0 ? `${completedTasks} completed` : 'No completed tasks'
    },
    {
      label: 'Pull Requests',
      value: cicdMetrics?.pull_requests?.open || cicdMetrics?.openPRs || 0,
      icon: GitBranch,
      color: '#8b5cf6',
      trend: (cicdMetrics?.pull_requests?.open || cicdMetrics?.openPRs || 0) > 0
        ? `${cicdMetrics?.pull_requests?.open || cicdMetrics?.openPRs || 0} open`
        : 'No active PRs'
    }
  ];

  const recentCommits = commits.slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Developer Dashboard</h1>
          <p className="dashboard-subtitle">Your tasks and code activity</p>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/tasks')}>
          <Code size={18} />
          View All Tasks
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
              {stat.value > 0 && (
                <div className="stat-trend">
                  {stat.trend}
                </div>
              )}
              {stat.value === 0 && (
                <div className="stat-trend" style={{ color: '#718096' }}>
                  {stat.trend}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* My Tasks */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Tasks</h2>
            <button className="btn btn-outline" onClick={() => router.push('/tasks')}>
              View All
            </button>
          </div>
          <div className="tasks-list">
            {myTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`badge ${
                    task.status === 'completed' ? 'badge-success' : 
                    task.status === 'in-progress' ? 'badge-primary' : 
                    'badge-secondary'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <div className="task-tags">
                    {task.tags.map((tag, idx) => (
                      <span key={idx} className="badge badge-secondary">{tag}</span>
                    ))}
                  </div>
                  <div className="task-meta">
                    <span className={`badge badge-${task.priority === 'high' ? 'danger' : 'warning'}`}>
                      {task.priority}
                    </span>
                    <span className="task-date">
                      <Clock size={14} />
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {myTasks.length === 0 && (
              <div className="empty-state">
                <CheckCircle size={48} />
                <p>No tasks assigned yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Commits */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Commits</h2>
            <button className="btn btn-outline" onClick={() => router.push('/ci-cd')}>
              View CI/CD
            </button>
          </div>
          <div className="activity-list">
            {loadingCICD ? (
              <div className="empty-state">
                <GitBranch size={48} />
                <p>Loading commits...</p>
              </div>
            ) : recentCommits.length > 0 ? (
              recentCommits.map(commit => (
                <div key={commit.id || commit.sha} className="activity-item">
                  <div className="activity-icon">
                    <GitBranch size={18} className="text-primary" />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {commit.message || commit.commit?.message || commit.title || 'No message'}
                    </div>
                    <div className="activity-meta">
                      <span className="badge badge-secondary">
                        {commit.branch || commit.ref || 'main'}
                      </span>
                      <span className="activity-date">
                        {commit.time || commit.created_at || commit.timestamp || 'Recently'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <GitBranch size={48} />
                <p>No recent commits</p>
                <p style={{ fontSize: '14px', color: '#718096' }}>Connect your CI/CD to see commit activity</p>
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
            <button className="action-card" onClick={() => router.push('/prd-designer')}>
              <div className="action-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
                <Code size={24} />
              </div>
              <div className="action-content">
                <h3>View PRDs</h3>
                <p>Check product requirements</p>
              </div>
              <ArrowRight size={20} />
            </button>
            
            <button className="action-card" onClick={() => router.push('/documents')}>
              <div className="action-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
                <CheckCircle size={24} />
              </div>
              <div className="action-content">
                <h3>Documentation</h3>
                <p>Access technical docs</p>
              </div>
              <ArrowRight size={20} />
            </button>
            
            <button className="action-card" onClick={() => router.push('/ci-cd')}>
              <div className="action-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
                <GitBranch size={24} />
              </div>
              <div className="action-content">
                <h3>CI/CD Pipeline</h3>
                <p>Monitor builds & deploys</p>
              </div>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
