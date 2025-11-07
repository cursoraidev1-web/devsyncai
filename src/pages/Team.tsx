/**
 * Team Management Page
 * Manage team members, roles, and permissions
 */

import React, { useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  status: 'active' | 'away' | 'offline';
  joinedDate: string;
}

const Team: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      role: 'Frontend Developer',
      department: 'Engineering',
      avatar: 'SC',
      status: 'active',
      joinedDate: '2024-03-15',
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Product Manager',
      department: 'Product',
      avatar: 'MJ',
      status: 'active',
      joinedDate: '2024-01-10',
    },
    {
      id: '3',
      name: 'Alex Kumar',
      email: 'alex.kumar@company.com',
      role: 'Backend Developer',
      department: 'Engineering',
      avatar: 'AK',
      status: 'away',
      joinedDate: '2024-05-20',
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'Security Engineer',
      department: 'Security',
      avatar: 'ED',
      status: 'active',
      joinedDate: '2024-02-28',
    },
    {
      id: '5',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Product Owner',
      department: 'Product',
      avatar: 'JD',
      status: 'active',
      joinedDate: '2023-11-05',
    },
    {
      id: '6',
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      role: 'QA Engineer',
      department: 'Quality',
      avatar: 'LW',
      status: 'offline',
      joinedDate: '2024-04-12',
    },
  ]);

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'away': return 'warning';
      case 'offline': return 'error';
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Team Management</h1>
          <p className="page-subtitle">
            Manage team members, roles, and permissions
          </p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-4 mb-4">
          <div className="metric-card">
            <h3 className="metric-label">Total Members</h3>
            <p className="metric-value">{teamMembers.length}</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Active Now</h3>
            <p className="metric-value success">{teamMembers.filter(m => m.status === 'active').length}</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Departments</h3>
            <p className="metric-value">4</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Pending Invites</h3>
            <p className="metric-value">2</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between align-center mb-4">
          <div className="header-search" style={{ marginBottom: 0 }}>
            <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search team members..."
              style={{ width: '300px' }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
            <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Invite Member
          </button>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-3 mb-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="card">
              <div className="flex align-center gap-3 mb-3">
                <div className="user-avatar" style={{ width: '3.5rem', height: '3.5rem', fontSize: '1.25rem', position: 'relative' }}>
                  {member.avatar}
                  <div
                    className={`status-dot ${getStatusColor(member.status)}`}
                    style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '0.75rem',
                      height: '0.75rem',
                      border: '2px solid white',
                    }}
                  ></div>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>{member.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{member.email}</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex gap-2 mb-2">
                  <span className="badge badge-primary">{member.role}</span>
                  <span className="badge badge-outline">{member.department}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>
                  Joined: {new Date(member.joinedDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="btn btn-sm btn-outline" style={{ flex: 1 }}>View Profile</button>
                <button className="btn btn-sm btn-outline">⋯</button>
              </div>
            </div>
          ))}
        </div>

        {/* Departments Section */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">Teams by Department</h3>
          <div className="grid grid-4">
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-xs)' }}>
                Engineering
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>2</p>
              <div className="flex" style={{ marginTop: 'var(--spacing-sm)' }}>
                <div className="user-avatar" style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.7rem', marginLeft: '-0.25rem', border: '2px solid white' }}>SC</div>
                <div className="user-avatar" style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.7rem', marginLeft: '-0.5rem', border: '2px solid white' }}>AK</div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-xs)' }}>
                Product
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>2</p>
              <div className="flex" style={{ marginTop: 'var(--spacing-sm)' }}>
                <div className="user-avatar" style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.7rem', marginLeft: '-0.25rem', border: '2px solid white' }}>MJ</div>
                <div className="user-avatar" style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.7rem', marginLeft: '-0.5rem', border: '2px solid white' }}>JD</div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-xs)' }}>
                Security
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>1</p>
              <div className="flex" style={{ marginTop: 'var(--spacing-sm)' }}>
                <div className="user-avatar" style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.7rem', marginLeft: '-0.25rem', border: '2px solid white' }}>ED</div>
              </div>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-xs)' }}>
                Quality
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>1</p>
              <div className="flex" style={{ marginTop: 'var(--spacing-sm)' }}>
                <div className="user-avatar" style={{ width: '1.75rem', height: '1.75rem', fontSize: '0.7rem', marginLeft: '-0.25rem', border: '2px solid white' }}>LW</div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions & Roles */}
        <div className="card">
          <h3 className="card-title mb-3">Roles & Permissions</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Members</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Admin</strong></td>
                  <td>1</td>
                  <td>
                    <span className="badge badge-success">Full Access</span>
                  </td>
                  <td><button className="btn btn-sm btn-outline">Manage</button></td>
                </tr>
                <tr>
                  <td><strong>Product Owner</strong></td>
                  <td>1</td>
                  <td>
                    <span className="badge badge-info">PRD, Analytics, Team</span>
                  </td>
                  <td><button className="btn btn-sm btn-outline">Manage</button></td>
                </tr>
                <tr>
                  <td><strong>Developer</strong></td>
                  <td>2</td>
                  <td>
                    <span className="badge badge-info">Code, CI/CD, Docs</span>
                  </td>
                  <td><button className="btn btn-sm btn-outline">Manage</button></td>
                </tr>
                <tr>
                  <td><strong>QA Engineer</strong></td>
                  <td>1</td>
                  <td>
                    <span className="badge badge-info">Testing, PRD, Reports</span>
                  </td>
                  <td><button className="btn btn-sm btn-outline">Manage</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Invite Team Member</h3>
                <button className="modal-close" onClick={() => setShowInviteModal(false)}>
                  <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="colleague@company.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-select">
                    <option>Developer</option>
                    <option>Product Manager</option>
                    <option>Product Owner</option>
                    <option>QA Engineer</option>
                    <option>Designer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select">
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Design</option>
                    <option>Quality</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Personal Message (Optional)</label>
                  <textarea className="form-textarea" placeholder="Welcome to the team!"></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setShowInviteModal(false)}>Cancel</button>
                <button className="btn btn-primary">Send Invitation</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
