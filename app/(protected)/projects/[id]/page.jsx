'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
;
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { getProject } from '../../../api/projects';
import '../../../styles/pages/ProjectDetail.css';

const ProjectDetail = () => {
  const params = useParams(); const id = params.id;
  const router = useRouter();
  const { projects, tasks } = useApp();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      setLoading(true);
      try {
        // First try to get from context
        const projectFromContext = projects.find(p => p.id === id);
        if (projectFromContext) {
          setProject(projectFromContext);
        } else {
          // If not in context, fetch from API
          const response = await getProject(id);
          const projectData = response?.data || response;
          setProject(projectData);
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProjectData();
    }
  }, [id, projects]);

  // Tasks are already loaded globally, just filter by project
  const projectTasks = React.useMemo(() => {
    if (!project?.id) return [];
    return tasks.filter(task => task.project_id === project.id);
  }, [tasks, project?.id]);

  const getStatusColor = (status) => {
    const colors = {
      'active': '#22C55E',
      'on-track': '#22C55E',
      'at-risk': '#F59E0B',
      'in-progress': '#3182CE',
      'on-hold': '#718096',
      'overdue': '#EF4444',
      'completed': '#10b981'
    };
    return colors[status] || '#718096';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'active': 'Active',
      'on-track': 'On Track',
      'at-risk': 'At Risk',
      'in-progress': 'In Progress',
      'on-hold': 'On Hold',
      'overdue': 'Overdue',
      'completed': 'Completed'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="project-detail-page">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div>Loading project...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="project-detail-header">
          <button className="back-btn" onClick={() => router.push('/projects')}>
            <ArrowLeft size={18} />
            Back to Projects
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <FileText size={48} style={{ color: '#718096', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>Project not found</h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>The project you're looking for doesn't exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => router.push('/projects')}>
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="project-detail-header">
        <button className="back-btn" onClick={() => router.push('/projects')}>
          <ArrowLeft size={18} />
          Back to Projects
        </button>
        <div className="project-actions">
          <button className="btn btn-outline">
            <Edit2 size={18} />
            Edit
          </button>
          <button className="btn btn-danger">
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="project-detail-content">
        <div className="project-main">
          <div className="project-title-section">
            <h1>{project.name}</h1>
            <div className="project-meta-badges">
              <div 
                className="project-status-badge"
                style={{ 
                  backgroundColor: `${getStatusColor(project.status)}15`,
                  color: getStatusColor(project.status)
                }}
              >
                {getStatusLabel(project.status)}
              </div>
            </div>
          </div>

          {project.description && (
            <div className="project-description-section">
              <h2>Description</h2>
              <p>{project.description}</p>
            </div>
          )}

          <div className="project-info-section">
            <h2>Project Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <Users size={16} />
                  Team
                </div>
                <div className="info-value">{project.team || project.team_name || 'Unassigned'}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Calendar size={16} />
                  Start Date
                </div>
                <div className="info-value">{formatDate(project.start_date || project.startDate)}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <Clock size={16} />
                  End Date
                </div>
                <div className="info-value">{formatDate(project.end_date || project.dueDate || project.deadline)}</div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  <CheckCircle size={16} />
                  Progress
                </div>
                <div className="info-value">{project.progress || 0}%</div>
              </div>
            </div>
          </div>

          {project.progress !== undefined && (
            <div className="project-progress-section">
              <div className="progress-header">
                <span>Overall Progress</span>
                <span>{project.progress || 0}%</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${project.progress || 0}%`,
                    backgroundColor: getStatusColor(project.status)
                  }}
                />
              </div>
            </div>
          )}

          <div className="project-tasks-section">
            <div className="section-header">
              <h2>Tasks</h2>
              <button className="btn btn-primary" onClick={() => router.push('/tasks')}>
                View All Tasks
              </button>
            </div>
            {(tasks || []).length > 0 ? (
              <div className="tasks-list">
                {(tasks || []).slice(0, 10).map(task => (
                  <div key={task.id} className="task-item">
                    <div className="task-title">{task.title}</div>
                    <div className="task-meta">
                      <span className={`badge badge-${task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'primary' : 'secondary'}`}>
                        {task.status}
                      </span>
                      <span className={`badge badge-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'secondary'}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
                {(projectTasks || []).length > 10 && (
                  <div className="tasks-more">
                    <button className="btn btn-outline" onClick={() => router.push('/tasks')}>
                      View {(projectTasks || []).length - 10} more tasks
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <FileText size={48} style={{ color: '#718096', marginBottom: '16px' }} />
                <p>No tasks yet</p>
                <button className="btn btn-primary" onClick={() => router.push('/tasks')}>
                  Create Task
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="project-sidebar">
          <div className="sidebar-section">
            <h3>Quick Info</h3>
            <div className="sidebar-info">
              <div className="sidebar-info-item">
                <span className="sidebar-label">Created</span>
                <span className="sidebar-value">{formatDate(project.created_at || project.createdAt)}</span>
              </div>
              <div className="sidebar-info-item">
                <span className="sidebar-label">Last Updated</span>
                <span className="sidebar-value">{formatDate(project.updated_at || project.updatedAt)}</span>
              </div>
              {project.owner_id && (
                <div className="sidebar-info-item">
                  <span className="sidebar-label">Owner ID</span>
                  <span className="sidebar-value" style={{ fontSize: '12px' }}>{project.owner_id}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

