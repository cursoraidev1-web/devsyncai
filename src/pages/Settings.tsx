/**
 * Settings Page
 * General application and user preferences
 */

import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Manage your account and application preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
          <button
            className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <h3 className="card-title mb-4">Profile Information</h3>
            
            <div className="flex align-center gap-4 mb-4" style={{ paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-gray-200)' }}>
              <div className="user-avatar" style={{ width: '5rem', height: '5rem', fontSize: '2rem' }}>
                JD
              </div>
              <div>
                <button className="btn btn-primary mr-2">Change Avatar</button>
                <button className="btn btn-outline">Remove</button>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" className="form-input" defaultValue="John" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-input" defaultValue="Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" defaultValue="john.doe@company.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select">
                  <option value="po">Product Owner</option>
                  <option value="pm">Product Manager</option>
                  <option value="dev">Developer</option>
                  <option value="qa">QA Engineer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Time Zone</label>
                <select className="form-select">
                  <option>UTC-08:00 (Pacific Time)</option>
                  <option>UTC-05:00 (Eastern Time)</option>
                  <option>UTC+00:00 (GMT)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Language</label>
                <select className="form-select">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" placeholder="Tell us about yourself..."></textarea>
            </div>

            <button className="btn btn-primary">Save Changes</button>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="card">
            <h3 className="card-title mb-4">Application Preferences</h3>

            <div className="form-group">
              <label className="form-label">Theme</label>
              <select className="form-select">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto (System)</option>
              </select>
              <p className="form-help">Choose your preferred color scheme</p>
            </div>

            <div className="form-group">
              <label className="form-label">Default Dashboard View</label>
              <select className="form-select">
                <option>Product Owner Dashboard</option>
                <option>Developer Dashboard</option>
                <option>Analytics</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                Enable AI suggestions
              </label>
              <p className="form-help">Get AI-powered recommendations throughout the app</p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                Auto-save drafts
              </label>
              <p className="form-help">Automatically save your work as you type</p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <input type="checkbox" style={{ marginRight: 'var(--spacing-sm)' }} />
                Compact view mode
              </label>
              <p className="form-help">Show more information with less spacing</p>
            </div>

            <button className="btn btn-primary">Save Preferences</button>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card">
            <h3 className="card-title mb-4">Notification Settings</h3>

            <div className="mb-4">
              <h4 style={{ fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Email Notifications</h4>
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                  Daily digest summary
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                  Task assignments
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" style={{ marginRight: 'var(--spacing-sm)' }} />
                  Comments and mentions
                </label>
              </div>
            </div>

            <div className="mb-4">
              <h4 style={{ fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>In-App Notifications</h4>
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                  Role-based handoffs
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                  PRD compliance alerts
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                  CI/CD pipeline status
                </label>
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Slack Integration</h4>
              <div className="form-group">
                <label className="form-label">
                  <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                  Send notifications to Slack
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">Slack Channel</label>
                <input type="text" className="form-input" defaultValue="#devsync-notifications" />
              </div>
            </div>

            <button className="btn btn-primary">Save Settings</button>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card">
            <h3 className="card-title mb-4">Security Settings</h3>

            <div className="mb-4" style={{ paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-gray-200)' }}>
              <h4 style={{ fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Change Password</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-md)' }}>
                Last changed 45 days ago
              </p>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" />
                </div>
              </div>
              <button className="btn btn-primary">Update Password</button>
            </div>

            <div className="mb-4" style={{ paddingBottom: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-gray-200)' }}>
              <h4 style={{ fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Two-Factor Authentication</h4>
              <div className="flex justify-between align-center">
                <div>
                  <p style={{ fontWeight: 500 }}>Status: <span className="badge badge-success">Enabled</span></p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginTop: 'var(--spacing-xs)' }}>
                    Using authenticator app
                  </p>
                </div>
                <button className="btn btn-outline">Configure</button>
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Active Sessions</h4>
              <div className="flex flex-column gap-2">
                <div className="flex justify-between align-center" style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>Current Session - Chrome on MacOS</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                      IP: 192.168.1.45 • Last active: Now
                    </p>
                  </div>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="flex justify-between align-center" style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>Firefox on Windows</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                      IP: 192.168.1.12 • Last active: 2 hours ago
                    </p>
                  </div>
                  <button className="btn btn-sm btn-outline">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
