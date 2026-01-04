'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
;
import { useAuth } from '../../../context/AuthContext';
import { usePlan } from '../../../context/PlanContext';
import { useTheme } from '../../../context/ThemeContext';
import { cancelSubscription } from '../../../api/subscription';
import { toast } from 'react-toastify';
import { subscribeToPush, unsubscribeFromPush, getVapidPublicKey } from '../../../api/push';
import {
  isPushSupported,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getCurrentSubscription,
} from '../../../utils/pushNotifications';
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
  Building2,
  CreditCard,
  Code,
  Puzzle,
  Settings as SettingsIcon,
  Plus,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { Modal } from '../../../components/ui';
import PasswordInput from '../../../components/PasswordInput';
import { validatePassword } from '../../../utils/passwordValidation';
import '../../../styles/pages/Settings.css';

const Settings = () => {
  const router = useRouter();
  const { user, updateUser, updateProfile, setup2FA, enable2FA, changePassword, getActiveSessions } = useAuth();
  const { theme, updateTheme } = useTheme();
  const { 
    subscription, 
    limits, 
    usage, 
    isTrial, 
    isTrialExpired, 
    getTrialDaysRemaining,
    isActive,
    getPlanType 
  } = usePlan();
  const [activeTab, setActiveTab] = useState('general');
  const [companyMembers, setCompanyMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.')) {
      return;
    }

    setCancelling(true);
    try {
      await cancelSubscription(false); // Cancel at period end
      toast.success('Subscription will be cancelled at the end of your billing period.');
      // Reload subscription data
      window.location.reload();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error(error.message || 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  const [formData, setFormData] = useState({
    name: user?.name || user?.fullName || '',
    email: user?.email || '',
    role: user?.role || '',
    bio: user?.bio || '',
    location: user?.location || '',
    timezone: user?.timezone || 'UTC-5',
    language: user?.language || 'en'
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || user?.avatarUrl || null);
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef(null);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || user?.fullName || '',
        email: user?.email || '',
        role: user?.role || '',
        bio: user?.bio || '',
        location: user?.location || '',
        timezone: user?.timezone || 'UTC-5',
        language: user?.language || 'en'
      });
      setAvatarPreview(user?.avatar || user?.avatarUrl || null);
    }
  }, [user]);

  // Initialize twoFactorEnabled from user object (no need to fetch again)
  React.useEffect(() => {
    if (user?.twoFactorEnabled !== undefined) {
      setTwoFactorEnabled(user.twoFactorEnabled);
    }
  }, [user?.twoFactorEnabled]);

  // Check push notification support and current subscription status
  useEffect(() => {
    const checkPushSupport = async () => {
      const supported = isPushSupported();
      setPushSupported(supported);

      if (supported) {
        try {
          const subscription = await getCurrentSubscription();
          setNotifications(prev => ({
            ...prev,
            push: subscription !== null
          }));
        } catch (error) {
          console.error('Error checking push subscription:', error);
        }
      }
      setPushInitialized(true);
    };

    checkPushSupport();
  }, []);

  // Load active sessions when security tab is active
  useEffect(() => {
    if (activeTab === 'security') {
      loadActiveSessions();
    }
  }, [activeTab]);

  const loadActiveSessions = async () => {
    setSessionsLoading(true);
    try {
      const sessions = await getActiveSessions();
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Failed to load active sessions:', error);
      setActiveSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  // Change password form state
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = async () => {
    setPasswordError('');
    
    if (!changePasswordData.currentPassword || !changePasswordData.newPassword || !changePasswordData.confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Validate new password
    const passwordValidation = validatePassword(changePasswordData.newPassword);
    if (!passwordValidation.valid) {
      const errorMsg = passwordValidation.errors?.[0] || 'Password does not meet requirements';
      setPasswordError(errorMsg);
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(changePasswordData.currentPassword, changePasswordData.newPassword);
      toast.success('Password changed successfully');
      setShowChangePasswordModal(false);
      setChangePasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to change password';
      setPasswordError(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  const [notifications, setNotifications] = useState({
    email: true,
    push: false, // Default to false, will check on mount
    taskAssigned: true,
    taskCompleted: true,
    mentions: true,
    deployments: true,
    weeklyReport: false
  });
  const [pushSupported, setPushSupported] = useState(false);
  const [pushInitialized, setPushInitialized] = useState(false);

  const [preferences, setPreferences] = useState({
    theme: 'light',
    compactMode: false,
    sidebarCollapsed: false,
    showAvatars: true
  });

  // Handle avatar file selection
  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Prepare update payload
      const updates = {
        fullName: formData.name,
        email: formData.email,
        role: formData.role,
        bio: formData.bio,
        location: formData.location,
        timezone: formData.timezone,
        language: formData.language
      };

      // If avatar file is selected, upload it to Supabase Storage first
      if (avatarFile) {
        try {
          // Upload to Supabase Storage
          const { uploadFile } = await import('../../../utils/supabase');
          const userId = user?.id;
          if (!userId) {
            toast.error('User ID not found');
            setSaving(false);
            return;
          }
          
          const timestamp = Date.now();
          const fileExtension = avatarFile.name.split('.').pop();
          const filePath = `${userId}/${timestamp}.${fileExtension}`;
          
          const { url } = await uploadFile(
            avatarFile,
            'avatars',
            filePath,
            { contentType: avatarFile.type }
          );
          
          updates.avatarUrl = url;
        } catch (uploadError) {
          console.error('Avatar upload error:', uploadError);
          toast.error('Failed to upload avatar image: ' + (uploadError.message || 'Unknown error'));
          setSaving(false);
          return;
        }
      }

      const response = await updateProfile(updates);
      
      // Handle response format: { success: true, data: {...} } or direct user object
      const updatedUser = response?.data || response;
      
      if (updatedUser) {
        // Update local state
        updateUser(updatedUser);
        setAvatarFile(null); // Clear selected file after successful upload
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Profile update failed: No user data returned');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Unknown error';
      toast.error('Failed to update profile: ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      // If push notifications are enabled, subscribe
      if (notifications.push && pushSupported) {
        // Request permission first
        const permissionGranted = await requestNotificationPermission();
        
        if (!permissionGranted) {
          setNotifications(prev => ({ ...prev, push: false }));
          toast.error('Notification permission denied');
          return;
        }

        // Get VAPID public key from backend
        const { data: vapidResponse } = await getVapidPublicKey();
        
        if (!vapidResponse?.publicKey) {
          toast.error('Push notifications are not configured on the server');
          setNotifications(prev => ({ ...prev, push: false }));
          return;
        }

        // Subscribe to push notifications
        const subscription = await subscribeToPushNotifications(vapidResponse.publicKey);
        
        // Send subscription to backend
        await subscribeToPush(subscription);
        
        toast.success('Push notifications enabled!');
      } else if (!notifications.push) {
        // If disabled, unsubscribe
        const endpoint = await unsubscribeFromPushNotifications();
        
        if (endpoint) {
          await unsubscribeFromPush({ endpoint });
        } else {
          // If no local subscription, try to unsubscribe all
          await unsubscribeFromPush({ endpoint: '' });
        }
        
        toast.success('Push notifications disabled');
      }
    } catch (error) {
      console.error('Failed to update push notifications:', error);
      setNotifications(prev => ({ ...prev, push: false }));
      toast.error(error.message || 'Failed to update notification settings');
    }
  };

  const handleSavePreferences = () => {
    // Save preferences
    toast.success('Preferences updated!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'workspace', label: 'Workspace', icon: Building2 },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'developer', label: 'Developer/API', icon: Code },
    { id: 'integrations', label: 'Integrations', icon: Puzzle }
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
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2>General Settings</h2>
              <p className="section-description">Manage your profile and preferences</p>

              <div className="profile-avatar-section">
                <div className="avatar-preview">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt={formData.name || 'User'} />
                  ) : (
                    <div className="avatar-placeholder">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <div className="avatar-actions">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleAvatarSelect}
                    style={{ display: 'none' }}
                  />
                  <button 
                    className="btn btn-outline"
                    onClick={(e) => {
                      e.preventDefault();
                      avatarInputRef.current?.click();
                    }}
                    type="button"
                    disabled={saving}
                  >
                    <Camera size={18} />
                    {avatarFile ? 'Change Avatar' : 'Change Avatar'}
                  </button>
                  {avatarFile && (
                    <button
                      className="btn btn-outline"
                      onClick={(e) => {
                        e.preventDefault();
                        setAvatarFile(null);
                        setAvatarPreview(user?.avatar || user?.avatarUrl || null);
                        if (avatarInputRef.current) {
                          avatarInputRef.current.value = '';
                        }
                      }}
                      type="button"
                      disabled={saving}
                      style={{ marginLeft: '8px' }}
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  )}
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

              <div className="notification-types">
                <h3>Notification Preferences</h3>
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
                        <div className="toggle-description">
                          {!pushSupported 
                            ? 'Push notifications are not supported in this browser'
                            : pushInitialized
                            ? 'Receive push notifications in-app'
                            : 'Checking push notification support...'}
                        </div>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        disabled={!pushSupported || !pushInitialized}
                        onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

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
                      value={theme || preferences.theme}
                      onChange={async (e) => {
                        const newTheme = e.target.value;
                        setPreferences({ ...preferences, theme: newTheme });
                        await updateTheme(newTheme);
                      }}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner" style={{ display: 'inline-block', marginRight: '8px' }}>⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
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
                  <button 
                    className="btn btn-outline"
                    onClick={() => setShowChangePasswordModal(true)}
                  >
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
                {sessionsLoading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
                    Loading sessions...
                  </div>
                ) : activeSessions.length > 0 ? (
                  <div className="sessions-list">
                    {activeSessions.map((session) => (
                      <div key={session.id} className="session-item">
                        <div className="session-icon">
                          <Monitor size={24} />
                        </div>
                        <div className="session-info">
                          <div className="session-device">{session.device}</div>
                          <div className="session-location">
                            {session.location}
                            {session.isCurrent && ' • Current Session'}
                          </div>
                          <div className="session-time">
                            Last active: {new Date(session.lastActive).toLocaleString()}
                          </div>
                        </div>
                        <span className={`badge ${session.isCurrent ? 'badge-success' : 'badge-secondary'}`}>
                          {session.isCurrent ? 'Active' : 'Recent'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
                    No active sessions found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Workspace Tab */}
          {activeTab === 'workspace' && (
            <div className="settings-section">
              <h2>Workspace Settings</h2>
              <p className="section-description">Manage your workspace configuration</p>

              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="workspace-name">Workspace Name</label>
                  <input
                    id="workspace-name"
                    type="text"
                    placeholder="My Workspace"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="workspace-url">Workspace URL</label>
                  <div className="input-with-icon">
                    <Globe size={18} className="input-icon" />
                    <input
                      id="workspace-url"
                      type="text"
                      placeholder="workspace-name"
                      value=""
                      readOnly
                    />
                    <span className="input-suffix">.zyndrx.com</span>
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <button className="btn btn-primary">
                  <Save size={18} />
                  Save Workspace Settings
                </button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="settings-section">
              <h2>Billing & Subscription</h2>
              <p className="section-description">Manage your subscription and billing information</p>

              <div className="billing-section">
                <div className="billing-plan">
                  <h3>Current Plan</h3>
                  <div className="plan-card">
                    <div className="plan-header">
                      <div className="plan-name">
                        {subscription?.name || 'Free Plan'}
                        {isTrial() && (
                          <span className="plan-badge trial">Trial</span>
                        )}
                        {subscription?.status === 'cancelled' && (
                          <span className="plan-badge cancelled">Cancelled</span>
                        )}
                      </div>
                      <div className="plan-price">
                        {getPlanType() === 'free' ? (
                          <span>Free</span>
                        ) : getPlanType() === 'pro' ? (
                          <>$29<span>/month</span></>
                        ) : getPlanType() === 'enterprise' ? (
                          <>$99<span>/month</span></>
                        ) : (
                          'Free'
                        )}
                      </div>
                    </div>

                    {isTrial() && !isTrialExpired() && (
                      <div className="trial-info">
                        <AlertCircle size={16} />
                        <span>
                          {getTrialDaysRemaining()} days remaining in your free trial
                        </span>
                      </div>
                    )}

                    {isTrialExpired() && (
                      <div className="trial-expired">
                        <AlertCircle size={16} />
                        <span>Your trial has expired. Upgrade to continue using the platform.</span>
                      </div>
                    )}

                    {subscription?.status === 'cancelled' && subscription?.cancelAtPeriodEnd && (
                      <div className="cancellation-info">
                        <AlertCircle size={16} />
                        <span>
                          Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="plan-usage">
                      <h4>Current Usage</h4>
                      {limits && usage && (
                        <div className="usage-stats">
                          <div className="usage-item">
                            <span className="usage-label">Projects:</span>
                            <span className="usage-value">
                              {usage.projectsCount} / {limits.maxProjects === -1 ? '∞' : limits.maxProjects}
                            </span>
                          </div>
                          <div className="usage-item">
                            <span className="usage-label">Team Members:</span>
                            <span className="usage-value">
                              {usage.teamMembersCount} / {limits.maxTeamMembers === -1 ? '∞' : limits.maxTeamMembers}
                            </span>
                          </div>
                          <div className="usage-item">
                            <span className="usage-label">Storage:</span>
                            <span className="usage-value">
                              {usage.storageUsedGB?.toFixed(1)} GB / {limits.maxStorageGB === -1 ? '∞' : limits.maxStorageGB} GB
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="plan-actions">
                      <button 
                        className="btn btn-primary" 
                        onClick={() => router.push('/pricing')}
                      >
                        {isTrialExpired() || !isActive() ? 'Upgrade Plan' : 'Change Plan'}
                      </button>
                      {isActive() && !isTrial() && subscription?.status !== 'cancelled' && (
                        <button 
                          className="btn btn-outline" 
                          onClick={handleCancelSubscription}
                          disabled={cancelling}
                        >
                          {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {subscription?.currentPeriodEnd && !isTrial() && (
                  <div className="billing-info">
                    <div className="info-item">
                      <span className="info-label">Next Billing Date:</span>
                      <span className="info-value">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Developer/API Tab */}
          {activeTab === 'developer' && (
            <div className="settings-section">
              <h2>Developer & API</h2>
              <p className="section-description">Manage API keys and developer settings</p>

              <div className="api-section">
                <h3>API Keys</h3>
                <div className="api-key-item">
                  <div className="api-key-info">
                    <div className="api-key-label">Production API Key</div>
                    <div className="api-key-value">sk_live_••••••••••••••••••••••••</div>
                    <div className="api-key-description">Created on Sep 1, 2024</div>
                  </div>
                  <div className="api-key-actions">
                    <button className="btn btn-outline">Copy</button>
                    <button className="btn btn-outline danger">Revoke</button>
                  </div>
                </div>

                <button className="btn btn-primary">
                  <Plus size={18} />
                  Generate New API Key
                </button>
              </div>

              <div className="api-section">
                <h3>Webhooks</h3>
                <p className="section-description">Configure webhooks for real-time updates</p>
                <button className="btn btn-outline">
                  <Plus size={18} />
                  Add Webhook
                </button>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="settings-section">
              <h2>Integrations</h2>
              <p className="section-description">Connect your favorite tools and services</p>
              <p style={{ marginTop: '16px', color: '#718096' }}>
                Manage integrations from the <a href="/integrations" style={{ color: '#6B46C1' }}>Integrations page</a>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => {
          if (!changingPassword) {
            setShowChangePasswordModal(false);
            setChangePasswordData({
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
            setPasswordError('');
          }
        }}
        title="Change Password"
        subtitle="Enter your current password and choose a new one"
        size="md"
        footer={
          <>
            <button
              className="modal-btn-cancel"
              onClick={() => {
                if (!changingPassword) {
                  setShowChangePasswordModal(false);
                  setChangePasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setPasswordError('');
                }
              }}
              disabled={changingPassword}
            >
              Cancel
            </button>
            <button
              className="modal-btn-primary"
              onClick={handleChangePassword}
              disabled={changingPassword || !changePasswordData.currentPassword || !changePasswordData.newPassword || !changePasswordData.confirmPassword}
            >
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </>
        }
      >
        <div className="change-password-form">
          {passwordError && (
            <div style={{
              padding: '12px',
              background: '#fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {passwordError}
            </div>
          )}

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="current-password">Current Password</label>
            <PasswordInput
              value={changePasswordData.currentPassword}
              onChange={(value) => {
                setChangePasswordData({ ...changePasswordData, currentPassword: value });
                setPasswordError('');
              }}
              placeholder="Enter your current password"
              showRequirements={false}
              disabled={changingPassword}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="new-password">New Password</label>
            <PasswordInput
              value={changePasswordData.newPassword}
              onChange={(value) => {
                setChangePasswordData({ ...changePasswordData, newPassword: value });
                setPasswordError('');
              }}
              placeholder="Enter your new password"
              showRequirements={true}
              disabled={changingPassword}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <PasswordInput
              value={changePasswordData.confirmPassword}
              onChange={(value) => {
                setChangePasswordData({ ...changePasswordData, confirmPassword: value });
                setPasswordError('');
              }}
              placeholder="Confirm your new password"
              showRequirements={false}
              disabled={changingPassword}
            />
            {changePasswordData.confirmPassword && changePasswordData.newPassword !== changePasswordData.confirmPassword && (
              <div style={{ marginTop: '8px', color: '#dc2626', fontSize: '13px' }}>
                Passwords do not match
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
