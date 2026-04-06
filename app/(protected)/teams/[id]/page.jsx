'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '../../../../context/AppContext';
import { useCompany } from '../../../../context/CompanyContext';
import { Users, ArrowLeft, UserPlus, Mail, Search, Trash2 } from 'lucide-react';
import { Modal } from '../../../../components/ui';
import PulsingLoader from '../../../../components/PulsingLoader';
import { toast } from 'react-toastify';
import { getCompanyMembers } from '../../../../services/api/auth';
import '../../../../styles/pages/Teams.css';

const TEAM_ROLE_OPTIONS = [
  { value: 'developer', label: 'Developer' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'designer', label: 'Designer' },
  { value: 'qa', label: 'QA' },
  { value: 'devops', label: 'DevOps' },
  { value: 'admin', label: 'Admin' },
];

const TeamDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const teamId = params?.id;
  const {
    teams,
    teamMembers,
    teamsLoading,
    teamMembersLoading,
    loadTeamMembers,
    removeTeamMember,
  } = useApp();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const team = teams.find((item) => String(item.id) === String(teamId));

  useEffect(() => {
    if (teamId) {
      loadTeamMembers(teamId);
    }
  }, [teamId, loadTeamMembers]);

  const handleRemoveMember = async (member) => {
    const user = member.user || member;
    const name = user.full_name || user.fullName || user.name || 'this member';
    const memberUserId = member.user_id || user.id || member.id;

    if (!window.confirm(`Remove ${name} from this team?`)) return;

    try {
      await removeTeamMember(teamId, memberUserId);
      toast.success(`${name} removed from team`);
      await loadTeamMembers(teamId);
    } catch (err) {
      toast.error(err?.message || 'Failed to remove member');
    }
  };

  if (teamsLoading) {
    return <PulsingLoader message="Loading team..." />;
  }

  if (!team) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Users size={48} style={{ color: '#718096', marginBottom: '16px' }} />
        <h2 style={{ marginBottom: '8px' }}>Team not found</h2>
        <p style={{ color: '#718096', marginBottom: '24px' }}>The team you're looking for doesn't exist.</p>
        <button className="teams-new-btn" onClick={() => router.push('/teams')}>
          <ArrowLeft size={18} />
          Back to Teams
        </button>
      </div>
    );
  }

  return (
    <div className="teams-page">
      <div className="teams-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn btn-outline"
            onClick={() => router.push('/teams')}
            style={{ padding: '8px 12px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="team-avatar" style={{ width: '48px', height: '48px', fontSize: '20px', borderRadius: '12px' }}>
              {team.name?.charAt(0).toUpperCase() || 'T'}
            </div>
            <div>
              <h1>{team.name}</h1>
              <p className="teams-subtitle">{team.description || 'No description'}</p>
            </div>
          </div>
        </div>
        <button className="teams-new-btn" onClick={() => setShowAddMemberModal(true)}>
          <UserPlus size={18} />
          Add Members
        </button>
      </div>

      {team.team_lead && (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '24px',
            padding: '16px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span>
            <strong>Team Lead:</strong> {team.team_lead.full_name}
          </span>
          {team.creator && (
            <span>
              <strong>Created by:</strong> {team.creator.full_name}
            </span>
          )}
        </div>
      )}

      <div className="teams-content">
        <div className="teams-section">
          <h2 className="teams-section-title">
            Team Members
            {teamMembers.length > 0 ? ` (${teamMembers.length})` : ''}
          </h2>
          {teamMembersLoading ? (
            <PulsingLoader message="Loading members..." />
          ) : (
            <div className="members-list">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => {
                  const user = member.user || member;
                  const name = user.full_name || user.fullName || user.name || 'Unknown';
                  const email = user.email || '';
                  const avatarUrl = user.avatar_url || user.avatarUrl;
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
                        <button
                          className="member-action-btn"
                          title="Remove from team"
                          onClick={() => handleRemoveMember(member)}
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="team-empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                  <UserPlus size={48} style={{ color: '#718096', marginBottom: '16px' }} />
                  <h3 style={{ marginBottom: '8px' }}>No members yet</h3>
                  <p style={{ color: '#718096', marginBottom: '24px' }}>
                    Add workspace members to this team to get started.
                  </p>
                  <button className="teams-new-btn" onClick={() => setShowAddMemberModal(true)}>
                    <UserPlus size={18} />
                    Add Members
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title="Add Team Members"
        subtitle={`Choose workspace members to add to ${team.name}.`}
        size="md"
      >
        <AddTeamMembersForm
          teamId={teamId}
          existingMembers={teamMembers}
          onClose={() => setShowAddMemberModal(false)}
          onAdded={async () => {
            await loadTeamMembers(teamId);
          }}
        />
      </Modal>
    </div>
  );
};

const AddTeamMembersForm = ({ teamId, existingMembers, onClose, onAdded }) => {
  const { currentCompany } = useCompany();
  const { addTeamMember } = useApp();
  const [companyMembers, setCompanyMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [role, setRole] = useState('developer');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadCompanyMembers = async () => {
      if (!currentCompany?.id) {
        setCompanyMembers([]);
        return;
      }

      setMembersLoading(true);
      try {
        const response = await getCompanyMembers(currentCompany.id);
        const members = response?.data || response || [];
        setCompanyMembers(Array.isArray(members) ? members : []);
      } catch (error) {
        setCompanyMembers([]);
        setStatus(error?.message || 'Failed to load workspace members.');
      } finally {
        setMembersLoading(false);
      }
    };

    loadCompanyMembers();
  }, [currentCompany?.id]);

  const existingUserIds = useMemo(
    () =>
      new Set(
        (existingMembers || []).map((member) => member.user_id || member.user?.id || member.id).filter(Boolean)
      ),
    [existingMembers]
  );

  const availableMembers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return companyMembers.filter((member) => {
      const userId = member.id || member.user?.id;
      if (!userId || existingUserIds.has(userId)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const fullName = member.fullName || member.full_name || member.user?.full_name || '';
      const email = member.email || member.user?.email || '';
      const memberRole = member.role || member.user?.role || '';

      return [fullName, email, memberRole].some((value) =>
        String(value).toLowerCase().includes(normalizedQuery)
      );
    });
  }, [companyMembers, existingUserIds, searchQuery]);

  useEffect(() => {
    if (!selectedUserId && availableMembers.length > 0) {
      setSelectedUserId(availableMembers[0].id || availableMembers[0].user?.id || '');
    }

    if (selectedUserId && !availableMembers.some((member) => (member.id || member.user?.id) === selectedUserId)) {
      setSelectedUserId(availableMembers[0]?.id || availableMembers[0]?.user?.id || '');
    }
  }, [availableMembers, selectedUserId]);

  const handleSubmit = async () => {
    if (!selectedUserId) {
      setStatus('Choose a workspace member to add.');
      return;
    }

    setSubmitting(true);
    setStatus('');

    try {
      await addTeamMember(teamId, {
        user_id: selectedUserId,
        role,
      });
      toast.success('Member added to team');
      await onAdded?.();
      onClose?.();
    } catch (error) {
      const message = error?.message || 'Failed to add member to team.';
      setStatus(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const hasWorkspaceMembers = companyMembers.length > 0;
  const hasAvailableMembers = availableMembers.length > 0;

  return (
    <div className="add-members-form">
      {!currentCompany?.id ? (
        <p className="form-help-text" style={{ color: '#991b1b' }}>
          Select a workspace before adding team members.
        </p>
      ) : membersLoading ? (
        <PulsingLoader message="Loading workspace members..." />
      ) : !hasWorkspaceMembers ? (
        <div className="team-empty-state" style={{ textAlign: 'center', padding: '12px 0' }}>
          <Users size={40} style={{ color: '#718096', marginBottom: '12px' }} />
          <h3 style={{ marginBottom: '8px' }}>No workspace members yet</h3>
          <p style={{ color: '#718096' }}>
            Invite people to the workspace from the Teams overview before adding them to a team.
          </p>
        </div>
      ) : !hasAvailableMembers ? (
        <div className="team-empty-state" style={{ textAlign: 'center', padding: '12px 0' }}>
          <Users size={40} style={{ color: '#718096', marginBottom: '12px' }} />
          <h3 style={{ marginBottom: '8px' }}>Everyone is already on this team</h3>
          <p style={{ color: '#718096' }}>
            There are no additional workspace members available to add right now.
          </p>
        </div>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="team-member-search">Find Workspace Member</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '0 12px',
              }}
            >
              <Search size={16} style={{ color: '#718096' }} />
              <input
                id="team-member-search"
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setStatus('');
                }}
                disabled={submitting}
                style={{ border: 'none', boxShadow: 'none' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="team-member-select">Workspace Member</label>
            <select
              id="team-member-select"
              value={selectedUserId}
              onChange={(event) => {
                setSelectedUserId(event.target.value);
                setStatus('');
              }}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
              }}
            >
              {availableMembers.map((member) => {
                const userId = member.id || member.user?.id;
                const fullName = member.fullName || member.full_name || member.user?.full_name || 'Unknown';
                const email = member.email || member.user?.email || '';
                return (
                  <option key={userId} value={userId}>
                    {fullName} {email ? `(${email})` : ''}
                  </option>
                );
              })}
            </select>
            <p className="form-help-text">
              Only workspace members who are not already on this team are shown.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="team-member-role">Team Role</label>
            <select
              id="team-member-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
              }}
            >
              {TEAM_ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button className="modal-btn-cancel" onClick={onClose} disabled={submitting} style={{ flex: 1 }}>
          Cancel
        </button>
        <button
          className="modal-btn-primary"
          onClick={handleSubmit}
          disabled={submitting || !currentCompany?.id || !hasAvailableMembers || !selectedUserId}
          style={{ flex: 1 }}
        >
          {submitting ? 'Adding...' : 'Add to Team'}
        </button>
      </div>
      {status && (
        <p
          className="form-help-text"
          style={{
            marginTop: '12px',
            color: status.toLowerCase().includes('added') ? '#166534' : '#991b1b',
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default TeamDetailPage;
