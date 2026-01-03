'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { usePlan } from '../../../context/PlanContext';
import { Plus, Search, Filter, Users, Mail, Phone, MoreVertical, UserPlus, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../../../components/ui';
import PulsingLoader from '../../../components/PulsingLoader';
import { toast } from 'react-toastify';
import '../../../styles/pages/Teams.css';

const Teams = () => {
  const { teams, teamsLoading, loadTeams, createTeam, updateTeam, deleteTeam, teamMembers, loadTeamMembers, openUpgradeModal } = useApp();
  const { canCreate, getRemaining, limits, usage } = usePlan();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleAddMemberClick = () => {
    if (!canCreate('teamMember')) {
      const remaining = getRemaining('teamMember');
      const maxLimit = limits?.maxTeamMembers === -1 ? 'unlimited' : limits?.maxTeamMembers;
      const currentUsage = usage?.teamMembersCount || 0;
      
      openUpgradeModal(
        `You've reached your team member limit (${currentUsage}/${maxLimit}). Upgrade your plan to invite more team members.`
      );
      return;
    }
    setShowAddMemberModal(true);
  };

  const handleEditTeam = (team) => {
    setTeamToEdit(team);
    setShowEditModal(true);
    setOpenDropdownId(null);
  };

  const handleDeleteTeam = async (team) => {
    if (window.confirm(`Are you sure you want to delete "${team.name}"? This action cannot be undone.`)) {
      try {
        await deleteTeam(team.id);
        toast.success('Team deleted successfully');
        setOpenDropdownId(null);
      } catch (error) {
        toast.error(error?.message || 'Failed to delete team');
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!openDropdownId) return;

    const handleClickOutside = (event) => {
      const dropdownRef = dropdownRefs.current[openDropdownId];
      if (dropdownRef && !dropdownRef.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    // Delay to avoid immediate closure on button click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  return (
    <div className="teams-page">
      <div className="teams-header">
        <div>
          <h1>Teams</h1>
          <p className="teams-subtitle">Manage your teams and members</p>
        </div>
        <button 
          className="teams-new-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} />
          New Team
        </button>
      </div>

      <div className="teams-controls">
        <div className="teams-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search teams or members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="teams-filter-btn">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {teamsLoading ? (
        <PulsingLoader message="Loading teams..." />
      ) : (
        <div className="teams-content">
          <div className="teams-section">
            <h2 className="teams-section-title">Teams</h2>
            <div className="teams-grid">
              {teams.length > 0 ? (
              <>
                {teams.map(team => (
                  <div key={team.id} className="team-card">
                    <div className="team-card-header">
                      <div className="team-avatar">{team.avatar}</div>
                      <div 
                        ref={(el) => {
                          if (el) dropdownRefs.current[team.id] = el;
                        }}
                        style={{ position: 'relative' }}
                      >
                        <button 
                          className="team-more-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setOpenDropdownId(openDropdownId === team.id ? null : team.id);
                          }}
                          type="button"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {openDropdownId === team.id && (
                          <div className="team-dropdown-menu">
                            <button
                              type="button"
                              className="team-dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTeam(team);
                              }}
                            >
                              <Edit size={16} />
                              <span>Edit Team</span>
                            </button>
                            <button
                              type="button"
                              className="team-dropdown-item team-dropdown-item-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTeam(team);
                              }}
                            >
                              <Trash2 size={16} />
                              <span>Delete Team</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="team-name">{team.name}</h3>
                    <p className="team-description">{team.description}</p>
                    <div className="team-stats">
                      <div className="team-stat">
                        <Users size={16} />
                        <span>{team.members} Members</span>
                      </div>
                      <div className="team-stat">
                        <span>{team.projects} Projects</span>
                      </div>
                    </div>
                    <button 
                      className="team-view-btn"
                      onClick={handleAddMemberClick}
                    >
                      View Team
                    </button>
                  </div>
                ))}
                <div 
                  className="team-card team-card-add"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={48} />
                  <span>Create New Team</span>
                </div>
              </>
            ) : (
              <>
                <div className="team-empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                  <Users size={48} style={{ color: '#718096', marginBottom: '16px' }} />
                  <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No teams yet</h3>
                  <p style={{ color: '#718096', marginBottom: '24px' }}>Create your first team to get started</p>
                </div>
                <div 
                  className="team-card team-card-add"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={48} />
                  <span>Create New Team</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="teams-section">
          <h2 className="teams-section-title">All Members</h2>
          <div className="members-list">
            {teamMembers.length > 0 ? (
              teamMembers.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">{member.avatar}</div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-email">{member.email}</div>
                    <div className="member-meta">
                      <span className="member-role">{member.role}</span>
                      <span className="member-team">{member.team}</span>
                    </div>
                  </div>
                  <div className="member-actions">
                    <button className="member-action-btn">
                      <Mail size={16} />
                    </button>
                    <button className="member-action-btn">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="team-empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                <UserPlus size={48} style={{ color: '#718096', marginBottom: '16px' }} />
                <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No team members yet</h3>
                <p style={{ color: '#718096', marginBottom: '24px' }}>Invite team members to get started</p>
                <button 
                  className="teams-new-btn"
                  onClick={handleAddMemberClick}
                >
                  <UserPlus size={18} />
                  Invite Members
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Create New Team Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Team"
        subtitle="Set up a new team for your organization."
        size="md"
      >
        <CreateTeamForm onClose={() => setShowCreateModal(false)} />
      </Modal>

      {/* Edit Team Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setTeamToEdit(null);
        }}
        title="Edit Team"
        subtitle="Update team information."
        size="md"
      >
        {teamToEdit && (
          <EditTeamForm 
            team={teamToEdit}
            onClose={() => {
              setShowEditModal(false);
              setTeamToEdit(null);
            }} 
          />
        )}
      </Modal>

      {/* Add Team Members Modal */}
      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title="Add Team Members"
        subtitle="Invite members to join this team."
        size="md"
        footer={
          <>
            <button 
              className="modal-btn-cancel"
              onClick={() => setShowAddMemberModal(false)}
            >
              Cancel
            </button>
            <button 
              className="modal-btn-primary"
              onClick={() => setShowAddMemberModal(false)}
            >
              Add Members
            </button>
          </>
        }
      >
        <AddTeamMembersForm />
      </Modal>
    </div>
  );
};

const EditTeamForm = ({ team, onClose }) => {
  const { updateTeam, loadTeams } = useApp();
  const [formData, setFormData] = useState({
    name: team?.name || '',
    description: team?.description || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim().length < 3) {
      setError('Team name must be at least 3 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await updateTeam(team.id, {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      });
      await loadTeams();
      toast.success('Team updated successfully');
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to update team. Please try again.');
      toast.error(err?.message || 'Failed to update team');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-team-form">
      {error && (
        <div style={{ 
          padding: '12px', 
          background: '#fee2e2', 
          color: '#991b1b', 
          borderRadius: '8px', 
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      <div className="form-group">
        <label htmlFor="edit-team-name">Team Name *</label>
        <input
          type="text"
          id="edit-team-name"
          name="name"
          placeholder="e.g., Engineering Team"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          minLength={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-team-description">Description</label>
        <textarea
          id="edit-team-description"
          name="description"
          placeholder="Add a description for this team..."
          rows={4}
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button 
          type="button"
          className="modal-btn-cancel"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="modal-btn-primary"
          disabled={isSubmitting || !formData.name || formData.name.trim().length < 3}
        >
          {isSubmitting ? 'Updating...' : 'Update Team'}
        </button>
      </div>
    </form>
  );
};

const CreateTeamForm = ({ onClose }) => {
  const { createTeam, loadTeams } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim().length < 3) {
      setError('Team name must be at least 3 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createTeam({
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      });
      await loadTeams(); // Refresh teams list
      onClose();
      // Reset form
      setFormData({ name: '', description: '' });
    } catch (err) {
      setError(err?.message || 'Failed to create team. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-team-form">
      {error && (
        <div style={{ 
          padding: '12px', 
          background: '#fee2e2', 
          color: '#991b1b', 
          borderRadius: '8px', 
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      <div className="form-group">
        <label htmlFor="team-name">Team Name *</label>
        <input
          type="text"
          id="team-name"
          name="name"
          placeholder="e.g., Engineering Team"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          minLength={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="team-description">Description</label>
        <textarea
          id="team-description"
          name="description"
          placeholder="Add a description for this team..."
          rows={4}
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
        <button 
          type="button"
          className="modal-btn-cancel"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="modal-btn-primary"
          disabled={isSubmitting || !formData.name || formData.name.trim().length < 3}
        >
          {isSubmitting ? 'Creating...' : 'Create Team'}
        </button>
      </div>
    </form>
  );
};

const AddTeamMembersForm = () => {
  const { sendInvite, projects, openUpgradeModal } = useApp();
  const { canCreate, limits, usage } = usePlan();
  const [formData, setFormData] = useState({
    members: []
  });
  const [status, setStatus] = useState('');

  return (
    <div className="add-members-form">
      <div className="form-group">
        <label htmlFor="member-email">Email Address</label>
        <div className="members-input">
          {formData.members.map((member, idx) => (
            <span key={idx} className="member-chip">
              {member}
              <button 
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    members: formData.members.filter((_, i) => i !== idx)
                  });
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="email"
            placeholder="Enter email address..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                e.preventDefault();
                setFormData({
                  ...formData,
                  members: [...formData.members, e.target.value]
                });
                e.target.value = '';
              }
            }}
          />
        </div>
        <p className="form-help-text">Press Enter to add each email address</p>
      </div>
      <button
        className="team-invite-submit"
        onClick={async () => {
          const projectId = projects?.[0]?.id;
          if (!projectId) {
            setStatus('Please create a project before sending invites.');
            return;
          }

          // Check team member limit
          if (!canCreate('teamMember')) {
            const maxLimit = limits?.maxTeamMembers === -1 ? 'unlimited' : limits?.maxTeamMembers;
            const currentUsage = usage?.teamMembersCount || 0;
            setStatus(`Team member limit reached (${currentUsage}/${maxLimit}). Upgrade your plan to invite more members.`);
            openUpgradeModal(
              `You've reached your team member limit (${currentUsage}/${maxLimit}). Upgrade your plan to invite more team members.`
            );
            return;
          }

          try {
            await Promise.all(
              formData.members.map((email) =>
                sendInvite({ projectId, email, role: 'developer' })
              )
            );
            setStatus('Invites sent successfully.');
          } catch (err) {
            const msg = err?.message || 'Unable to send invites';
            setStatus(msg);
            openUpgradeModal(msg);
          }
        }}
      >
        Send Invites
      </button>
      {status && <p className="form-help-text">{status}</p>}
    </div>
  );
};

export default Teams;

