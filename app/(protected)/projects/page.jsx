'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
;
import { Plus, Filter, ArrowUpDown, Grid, List, Calendar } from 'lucide-react';
import { Modal } from '../../../components/ui';
import { useApp } from '../../../context/AppContext';
import { usePlan } from '../../../context/PlanContext';
import { toast } from 'react-toastify';
import PulsingLoader from '../../../components/PulsingLoader';
import { CardSkeleton } from '../../../components/SkeletonLoader';
import '../../../styles/pages/Projects.css';

const Projects = () => {
  const router = useRouter();
  const { projects, projectsLoading, loadProjects, createProject, openUpgradeModal } = useApp();
  const { canCreate, getRemaining, limits, usage } = usePlan();
  const [view, setView] = useState('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    team: '',
    status: 'active',
    dueDate: '',
    members: [],
    visibility: 'private',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    if (activeTab === 'my') {
      return (projects || []).filter((p) => p.isMine);
    }
    return projects || [];
  }, [projects, activeTab]);

  const getStatusColor = (status) => {
    const colors = {
      'on-track': '#22C55E',
      'at-risk': '#F59E0B',
      'in-progress': '#3182CE',
      'on-hold': '#718096',
      'overdue': '#EF4444'
    };
    return colors[status] || '#718096';
  };

  const handleNewProjectClick = () => {
    if (!canCreate('project')) {
      const remaining = getRemaining('project');
      const maxLimit = limits?.maxProjects === -1 ? 'unlimited' : limits?.maxProjects;
      const currentUsage = usage?.projectsCount || 0;
      
      openUpgradeModal(
        `You've reached your project limit (${currentUsage}/${maxLimit}). Upgrade your plan to create more projects.`
      );
      return;
    }
    setShowCreateModal(true);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'on-track': 'On Track',
      'at-risk': 'At Risk',
      'in-progress': 'In Progress',
      'on-hold': 'On Hold',
      'overdue': 'Overdue'
    };
    return labels[status] || status;
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p className="projects-subtitle">Manage all your team's projects in one place.</p>
        </div>
        <button 
          className="projects-new-btn"
          onClick={handleNewProjectClick}
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="projects-controls">
        <div className="projects-tabs">
          <button
            className={`projects-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            View All
          </button>
          <button
            className={`projects-tab ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            My Projects
          </button>
        </div>
        <div className="projects-filters">
          <button className="projects-filter-btn">
            <Filter size={18} />
            Filter
          </button>
          <button className="projects-filter-btn">
            <ArrowUpDown size={18} />
            Sort By
          </button>
          <div className="projects-view-toggle">
            <button
              className={`view-toggle-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-toggle-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {projectsLoading ? (
        view === 'grid' ? (
          <div className="projects-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <PulsingLoader message="Loading projects..." />
        )
      ) : (
        <>
      {view === 'grid' && (
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="project-card"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="project-card-header">
                <h3 className="project-card-title">{project.name}</h3>
                <span 
                  className="project-status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(project.status)}15`,
                    color: getStatusColor(project.status)
                  }}
                >
                  {getStatusLabel(project.status)}
                </span>
              </div>
              <p className="project-card-team">{project.team}</p>
              <p className="project-card-description">{project.description}</p>
              <div className="project-progress-section">
                <div className="project-progress-header">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="project-progress-bar">
                  <div 
                    className="project-progress-fill"
                    style={{ 
                      width: `${project.progress}%`,
                      backgroundColor: getStatusColor(project.status)
                    }}
                  ></div>
                </div>
              </div>
              <div className="project-card-footer">
                <div className="project-members">
                  {Array.from({ length: Math.min(project.members, 3) }).map((_, i) => (
                    <div key={i} className="project-member-avatar">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {project.members > 3 && (
                    <span className="project-members-more">+{project.members - 3}</span>
                  )}
                </div>
                <div className="project-due-date">
                  <Calendar size={14} />
                  {project.dueDate}
                </div>
              </div>
            </div>
          ))}
          <div 
            className="project-card project-card-add"
            onClick={handleNewProjectClick}
          >
            <Plus size={48} />
            <span>Add New Project</span>
          </div>
        </div>
      )}

      {view === 'list' && !projectsLoading && (
        <div className="projects-list">
          <div className="projects-list-header">
            <div>Project Name</div>
            <div>Team</div>
            <div>Progress</div>
            <div>Status</div>
            <div>Due Date</div>
            <div>Actions</div>
          </div>
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="projects-list-item"
              onClick={() => router.push(`/projects/${project.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="list-item-name">
                <strong>{project.name}</strong>
                <p>{project.description}</p>
              </div>
              <div>{project.team}</div>
              <div>
                <div className="list-progress-bar">
                  <div 
                    className="list-progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span>{project.progress}%</span>
              </div>
              <div>
                <span 
                  className="list-status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(project.status)}15`,
                    color: getStatusColor(project.status)
                  }}
                >
                  {getStatusLabel(project.status)}
                </span>
              </div>
              <div>{project.dueDate}</div>
              <div>
                <button 
                  className="list-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/projects/${project.id}`);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}

      {/* Create New Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        subtitle="Fill out the details below to get your new project up and running."
        size="lg"
        footer={
          <>
            <button 
              className="modal-btn-cancel"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
            <button 
              className="modal-btn-primary"
              onClick={async () => {
                try {
                  const projectData = {
                    name: formState.name,
                    description: formState.description,
                  };
                  
                  // Add dates in ISO format if provided
                  if (formState.startDate) {
                    projectData.start_date = new Date(formState.startDate).toISOString();
                  }
                  if (formState.endDate) {
                    projectData.end_date = new Date(formState.endDate).toISOString();
                  }
                  
                  await createProject(projectData);
                  setShowCreateModal(false);
                  // Reset form
                  setFormState({
                    name: '',
                    description: '',
                    team: '',
                    status: 'active',
                    dueDate: '',
                    members: [],
                    visibility: 'private',
                    startDate: '',
                    endDate: ''
                  });
                } catch (err) {
                  const msg = err?.message || 'Unable to create project';
                  openUpgradeModal(msg);
                }
              }}
            >
              Create Project
            </button>
          </>
        }
      >
        <CreateProjectForm formState={formState} setFormState={setFormState} />
      </Modal>
    </div>
  );
};

const CreateProjectForm = ({ formState, setFormState }) => {
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormState({
      ...formState,
      [e.target.name]: value
    });
  };

  return (
    <div className="create-project-form">
      <div className="form-group">
        <label htmlFor="project-name">Project Name *</label>
        <input
          type="text"
          id="project-name"
          name="name"
          placeholder='e.g., "QuantumLeap Platform Launch"'
          value={formState.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="project-description">Description</label>
        <textarea
          id="project-description"
          name="description"
          placeholder="Add a short description of the project..."
          rows={4}
          value={formState.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="project-members">Team / Members</label>
        <div className="members-input">
          {formState.members?.map((member, idx) => (
            <span key={idx} className="member-chip">
              {member}
              <button 
                type="button"
                onClick={() => {
                  setFormState({
                    ...formState,
                    members: formState.members.filter((_, i) => i !== idx)
                  });
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Invite via Email or add team members..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                e.preventDefault();
                setFormState({
                  ...formState,
                  members: [...(formState.members || []), e.target.value]
                });
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Visibility</label>
        <div className="visibility-options">
          <label className={`visibility-option ${formState.visibility === 'private' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={formState.visibility === 'private'}
              onChange={handleChange}
            />
            <div>
              <strong>Private</strong>
              <p>Only invited members can see this project.</p>
            </div>
          </label>
          <label className={`visibility-option ${formState.visibility === 'public' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={formState.visibility === 'public'}
              onChange={handleChange}
            />
            <div>
              <strong>Public</strong>
              <p>Everyone in the organization can see it.</p>
            </div>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Start & End Date</label>
        <div className="date-inputs">
          <input
            type="date"
            name="startDate"
            value={formState.startDate || ''}
            onChange={handleChange}
          />
          <input
            type="date"
            name="endDate"
            value={formState.endDate || ''}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;


