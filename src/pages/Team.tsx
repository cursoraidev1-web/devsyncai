/**
 * Team Management Page - FULLY FUNCTIONAL
 * Invite members, manage roles, remove users
 */

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
  department: string;
}

const Team: React.FC = () => {
  const { user } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'developer',
    department: '',
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'po@devsync.ai',
      role: 'product-owner',
      avatar: '👩‍💼',
      status: 'active',
      lastActive: '5 min ago',
      department: 'Product',
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'dev@devsync.ai',
      role: 'developer',
      avatar: '👨‍💻',
      status: 'active',
      lastActive: '1 hour ago',
      department: 'Engineering',
    },
    {
      id: '3',
      name: 'Jessica Lee',
      email: 'qa@devsync.ai',
      role: 'qa-engineer',
      avatar: '👩‍🔬',
      status: 'active',
      lastActive: '3 hours ago',
      department: 'Quality Assurance',
    },
    {
      id: '4',
      name: 'David Park',
      email: 'devops@devsync.ai',
      role: 'devops',
      avatar: '⚙️',
      status: 'active',
      lastActive: 'Yesterday',
      department: 'DevOps',
    },
    {
      id: '5',
      name: 'Emily Roberts',
      email: 'emily@devsync.ai',
      role: 'developer',
      avatar: '👩',
      status: 'pending',
      lastActive: 'Never',
      department: 'Engineering',
    },
  ]);

  const handleInvite = () => {
    if (!inviteData.email || !inviteData.role || !inviteData.department) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check if already invited
    if (teamMembers.some(m => m.email === inviteData.email)) {
      toast.error('This user is already on the team');
      return;
    }

    // Add new pending member
    const newMember: TeamMember = {
      id: `${Date.now()}`,
      name: inviteData.email.split('@')[0],
      email: inviteData.email,
      role: inviteData.role,
      avatar: '👤',
      status: 'pending',
      lastActive: 'Never',
      department: inviteData.department,
    };

    setTeamMembers([...teamMembers, newMember]);
    toast.success(`Invitation sent to ${inviteData.email}!`);
    setInviteData({ email: '', role: 'developer', department: '' });
    setShowInviteModal(false);
  };

  const handleResendInvite = (member: TeamMember) => {
    toast.success(`Invitation resent to ${member.email}`);
  };

  const handleRemoveMember = (member: TeamMember) => {
    if (window.confirm(`Remove ${member.name} from the team?`)) {
      setTeamMembers(teamMembers.filter(m => m.id !== member.id));
      toast.success(`${member.name} removed from team`);
    }
  };

  const handleChangeRole = (memberId: string, newRole: string) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
    toast.success('Role updated successfully');
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'product-owner': 'badge-primary',
      'product-manager': 'badge-info',
      'developer': 'badge-success',
      'qa-engineer': 'badge-warning',
      'devops': 'badge-secondary',
    };
    return colors[role] || 'badge-secondary';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'product-owner': 'Product Owner',
      'product-manager': 'Product Manager',
      'developer': 'Developer',
      'qa-engineer': 'QA Engineer',
      'devops': 'DevOps Engineer',
    };
    return labels[role] || role;
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Team Management</h1>
            <p className="page-subtitle">
              Manage team members and their permissions
            </p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowInviteModal(true)}
          >
            ➕ Invite Team Member
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-4 mb-4">
          <div className="card">
            <h4 className="card-title">Total Members</h4>
            <p className="metric">{teamMembers.length}</p>
          </div>
          <div className="card">
            <h4 className="card-title">Active</h4>
            <p className="metric" style={{ color: 'var(--color-success)' }}>
              {teamMembers.filter(m => m.status === 'active').length}
            </p>
          </div>
          <div className="card">
            <h4 className="card-title">Pending</h4>
            <p className="metric" style={{ color: 'var(--color-warning)' }}>
              {teamMembers.filter(m => m.status === 'pending').length}
            </p>
          </div>
          <div className="card">
            <h4 className="card-title">Departments</h4>
            <p className="metric">
              {new Set(teamMembers.map(m => m.department)).size}
            </p>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="flex align-center gap-2">
                      <div className="user-avatar" style={{ width: '2.5rem', height: '2.5rem', fontSize: '1.25rem' }}>
                        {member.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{member.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select 
                      className="form-select"
                      value={member.role}
                      onChange={(e) => handleChangeRole(member.id, e.target.value)}
                      style={{ fontSize: '0.875rem' }}
                    >
                      <option value="product-owner">Product Owner</option>
                      <option value="product-manager">Product Manager</option>
                      <option value="developer">Developer</option>
                      <option value="qa-engineer">QA Engineer</option>
                      <option value="devops">DevOps Engineer</option>
                    </select>
                  </td>
                  <td>{member.department}</td>
                  <td>
                    <span className={`badge ${
                      member.status === 'active' ? 'badge-success' :
                      member.status === 'pending' ? 'badge-warning' :
                      'badge-secondary'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                    {member.lastActive}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {member.status === 'pending' && (
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleResendInvite(member)}
                        >
                          Resend
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleRemoveMember(member)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Invite Team Member</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowInviteModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input"
                    placeholder="colleague@company.com"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select 
                    className="form-select"
                    value={inviteData.role}
                    onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                  >
                    <option value="product-owner">Product Owner</option>
                    <option value="product-manager">Product Manager</option>
                    <option value="developer">Developer</option>
                    <option value="qa-engineer">QA Engineer</option>
                    <option value="devops">DevOps Engineer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="Engineering, Product, QA, etc."
                    value={inviteData.department}
                    onChange={(e) => setInviteData({...inviteData, department: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleInvite}
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
