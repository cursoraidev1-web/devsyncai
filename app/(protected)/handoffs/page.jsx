'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
;
import { Search, Filter, Plus, ArrowRightLeft, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { fetchHandoffs, createHandoff as apiCreateHandoff } from '../../../api/handoffs';
import { fetchProjects } from '../../../api/projects';
import { getTeamMembers } from '../../../api/teams';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { Modal } from '../../../components/ui';
import { Select } from '../../../components/ui';
import { toast } from 'react-toastify';
import PulsingLoader from '../../../components/PulsingLoader';
import '../../styles/pages/HandoffSystem.css';

const HandoffSystem = () => {
  const router = useRouter();
  const { projects, teams, loadTeams } = useApp();
  const { user } = useAuth();
  const [handoffs, setHandoffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const loadHandoffs = async () => {
      try {
        const data = await fetchHandoffs();
        setHandoffs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load handoffs:', error);
        toast.error('Failed to load handoffs');
        setHandoffs([]);
      } finally {
        setLoading(false);
      }
    };
    loadHandoffs();
    loadTeams();
  }, [loadTeams]);

  useEffect(() => {
    const loadUsers = async () => {
      if (teams.length === 0) return;
      setLoadingUsers(true);
      try {
        const allUsers = [];
        for (const team of teams) {
          try {
            const members = await getTeamMembers(team.id);
            if (Array.isArray(members)) {
              members.forEach(member => {
                if (!allUsers.find(u => u.id === member.id || u.id === member.user_id)) {
                  allUsers.push({
                    id: member.id || member.user_id,
                    name: member.name || member.fullName || `${member.firstName || ''} ${member.lastName || ''}`.trim(),
                    email: member.email,
                    role: member.role
                  });
                }
              });
            }
          } catch (error) {
            console.error(`Failed to load members for team ${team.id}:`, error);
          }
        }
        setAvailableUsers(allUsers);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    if (showCreateModal) {
      loadUsers();
    }
  }, [teams, showCreateModal]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="status-icon completed" />;
      case 'in-review':
        return <AlertCircle size={16} className="status-icon in-review" />;
      case 'pending':
        return <Clock size={16} className="status-icon pending" />;
      default:
        return <Clock size={16} className="status-icon" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'in-review': 'In Review',
      'completed': 'Completed'
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': '#EF4444',
      'medium': '#F59E0B',
      'low': '#10B981'
    };
    return colors[priority] || '#718096';
  };

  const filteredHandoffs = handoffs.filter(handoff => {
    const matchesSearch = handoff.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         handoff.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || handoff.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="handoff-system-page">
      <div className="handoff-header">
        <div>
          <h1>Handoff System</h1>
          <p className="handoff-subtitle">Manage handoffs between teams and track their progress.</p>
        </div>
        <button className="handoff-new-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          New Handoff
        </button>
      </div>

      <div className="handoff-controls">
        <div className="handoff-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search handoffs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="handoff-filters">
          <button
            className={`handoff-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`handoff-filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`handoff-filter-btn ${filter === 'in-review' ? 'active' : ''}`}
            onClick={() => setFilter('in-review')}
          >
            In Review
          </button>
          <button
            className={`handoff-filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <PulsingLoader message="Loading handoffs..." />
      ) : handoffs.length > 0 ? (
        <div className="handoff-list">
          {filteredHandoffs.map(handoff => (
            <div
              key={handoff.id}
              className="handoff-card"
              onClick={() => router.push(`/handoffs/${handoff.id}`)}
            >
              <div className="handoff-card-header">
                <div className="handoff-title-section">
                  <div className="handoff-icon">
                    <ArrowRightLeft size={20} />
                  </div>
                  <div>
                    <h3 className="handoff-title">{handoff.title}</h3>
                    <div className="handoff-meta">
                      <span className="handoff-from">
                        <User size={14} />
                        {handoff.from}
                      </span>
                      <span className="handoff-arrow">→</span>
                      <span className="handoff-to">
                        <User size={14} />
                        {handoff.to}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="handoff-status-section">
                  <div className="handoff-status">
                    {getStatusIcon(handoff.status)}
                    <span>{getStatusLabel(handoff.status)}</span>
                  </div>
                  <div
                    className="handoff-priority"
                    style={{ color: getPriorityColor(handoff.priority) }}
                  >
                    {handoff.priority.toUpperCase()}
                  </div>
                </div>
              </div>
              <p className="handoff-description">{handoff.description}</p>
              <div className="handoff-card-footer">
                <div className="handoff-dates">
                  <span className="handoff-date">
                    <Clock size={14} />
                    Created {handoff.createdAt}
                  </span>
                  <span className="handoff-date">
                    Due: {handoff.dueDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="handoff-empty">
          <ArrowRightLeft size={48} style={{ color: '#718096', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No handoffs yet</h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>Create your first handoff to transfer work between team members</p>
          <button className="handoff-new-btn" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} />
            Create Handoff
          </button>
        </div>
      )}

      {handoffs.length > 0 && filteredHandoffs.length === 0 && (
        <div className="handoff-empty">
          <ArrowRightLeft size={48} style={{ color: '#718096', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No handoffs found</h3>
          <p style={{ color: '#718096' }}>Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Create Handoff Modal */}
      <CreateHandoffModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          // Reload handoffs
          fetchHandoffs()
            .then(data => setHandoffs(Array.isArray(data) ? data : []))
            .catch(error => {
              console.error('Failed to reload handoffs:', error);
            });
        }}
        projects={projects}
        users={availableUsers}
        currentUser={user}
        loadingUsers={loadingUsers}
      />
    </div>
  );
};

// Create Handoff Modal Component
const CreateHandoffModal = ({ isOpen, onClose, onSuccess, projects, users, currentUser, loadingUsers }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    from_user_id: currentUser?.id || '',
    to_user_id: '',
    project_id: '',
    priority: 'medium',
    due_date: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.to_user_id) {
      newErrors.to_user_id = 'Please select a recipient';
    }
    if (!formData.project_id) {
      newErrors.project_id = 'Please select a project';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        from_user_id: formData.from_user_id || currentUser?.id,
        to_user_id: formData.to_user_id,
        project_id: formData.project_id,
        priority: formData.priority,
        ...(formData.due_date && { due_date: formData.due_date })
      };

      await apiCreateHandoff(payload);
      toast.success('Handoff created successfully!');
      setFormData({
        title: '',
        description: '',
        from_user_id: currentUser?.id || '',
        to_user_id: '',
        project_id: '',
        priority: 'medium',
        due_date: ''
      });
      setErrors({});
      onSuccess();
    } catch (error) {
      console.error('Failed to create handoff:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to create handoff. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Handoff"
      subtitle="Transfer work between team members"
      size="lg"
      footer={
        <>
          <button
            className="modal-btn-cancel"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="modal-btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Handoff'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="create-handoff-form">
        <div className="form-group">
          <label htmlFor="handoff-title">
            Title <span className="required">*</span>
          </label>
          <input
            id="handoff-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="e.g., Handoff frontend work to QA team"
            required
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="handoff-description">Description</label>
          <textarea
            id="handoff-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Add details about what is being handed off..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="handoff-from">
              From
            </label>
            <input
              id="handoff-from"
              type="text"
              value={currentUser?.name || currentUser?.fullName || 'You'}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="handoff-to">
              To <span className="required">*</span>
            </label>
            <Select
              id="handoff-to"
              name="to_user_id"
              value={formData.to_user_id}
              onChange={handleChange}
              error={errors.to_user_id}
              required
            >
              <option value="">Select a team member...</option>
              {loadingUsers ? (
                <option disabled>Loading users...</option>
              ) : (
                users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.email ? `(${user.email})` : ''}
                  </option>
                ))
              )}
            </Select>
            {errors.to_user_id && <span className="error-message">{errors.to_user_id}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="handoff-project">
            Project <span className="required">*</span>
          </label>
          <Select
            id="handoff-project"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            error={errors.project_id}
            required
          >
            <option value="">Select a project...</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
          {errors.project_id && <span className="error-message">{errors.project_id}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="handoff-priority">Priority</label>
            <Select
              id="handoff-priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div className="form-group">
            <label htmlFor="handoff-due-date">Due Date</label>
            <input
              id="handoff-due-date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default HandoffSystem;

