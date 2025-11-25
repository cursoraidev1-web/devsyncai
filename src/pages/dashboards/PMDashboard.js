import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';
import './Dashboard.css';

const PMDashboard = () => {
  const navigate = useNavigate();
  const { projects, tasks, documents } = useApp();

  const stats = [
    {
      label: 'Active Projects',
      value: projects.filter(p => p.status === 'active').length,
      icon: FileText,
      color: '#4f46e5',
      trend: '+12%'
    },
    {
      label: 'Completed Tasks',
      value: tasks.filter(t => t.status === 'completed').length,
      icon: CheckCircle,
      color: '#10b981',
      trend: '+8%'
    },
    {
      label: 'Pending Approvals',
      value: 3,
      icon: AlertCircle,
      color: '#f59e0b',
      trend: '-2%'
    },
    {
      label: 'Team Members',
      value: 12,
      icon: Users,
      color: '#8b5cf6',
      trend: '+3'
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
        <button className="btn btn-primary" onClick={() => navigate('/prd-designer')}>
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
              <div className="stat-trend">
                <TrendingUp size={14} />
                {stat.trend} from last month
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
            <button className="btn btn-outline" onClick={() => navigate('/tasks')}>
              View All
            </button>
          </div>
          <div className="projects-list">
            {activeProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <div className="project-meta">
                    <span className="badge badge-primary">{project.status}</span>
                    <span className="project-team">
                      <Users size={14} />
                      {project.team.length} members
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
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Tasks</h2>
            <button className="btn btn-outline" onClick={() => navigate('/tasks')}>
              View All
            </button>
          </div>
          <div className="activity-list">
            {recentTasks.map(task => (
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
            ))}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="dashboard-section full-width">
          <div className="section-header">
            <h2>Recent Documents</h2>
            <button className="btn btn-outline" onClick={() => navigate('/documents')}>
              View All
            </button>
          </div>
          <div className="documents-grid">
            {recentDocs.map(doc => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMDashboard;
