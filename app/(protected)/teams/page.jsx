'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { usePlan } from '../../../context/PlanContext';
import { Plus, Search, Filter, Users, Mail, Phone, MoreVertical, UserPlus, Edit, Trash2 } from 'lucide-react';
import { Modal } from '../../../components/ui';
import PulsingLoader from '../../../components/PulsingLoader';
import { toast } from 'react-toastify';
import { useCompany } from '../../../context/CompanyContext';
import { inviteUserToCompany, getCompanyMembers } from '../../../api/auth';
import '../../../styles/pages/Teams.css';

const Teams = () => {
  const router = useRouter();
  const { teams, teamsLoading, loadTeams, createTeam, updateTeam, deleteTeam, openUpgradeModal } = useApp();
  const { canCreate, getRemaining, limits, usage } = usePlan();
  const { currentCompany } = useCompany();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [teamToEdit, setTeamToEdit] = useState(null);
  const [companyMembers, setCompanyMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const dropdownRefs = useRef({});

  // Load teams on mount
  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // Load company members so the "All Members" section is populated
  useEffect(() => {
    if (!currentCompany?.id) return;
    setMembersLoading(true);
    getCompanyMembers(currentCompany.id)
      .then((data) => {
        const list = data?.data || data || [];
        setCompanyMembers(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error('Failed to load company members', err);
        setCompanyMembers([]);
      })
      .finally(() => setMembersLoading(false));
  }, [currentCompany?.id]);

  // Apply search filter to teams
  const filteredTeams = teams.filter((team) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      team.name?.toLowerCase().includes(q) ||
      team.description?.toLowerCase().includes(q)
    );
  });

  // Apply search filter to members
  const filteredMembers = companyMembers.filter((member) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const user = member.user || member;
    return (
      user.full_name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      member.role?.toLowerCase().includes(q)
    );
  });

  const handleAddMemberClick = () => {
    if (!canCreate('teamMember')) {
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="teams-new-btn"
            onClick={handleAddMemberClick}
            style={{ background: 'var(--color-surface)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
          >
            <UserPlus size={18} />
            Invite Members
          </button>
          <button
            className="teams-new-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            New Team
          </button>
        </div>
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
          {/* ── Teams grid ── */}
          <div className="teams-section">
            <h2 className="teams-section-title">
              Teams{filteredTeams.length > 0 ? ` (${filteredTeams.length})` : ''}
            </h2>
            <div className="teams-grid">
              {filteredTeams.length > 0 ? (
                <>
                  {filteredTeams.map(team => (
                    <div key={team.id} className="team-card">
                      <div className="team-card-header">
                        {/* Bug 2 Fix: derive avatar from team name instead of team.avatar */}
                        <div className="team-avatar">
                          {team.name?.charAt(0).toUpperCase() || 'T'}
                        </div>
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
                      <p className="team-description">{team.description || 'No description'}</p>
                      <div className="team-stats">
                        <div className="team-stat">
                          <Users size={16} />
                          <span>
                            {typeof team.member_count === 'number'
                              ? `${team.member_count} Members`
                              : Array.isArray(team.members)
                                ? `${team.members.length} Members`
                                : '0 Members'}
                          </span>
                        </div>
                        {team.team_lead && (
                          <div className="team-stat">
                            <span>Lead: {team.team_lead.full_name}</span>
                          </div>
                        )}
                      </div>
                      <button
                        className="team-view-btn"
                        onClick={() => router.push(`/teams/${team.id}`)}
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
                  {searchQuery ? (
                    <div className="team-empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                      <Search size={48} style={{ color: '#718096', marginBottom: '16px' }} />
                      <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No teams match your search</h3>
                      <p style={{ color: '#718096' }}>Try a different search term</p>
                    </div>
                  ) : (
                    <div className="team-empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                      <Users size={48} style={{ color: '#718096', marginBottom: '16px' }} />
                      <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No teams yet</h3>
                      <p style={{ color: '#718096', marginBottom: '24px' }}>Create your first team to get started</p>
                    </div>
                  )}
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

          {/* ── All Members (company members) ── */}
          <div className="teams-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="teams-section-title" style={{ margin: 0 }}>
                All Members
                {filteredMembers.length > 0 ? ` (${filteredMembers.length})` : ''}
              </h2>
              <button className="teams-new-btn" onClick={handleAddMemberClick} style={{ padding: '8px 16px', fontSize: '13px' }}>
                <UserPlus size={16} />
                Invite
              </button>
            </div>
            {membersLoading ? (
              <PulsingLoader message="Loading members..." />
            ) : (
              <div className="members-list">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => {
                    // Backend returns: { id, role, user: { id, full_name, email, avatar_url } }
                    const user = member.user || member;
                    const name = user.full_name || user.name || 'Unknown';
                    const email = user.email || '';
                    const avatarUrl = user.avatar_url;
                    const initial = name.charAt(0).toUpperCase();

                    return (
                      <div key={member.id} className="member-card">
                        <div className="member-avatar">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={name}
                              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            initial
                          )}
                        </div>
                        <div className="member-info">
                          <div className="member-name">{name}</div>
                          <div className="member-email">{email}</div>
                          <div className="member-meta">
                            <span className="member-role">{member.role || 'member'}</span>
                          </div>
                        </div>
                        <div className="member-actions">
                          {email && (
                            <button
                              className="member-action-btn"
                              title="Send email"
                              onClick={() => window.open(`mailto:${email}`)}
                            >
                              <Mail size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="team-empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                    <UserPlus size={48} style={{ color: '#718096', marginBottom: '16px' }} />
                    <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No members yet</h3>
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
            )}
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
        title="Invite Members"
        subtitle="Invite members to join this team or company."
        size="md"
      >
        <AddTeamMembersForm
          onClose={() => setShowAddMemberModal(false)}
          onInvited={() => {
            // Reload company members after a successful invite
            if (currentCompany?.id) {
              getCompanyMembers(currentCompany.id)
                .then((data) => {
                  const list = data?.data || data || [];
                  setCompanyMembers(Array.isArray(list) ? list : []);
                })
                .catch(() => { });
            }
          }}
        />
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
      toast.success('Team created successfully');
      onClose();
      // Reset form
      setFormData({ name: '', description: '' });
    } catch (err) {
      setError(err?.message || 'Failed to create team. Please try again.');
      toast.error(err?.message || 'Failed to create team');
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

const AddTeamMembersForm = ({ onClose, onInvited }) => {
  const { sendInvite, projects, openUpgradeModal } = useApp();
  const { canCreate, limits, usage } = usePlan();
  const { currentCompany } = useCompany();
  const [formData, setFormData] = useState({
    members: [],
    inviteType: 'company' // default to company invite
  });
  const [emailInput, setEmailInput] = useState('');
  const [status, setStatus] = useState('');
  const [inviting, setInviting] = useState(false);

  const addEmail = (value) => {
    const email = value.trim();
    if (!email) return;
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Please enter a valid email address.');
      return;
    }
    if (formData.members.includes(email)) {
      setStatus('Email already added.');
      return;
    }
    setFormData({ ...formData, members: [...formData.members, email] });
    setEmailInput('');
    setStatus('');
  };

  const handleInvite = async () => {
    if (formData.members.length === 0) {
      setStatus('Please add at least one email address.');
      return;
    }

    if (formData.inviteType === 'company' && !currentCompany?.id) {
      setStatus('No company selected. Please switch to a company first.');
      return;
    }

    if (formData.inviteType === 'project') {
      const projectId = projects?.[0]?.id;
      if (!projectId) {
        setStatus('Please create a project before sending project invites.');
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
    }

    setInviting(true);
    setStatus('');

    try {
      if (formData.inviteType === 'company') {
        // Send company invites
        await Promise.all(
          formData.members.map((email) =>
            inviteUserToCompany(currentCompany.id, { email, role: 'member' })
          )
        );
        toast.success('Company invites sent successfully!');
      } else {
        // Send project invites
        await Promise.all(
          formData.members.map((email) =>
            sendInvite({ projectId: projects[0].id, email, role: 'developer' })
          )
        );
        toast.success('Project invites sent successfully!');
      }

      setStatus('Invites sent successfully.');
      onInvited?.();
      setTimeout(() => {
        onClose?.();
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Unable to send invites';
      setStatus(msg);
      toast.error(msg);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="add-members-form">
      <div className="form-group">
        <label htmlFor="invite-type">Invite Type</label>
        <select
          id="invite-type"
          value={formData.inviteType}
          onChange={(e) => setFormData({ ...formData, inviteType: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            marginBottom: '4px'
          }}
        >
          <option value="company">Company Invite (Join the workspace)</option>
          <option value="project">Project Invite (Join a specific project)</option>
        </select>
        <p className="form-help-text">
          {formData.inviteType === 'company'
            ? 'Invite users to join your company workspace.'
            : 'Invite users to join a specific project only.'}
        </p>
      </div>
      <div className="form-group">
        <label htmlFor="member-email">Email Addresses</label>
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
            placeholder="Enter email and press Enter..."
            value={emailInput}
            onChange={(e) => { setEmailInput(e.target.value); setStatus(''); }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ',') && emailInput) {
                e.preventDefault();
                addEmail(emailInput);
              }
            }}
            onBlur={() => { if (emailInput) addEmail(emailInput); }}
          />
        </div>
        <p className="form-help-text">Press Enter or comma to add each email address</p>
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button
          className="modal-btn-cancel"
          onClick={onClose}
          disabled={inviting}
          style={{ flex: 1 }}
        >
          Cancel
        </button>
        <button
          className="modal-btn-primary"
          onClick={handleInvite}
          disabled={inviting || formData.members.length === 0}
          style={{ flex: 1 }}
        >
          {inviting ? 'Sending...' : `Send ${formData.members.length > 1 ? `${formData.members.length} ` : ''}Invite${formData.members.length !== 1 ? 's' : ''}`}
        </button>
      </div>
      {status && (
        <p className="form-help-text" style={{
          marginTop: '12px',
          color: status.includes('success') ? '#166534' : '#991b1b'
        }}>
          {status}
        </p>
      )}
    </div>
  );
};

export default Teams;
