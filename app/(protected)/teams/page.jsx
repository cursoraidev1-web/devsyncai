'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { usePlan } from '../../../context/PlanContext';
import { Plus, Search, Filter, Users, Mail, Phone, MoreVertical, UserPlus } from 'lucide-react';
import { Modal } from '../../../components/ui';
import PulsingLoader from '../../../components/PulsingLoader';
import '../../styles/pages/Teams.css';

const Teams = () => {
  const { teams, teamsLoading, loadTeams, createTeam, teamMembers, loadTeamMembers, openUpgradeModal } = useApp();
  const { canCreate, getRemaining, limits, usage } = usePlan();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
                      <button className="team-more-btn">
                        <MoreVertical size={18} />
                      </button>
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
              onClick={() => setShowCreateModal(false)}
            >
              Create Team
            </button>
          </>
        }
      >
        <CreateTeamForm />
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

const CreateTeamForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: []
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="create-team-form">
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
        />
      </div>

      <div className="form-group">
        <label htmlFor="team-members">Initial Members</label>
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
            type="text"
            placeholder="Invite via Email..."
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
      </div>
    </div>
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

