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
  Camera,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Button, Input, Select, Card, Modal, Switch, Textarea } from '../components/ui';
import { PageHeader, ContentContainer, Section } from '../components/layout';
import './Settings.css';

const SettingsNew = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    bio: '',
    location: '',
    timezone: 'UTC-5',
    language: 'en'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSaveProfile = () => {
    updateUser(formData);
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long!');
      return;
    }
    // Save password
    toast.success('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleEnable2FA = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShow2FAModal(false);
      setVerificationCode('');
      toast.success('Two-Factor Authentication enabled successfully!');
    } else {
      toast.error('Please enter a valid 6-digit code');
    }
  };

  const handleThemeChange = (newTheme) => {
    setPreferences({ ...preferences, theme: newTheme });
    // Apply theme
    document.documentElement.setAttribute('data-theme', newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <ContentContainer>
      <PageHeader 
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--spacing-xl)' }}>
        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                border: 'none',
                background: activeTab === tab.id ? 'var(--color-primary-soft)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-base)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? 600 : 500,
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Section spacing="lg">
              <Card title="Profile Information" subtitle="Update your personal information and profile details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                  {/* Avatar */}
                  <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img src={user?.avatar} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <Button variant="outline" icon={<Camera size={16} />}>
                        Change Avatar
                      </Button>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      icon={<Mail size={16} />}
                    />
                    <Select
                      label="Role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="developer">Developer</option>
                      <option value="pm">Product Manager</option>
                      <option value="product-owner">Product Owner</option>
                      <option value="qa">QA Engineer</option>
                      <option value="devops">DevOps Engineer</option>
                      <option value="admin">Admin</option>
                    </Select>
                    <Input
                      label="Location"
                      placeholder="New York, USA"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      icon={<Globe size={16} />}
                    />
                  </div>

                  <Textarea
                    label="Bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
                    <Select
                      label="Timezone"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    >
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-7">Mountain Time (UTC-7)</option>
                      <option value="UTC-6">Central Time (UTC-6)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">GMT (UTC+0)</option>
                    </Select>
                    <Select
                      label="Language"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </Select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="primary" icon={<Save size={18} />} onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </Card>
            </Section>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Section spacing="lg">
              <Card title="Notification Preferences" subtitle="Choose how you want to be notified">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                  {/* Channels */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                      Notification Channels
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-base)'
                      }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                          <Mail size={20} color="var(--color-primary)" />
                          <div>
                            <div style={{ fontWeight: 500, fontSize: '14px' }}>Email Notifications</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Receive notifications via email</div>
                          </div>
                        </div>
                        <Switch 
                          checked={notifications.email}
                          onChange={(checked) => setNotifications({ ...notifications, email: checked })}
                        />
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-base)'
                      }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                          <Bell size={20} color="var(--color-primary)" />
                          <div>
                            <div style={{ fontWeight: 500, fontSize: '14px' }}>Push Notifications</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Receive push notifications in-app</div>
                          </div>
                        </div>
                        <Switch 
                          checked={notifications.push}
                          onChange={(checked) => setNotifications({ ...notifications, push: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Types */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                      Notification Types
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                      {[
                        { key: 'taskAssigned', label: 'Task Assigned', desc: 'When a task is assigned to you' },
                        { key: 'taskCompleted', label: 'Task Completed', desc: 'When your task is marked as complete' },
                        { key: 'mentions', label: 'Mentions', desc: 'When someone mentions you' },
                        { key: 'deployments', label: 'Deployments', desc: 'Updates about deployments and builds' },
                        { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a weekly summary email' }
                      ].map(item => (
                        <div key={item.key} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: 'var(--spacing-sm)'
                        }}>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: '14px' }}>{item.label}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.desc}</div>
                          </div>
                          <Switch 
                            checked={notifications[item.key]}
                            onChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="primary" icon={<Save size={18} />}>
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </Card>
            </Section>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Section spacing="lg">
              <Card title="Application Preferences" subtitle="Customize your application experience">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                  {/* Theme Selector */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                      Appearance
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)' }}>
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'auto', label: 'Auto', icon: Monitor }
                      ].map(theme => (
                        <button
                          key={theme.value}
                          onClick={() => handleThemeChange(theme.value)}
                          style={{
                            padding: 'var(--spacing-lg)',
                            border: `2px solid ${preferences.theme === theme.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            borderRadius: 'var(--radius-base)',
                            background: preferences.theme === theme.value ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            transition: 'all 0.2s ease',
                            position: 'relative'
                          }}
                        >
                          <theme.icon size={32} color={preferences.theme === theme.value ? 'var(--color-primary)' : 'var(--color-text-secondary)'} />
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: 500,
                            color: preferences.theme === theme.value ? 'var(--color-primary)' : 'var(--color-text-primary)'
                          }}>
                            {theme.label}
                          </span>
                          {preferences.theme === theme.value && (
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: 'var(--color-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Check size={12} color="white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Other Preferences */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                      Display Options
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                      {[
                        { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing for more content' },
                        { key: 'sidebarCollapsed', label: 'Collapsed Sidebar', desc: 'Start with sidebar collapsed' },
                        { key: 'showAvatars', label: 'Show Avatars', desc: 'Display user avatars throughout the app' }
                      ].map(item => (
                        <div key={item.key} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: 'var(--spacing-sm)'
                        }}>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: '14px' }}>{item.label}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.desc}</div>
                          </div>
                          <Switch 
                            checked={preferences[item.key]}
                            onChange={(checked) => setPreferences({ ...preferences, [item.key]: checked })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="primary" icon={<Save size={18} />}>
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </Card>
            </Section>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Section spacing="lg">
              <Card title="Security Settings" subtitle="Manage your security and authentication">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                  {/* Password */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                      Password
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-base)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>Change Password</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          Update your password regularly for better security
                        </div>
                      </div>
                      <Button variant="outline" icon={<Lock size={16} />} onClick={() => setShowPasswordModal(true)}>
                        Change Password
                      </Button>
                    </div>
                  </div>

                  {/* 2FA */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                      Two-Factor Authentication
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-base)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>2FA Status</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                          Add an extra layer of security to your account
                        </div>
                        {twoFactorEnabled ? (
                          <span style={{
                            padding: '4px 10px',
                            background: '#D1FAE5',
                            color: '#065F46',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Check size={12} /> Enabled
                          </span>
                        ) : (
                          <span style={{
                            padding: '4px 10px',
                            background: '#FEE2E2',
                            color: '#991B1B',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 500
                          }}>
                            Not Enabled
                          </span>
                        )}
                      </div>
                      {!twoFactorEnabled && (
                        <Button variant="primary" icon={<Shield size={16} />} onClick={() => setShow2FAModal(true)}>
                          Enable 2FA
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                      Active Sessions
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      gap: 'var(--spacing-md)', 
                      alignItems: 'center',
                      padding: 'var(--spacing-md)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-base)'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-base)',
                        background: 'var(--color-primary-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Monitor size={20} color="var(--color-primary)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>Chrome on Windows</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          New York, USA • Current Session
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          Last active: Just now
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        background: '#D1FAE5',
                        color: '#065F46',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Section>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        subtitle="Enter your current password and choose a new one"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleChangePassword}>
              Change Password
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            icon={<Lock size={16} />}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            icon={<Lock size={16} />}
            helperText="Must be at least 8 characters long"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            icon={<Lock size={16} />}
          />
        </div>
      </Modal>

      {/* Enable 2FA Modal */}
      <Modal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title="Enable Two-Factor Authentication"
        subtitle="Scan the QR code with your authenticator app"
        footer={
          <>
            <Button variant="outline" onClick={() => setShow2FAModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEnable2FA}>
              Enable 2FA
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
          {/* QR Code Placeholder */}
          <div style={{
            width: '200px',
            height: '200px',
            background: 'var(--color-surface-alt)',
            borderRadius: 'var(--radius-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Shield size={48} />
              <div style={{ fontSize: '12px', marginTop: '8px' }}>QR Code</div>
            </div>
          </div>

          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-md)' }}>
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.) 
              or enter the code manually: <strong>ABCD-EFGH-IJKL-MNOP</strong>
            </p>

            <Input
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              helperText="Enter the 6-digit code from your authenticator app"
            />
          </div>
        </div>
      </Modal>
    </ContentContainer>
  );
};

export default SettingsNew;
