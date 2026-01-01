'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { toast } from 'react-toastify';
import { useApp } from '../../../../context/AppContext';
import { getProject } from '../../../../api/projects';
import { handleApiError } from '../../../../utils/errorHandler';
import '../../../../styles/pages/ProjectDetail.css';

/**
 * Project Detail Page Component
 * Displays detailed information about a specific project.
 * 
 * Security: Implements client-side ownership validation to prevent IDOR attacks.
 * If a project is not in the user's projects list, access is denied.
 * 
 * @component
 */
const ProjectDetail = () => {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { projects, tasks } = useApp();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    /**
     * Loads project data with security validation
     * First checks if project exists in user's context (ownership validation)
     * Only fetches from API if project is in user's list
     */
    const loadProjectData = async () => {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      try {
        // SEC-001 FIX: Client-side ownership validation to prevent IDOR
        // Check if project exists in user's projects list first
        const projectFromContext = projects.find(p => p.id === id);
        
        if (projectFromContext) {
          // Project is in user's context, safe to display
          setProject(projectFromContext);
        } else if (projects.length > 0) {
          // User has projects but this one is not in the list
          // This indicates either:
          // 1. Project doesn't exist
          // 2. User doesn't have access (IDOR protection)
          setAccessDenied(true);
          setError('You do not have access to this project or it does not exist.');
          toast.error('Access denied. This project is not available in your workspace.');
        } else {
          // No projects loaded yet, try to fetch (might be loading)
          // But still validate on backend
          try {
            const response = await getProject(id);
            const projectData = response?.data || response;
            
            // Additional validation: if we get a project but it's not in context,
            // it might be a race condition or access issue
            if (projectData) {
              setProject(projectData);
            } else {
              setError('Project not found');
            }
          } catch (fetchError) {
            const errorInfo = handleApiError(fetchError);
            if (errorInfo.type === 'NOT_FOUND' || errorInfo.type === 'FORBIDDEN') {
              setAccessDenied(true);
              setError(errorInfo.message || 'You do not have access to this project.');
            } else {
              setError(errorInfo.message || 'Failed to load project');
              toast.error(errorInfo.message || 'Failed to load project');
            }
          }
        }
      } catch (error) {
        const errorInfo = handleApiError(error);
        setError(errorInfo.message || 'An unexpected error occurred');
        toast.error(errorInfo.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProjectData();
    } else {
      setLoading(false);
      setError('Invalid project ID');
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

  // UX-004 FIX: Use router.back() for better navigation context
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/projects');
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

  if (accessDenied || !project) {
    return (
      <div className="project-detail-page">
        <div className="project-detail-header">
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <AlertCircle size={48} style={{ color: '#EF4444', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>
            {accessDenied ? 'Access Denied' : 'Project not found'}
          </h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>
            {error || 'The project you\'re looking for doesn\'t exist or you don\'t have access to it.'}
          </p>
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
        <button className="back-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back
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

