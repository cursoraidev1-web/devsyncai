'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
;
import { useApp } from '../../../../context/AppContext';
import { fetchHandoffs } from '../../../../api/handoffs';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';
import '../../../../styles/pages/Dashboard.css';

const PMDashboard = () => {
  const router = useRouter();
  const { projects, tasks, documents, teams, loadTeams, loadProjects, loadAllTasks, projectsLoading, tasksLoading } = useApp();
  const [handoffs, setHandoffs] = useState([]);
  const [handoffsLoading, setHandoffsLoading] = useState(false);

  useEffect(() => {
    // Ensure data is loaded when dashboard mounts
    loadProjects();
    loadAllTasks();
    loadTeams();
    loadHandoffs();
  }, [loadProjects, loadAllTasks, loadTeams]);

  const loadHandoffs = async () => {
    setHandoffsLoading(true);
    try {
      const data = await fetchHandoffs();
      setHandoffs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load handoffs:', error);
      setHandoffs([]);
    } finally {
      setHandoffsLoading(false);
    }
  };

  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const teamMembersCount = teams.reduce((acc, team) => acc + (team.members || team.member_count || 0), 0);

  const stats = [
    {
      label: 'Active Projects',
      value: activeProjectsCount,
      icon: FileText,
      color: '#4f46e5',
      trend: activeProjectsCount > 0 ? `${activeProjectsCount} active` : 'No active projects'
    },
    {
      label: 'Completed Tasks',
      value: completedTasksCount,
      icon: CheckCircle,
      color: '#10b981',
      trend: completedTasksCount > 0 ? `${completedTasksCount} completed` : 'No completed tasks'
    },
    {
      label: 'Pending Approvals',
      value: handoffs.filter(h => h.status === 'pending' || h.status === 'in-review').length,
      icon: AlertCircle,
      color: '#f59e0b',
      trend: handoffs.filter(h => h.status === 'pending' || h.status === 'in-review').length > 0 
        ? `${handoffs.filter(h => h.status === 'pending' || h.status === 'in-review').length} pending` 
        : 'No pending'
    },
    {
      label: 'Team Members',
      value: teamMembersCount,
      icon: Users,
      color: '#8b5cf6',
      trend: teamMembersCount > 0 ? `${teamMembersCount} members` : 'No members'
    }
  ];

  const activeProjects = projects.filter(p => p.status === 'active');
  const recentTasks = tasks.slice(0, 5);
  const recentDocs = documents.slice(0, 3);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Product Manager Dashboard</h1>
          <p className="dashboard-subtitle">Monitor projects and team performance</p>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/prd-designer')}>
          <FileText size={18} />
          New PRD
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
              <div className="stat-trend" style={{ color: stat.value === 0 ? '#718096' : 'inherit' }}>
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Active Projects */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Active Projects</h2>
            <button className="btn btn-outline" onClick={() => router.push('/projects')}>
              View All
            </button>
          </div>
          <div className="projects-list">
            {projectsLoading ? (
              <div className="empty-state">
                <FileText size={48} />
                <p>Loading projects...</p>
              </div>
            ) : activeProjects.length > 0 ? (
              activeProjects.map(project => (
                <div key={project.id} className="project-card">
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <div className="project-meta">
                    <span className="badge badge-primary">{project.status}</span>
                    <span className="project-team">
                      <Users size={14} />
                      {project.members || project.member_count || (Array.isArray(project.team) ? project.team.length : 0)} members
                    </span>
                  </div>
                </div>
                <div className="project-progress">
                  <div className="progress-info">
                    <span className="progress-label">Progress</span>
                    <span className="progress-value">{project.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <div className="project-footer">
                  <div className="project-deadline">
                    <Clock size={14} />
                    Due {project.deadline}
                  </div>
                  <button className="btn-link">
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              ))
            ) : (
              <div className="empty-state">
                <FileText size={48} />
                <p>No active projects</p>
                <button className="btn btn-primary" onClick={() => router.push('/projects')}>
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Tasks</h2>
            <button className="btn btn-outline" onClick={() => router.push('/tasks')}>
              View All
            </button>
          </div>
          <div className="activity-list">
            {tasksLoading ? (
              <div className="empty-state">
                <CheckCircle size={48} />
                <p>Loading tasks...</p>
              </div>
            ) : recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <div key={task.id} className="activity-item">
                <div className="activity-icon">
                  {task.status === 'completed' ? (
                    <CheckCircle size={18} className="text-success" />
                  ) : (
                    <Clock size={18} className="text-warning" />
                  )}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{task.title}</div>
                  <div className="activity-meta">
                    <span className={`badge badge-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'}`}>
                      {task.priority}
                    </span>
                    <span className="activity-date">Due {task.dueDate}</span>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="empty-state">
                <CheckCircle size={48} />
                <p>No recent tasks</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="dashboard-section full-width">
          <div className="section-header">
            <h2>Recent Documents</h2>
            <button className="btn btn-outline" onClick={() => router.push('/documents')}>
              View All
            </button>
          </div>
          <div className="documents-grid">
            {recentDocs.length > 0 ? (
              recentDocs.map(doc => (
                <div key={doc.id} className="document-card">
                <div className="document-icon">
                  <FileText size={32} />
                </div>
                <div className="document-info">
                  <h3>{doc.name}</h3>
                  <div className="document-meta">
                    <span className="document-size">{doc.size}</span>
                    <span className="document-date">{doc.uploadedAt}</span>
                  </div>
                  <div className="document-tags">
                    {doc.tags.map((tag, idx) => (
                      <span key={idx} className="badge badge-secondary">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="empty-state">
                <FileText size={48} />
                <p>No documents yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMDashboard;
