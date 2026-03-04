'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '../../../../context/AppContext';
import { usePlan } from '../../../../context/PlanContext';
import { useCompany } from '../../../../context/CompanyContext';
import { Users, ArrowLeft, UserPlus, Mail, MoreVertical, Trash2 } from 'lucide-react';
import { Modal } from '../../../../components/ui';
import PulsingLoader from '../../../../components/PulsingLoader';
import { toast } from 'react-toastify';
import { inviteUserToCompany } from '../../../../services/api/auth';
import '../../../../styles/pages/Teams.css';

const TeamDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const teamId = params?.id;
    const { teams, teamMembers, teamsLoading, teamMembersLoading, loadTeamMembers, removeTeamMember } = useApp();
    const [showInviteModal, setShowInviteModal] = useState(false);

    const team = teams.find(t => String(t.id) === String(teamId));

    useEffect(() => {
        if (teamId) {
            loadTeamMembers(teamId);
        }
    }, [teamId, loadTeamMembers]);

    const handleRemoveMember = async (member) => {
        const user = member.user || member;
        const name = user.full_name || user.name || 'this member';
        if (!window.confirm(`Remove ${name} from this team?`)) return;
        try {
            await removeTeamMember(teamId, member.user_id || member.id);
            toast.success(`${name} removed from team`);
            loadTeamMembers(teamId); // Refresh
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
                        {/* Team avatar derived from name */}
                        <div className="team-avatar" style={{ width: '48px', height: '48px', fontSize: '20px', borderRadius: '12px' }}>
                            {team.name?.charAt(0).toUpperCase() || 'T'}
                        </div>
                        <div>
                            <h1>{team.name}</h1>
                            <p className="teams-subtitle">{team.description || 'No description'}</p>
                        </div>
                    </div>
                </div>
                {/* Bug 6 Fix: open invite modal instead of navigating away */}
                <button
                    className="teams-new-btn"
                    onClick={() => setShowInviteModal(true)}
                >
                    <UserPlus size={18} />
                    Invite Members
                </button>
            </div>

            {/* Team meta info */}
            {team.team_lead && (
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: '24px',
                    padding: '16px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'var(--color-text-secondary)'
                }}>
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
                                teamMembers.map(member => {
                                    // Bug 4 Fix: Backend returns { id, team_id, user_id, role, user: { id, full_name, email, avatar_url } }
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
                                    <p style={{ color: '#718096', marginBottom: '24px' }}>Invite members to this team to get started.</p>
                                    <button className="teams-new-btn" onClick={() => setShowInviteModal(true)}>
                                        <UserPlus size={18} />
                                        Invite Members
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Invite Members Modal (Bug 6 Fix) */}
            <Modal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                title="Invite Members"
                subtitle={`Invite people to join the ${team.name} team.`}
                size="md"
            >
                <InviteTeamMemberForm
                    teamId={teamId}
                    onClose={() => setShowInviteModal(false)}
                    onInvited={() => loadTeamMembers(teamId)}
                />
            </Modal>
        </div>
    );
};

/**
 * Form to invite a member to a specific team.
 * Uses the company invite endpoint since the team membership is handled
 * via project_members / team_members tables.
 */
const InviteTeamMemberForm = ({ teamId, onClose, onInvited }) => {
    const { sendInvite, projects } = useApp();
    const { currentCompany } = useCompany();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('developer');
    const [inviteType, setInviteType] = useState('company');
    const [inviting, setInviting] = useState(false);
    const [status, setStatus] = useState('');

    const handleInvite = async () => {
        if (!email.trim()) {
            setStatus('Please enter an email address.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setStatus('Please enter a valid email address.');
            return;
        }

        setInviting(true);
        setStatus('');

        try {
            if (inviteType === 'company' && currentCompany?.id) {
                await inviteUserToCompany(currentCompany.id, { email: email.trim(), role });
                toast.success('Invite sent! They will receive an email to join the workspace.');
            } else {
                const projectId = projects?.[0]?.id;
                if (!projectId) {
                    setStatus('No project found. Please create a project first.');
                    setInviting(false);
                    return;
                }
                await sendInvite({ projectId, email: email.trim(), role });
                toast.success('Project invite sent successfully!');
            }
            setStatus('Invite sent successfully!');
            onInvited?.();
            setTimeout(() => onClose?.(), 1500);
        } catch (err) {
            const msg = err?.message || 'Failed to send invite.';
            setStatus(msg);
            toast.error(msg);
        } finally {
            setInviting(false);
        }
    };

    return (
        <div className="add-members-form">
            <div className="form-group">
                <label htmlFor="team-invite-type">Invite Type</label>
                <select
                    id="team-invite-type"
                    value={inviteType}
                    onChange={(e) => setInviteType(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    <option value="company">Company Invite (Join the workspace)</option>
                    <option value="project">Project Invite (Join a specific project)</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="team-invite-email">Email Address *</label>
                <input
                    type="email"
                    id="team-invite-email"
                    placeholder="colleague@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus(''); }}
                    disabled={inviting}
                />
            </div>
            <div className="form-group">
                <label htmlFor="team-invite-role">Role</label>
                <select
                    id="team-invite-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-primary)'
                    }}
                >
                    <option value="developer">Developer</option>
                    <option value="product_manager">Product Manager</option>
                    <option value="designer">Designer</option>
                    <option value="qa">QA</option>
                    <option value="devops">DevOps</option>
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                </select>
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
                    disabled={inviting || !email.trim()}
                    style={{ flex: 1 }}
                >
                    {inviting ? 'Sending...' : 'Send Invite'}
                </button>
            </div>
            {status && (
                <p className="form-help-text" style={{
                    marginTop: '12px',
                    color: status.includes('success') || status.includes('sent') ? '#166534' : '#991b1b'
                }}>
                    {status}
                </p>
            )}
        </div>
    );
};

export default TeamDetailPage;
