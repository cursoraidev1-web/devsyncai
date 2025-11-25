import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Bell, 
  Lock, 
  Palette,
  Monitor,
  Mail,
  Save,
  Shield,
  Globe,
  Camera
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    bio: '',
    location: '',
    timezone: 'UTC-5',
    language: 'en'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskAssigned: true,
    taskCompleted: true,
    mentions: true,
    deployments: true,
    weeklyReport: false
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    compactMode: false,
    sidebarCollapsed: false,
    showAvatars: true
  });

  const handleSaveProfile = () => {
    updateUser(formData);
    alert('Profile updated successfully!');
  };

  const handleSaveNotifications = () => {
    // Save notification preferences
    alert('Notification settings updated!');
  };

  const handleSavePreferences = () => {
    // Save preferences
    alert('Preferences updated!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div className="settings-container">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <p className="section-description">Update your personal information and profile details</p>

              <div className="profile-avatar-section">
                <div className="avatar-preview">
                  <img src={user?.avatar} alt={user?.name} />
                </div>
                <div className="avatar-actions">
                  <button className="btn btn-outline">
                    <Camera size={18} />
                    Change Avatar
                  </button>
                  <p className="help-text">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="developer">Developer</option>
                    <option value="pm">Product Manager</option>
                    <option value="product-owner">Product Owner</option>
                    <option value="qa">QA Engineer</option>
                    <option value="devops">DevOps Engineer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="location">Location</label>
                  <div className="input-with-icon">
                    <Globe size={18} className="input-icon" />
                    <input
                      id="location"
                      type="text"
                      placeholder="New York, USA"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="timezone">Timezone</label>
                  <select
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  >
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-7">Mountain Time (UTC-7)</option>
                    <option value="UTC-6">Central Time (UTC-6)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">GMT (UTC+0)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              <div className="settings-actions">
                <button className="btn btn-primary" onClick={handleSaveProfile}>
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <p className="section-description">Choose how you want to be notified</p>

              <div className="notification-channels">
                <h3>Notification Channels</h3>
                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-icon">
                        <Mail size={20} />
                      </div>
                      <div>
                        <div className="toggle-label">Email Notifications</div>
                        <div className="toggle-description">Receive notifications via email</div>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-icon">
                        <Bell size={20} />
                      </div>
                      <div>
                        <div className="toggle-label">Push Notifications</div>
                        <div className="toggle-description">Receive push notifications in-app</div>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="notification-types">
                <h3>Notification Types</h3>
                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-label">Task Assigned</div>
                      <div className="toggle-description">When a task is assigned to you</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.taskAssigned}
                        onChange={(e) => setNotifications({ ...notifications, taskAssigned: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-label">Task Completed</div>
                      <div className="toggle-description">When your task is marked as complete</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.taskCompleted}
                        onChange={(e) => setNotifications({ ...notifications, taskCompleted: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-label">Mentions</div>
                      <div className="toggle-description">When someone mentions you</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.mentions}
                        onChange={(e) => setNotifications({ ...notifications, mentions: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-label">Deployments</div>
                      <div className="toggle-description">Updates about deployments and builds</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.deployments}
                        onChange={(e) => setNotifications({ ...notifications, deployments: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-label">Weekly Report</div>
                      <div className="toggle-description">Receive a weekly summary email</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.weeklyReport}
                        onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <button className="btn btn-primary" onClick={handleSaveNotifications}>
                  <Save size={18} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2>Application Preferences</h2>
              <p className="section-description">Customize your application experience</p>

              <div className="preferences-group">
                <h3>Appearance</h3>
                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-icon">
                        <Monitor size={20} />
                      </div>
                      <div>
                        <div className="toggle-label">Theme</div>
                        <div className="toggle-description">Choose your interface theme</div>
                      </div>
                    </div>
                    <select
                      className="preference-select"
                      value={preferences.theme}
                      onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-label">Compact Mode</div>
                      <div className="toggle-description">Reduce spacing for more content</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.compactMode}
                        onChange={(e) => setPreferences({ ...preferences, compactMode: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-label">Collapsed Sidebar</div>
                      <div className="toggle-description">Start with sidebar collapsed</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.sidebarCollapsed}
                        onChange={(e) => setPreferences({ ...preferences, sidebarCollapsed: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-label">Show Avatars</div>
                      <div className="toggle-description">Display user avatars throughout the app</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.showAvatars}
                        onChange={(e) => setPreferences({ ...preferences, showAvatars: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <button className="btn btn-primary" onClick={handleSavePreferences}>
                  <Save size={18} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>Security Settings</h2>
              <p className="section-description">Manage your security and authentication</p>

              <div className="security-section">
                <h3>Password</h3>
                <div className="security-item">
                  <div className="security-info">
                    <div className="security-label">Change Password</div>
                    <div className="security-description">Update your password regularly for better security</div>
                  </div>
                  <button className="btn btn-outline">
                    <Lock size={18} />
                    Change Password
                  </button>
                </div>
              </div>

              <div className="security-section">
                <h3>Two-Factor Authentication</h3>
                <div className="security-item">
                  <div className="security-info">
                    <div className="security-label">2FA Status</div>
                    <div className="security-description">Add an extra layer of security to your account</div>
                    <span className="badge badge-danger">Not Enabled</span>
                  </div>
                  <button className="btn btn-primary">
                    <Shield size={18} />
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="security-section">
                <h3>Active Sessions</h3>
                <div className="sessions-list">
                  <div className="session-item">
                    <div className="session-icon">
                      <Monitor size={24} />
                    </div>
                    <div className="session-info">
                      <div className="session-device">Chrome on Windows</div>
                      <div className="session-location">New York, USA • Current Session</div>
                      <div className="session-time">Last active: Just now</div>
                    </div>
                    <span className="badge badge-success">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
