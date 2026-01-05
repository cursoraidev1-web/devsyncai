import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CheckSquare,
  FolderOpen,
  Users,
  Wrench,
  Network,
  ArrowRightLeft,
  Bot,
  Puzzle,
  Settings,
  Headphones,
  MessageSquare,
  LogOut,
  ChevronRight,
  Download,
  Mail
} from 'lucide-react';
import Modal from './ui/Modal';
import PWAInstallModal from './PWAInstallModal';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { user, logout, logoutLoading } = useAuth();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Define access levels for different roles
  const getAccessLevel = () => {
    if (!user) return 'viewer';
    
    const roleAccess = {
      'admin': 'admin',
      'pm': 'editor',
      'product-owner': 'editor',
      'developer': 'editor',
      'qa': 'editor',
      'devops': 'editor'
    };
    
    return roleAccess[user.role] || 'viewer';
  };

  const accessLevel = getAccessLevel();
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  // Main Menu - Available to all authenticated users
  const mainMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', access: 'all' },
    { path: '/tasks', icon: CheckSquare, label: 'My Tasks', access: 'all' },
    { path: '/projects', icon: FolderOpen, label: 'Projects', access: 'all' },
    { path: '/teams', icon: Users, label: 'Teams', access: 'all' },
  ];

  // Product Tools - Available to editors and admins
  const productToolsItems = [
    { path: '/prd-designer', icon: Wrench, label: 'PRD Designer', access: 'editor' },
    { path: '/documents', icon: Network, label: 'Documentation Hub', access: 'editor' },
    { path: '/handoffs', icon: ArrowRightLeft, label: 'Handoff System', access: 'editor' },
    { path: '/ci-cd', icon: Bot, label: 'CI/CD Auto-Agent', access: 'editor' },
    { path: '/integrations', icon: Puzzle, label: 'Integrations', access: 'editor' },
    { path: '/email-test', icon: Mail, label: 'Email Testing', access: 'editor' },
  ];

  // Settings - Available to all
  const settingsItems = [
    { path: '/settings', icon: Settings, label: 'Settings', access: 'all' },
    { path: '/support', icon: Headphones, label: 'Support & Help', access: 'all' },
    { path: '/feedback', icon: MessageSquare, label: 'Feedback', access: 'all' },
    { 
      type: 'button', 
      icon: Download, 
      label: 'Install App', 
      access: 'all',
      onClick: () => setShowInstallModal(true)
    },
  ];

  const canAccess = (itemAccess) => {
    if (itemAccess === 'all') return true;
    if (itemAccess === 'editor' && (accessLevel === 'editor' || accessLevel === 'admin')) return true;
    if (itemAccess === 'admin' && accessLevel === 'admin') return true;
    return false;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo-icon">Z</div>
            <span className="sidebar-logo-text">ZynDrx</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Main Menu Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-label">MAIN MENU</div>
            {mainMenuItems.map((item) => {
              if (!canAccess(item.access)) return null;
              const Icon = item.icon;
              const isActive = pathname === item.path || 
                              (item.path === '/dashboard' && pathname.startsWith('/dashboard'));
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Product Tools Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-label">PRODUCT TOOLS</div>
            {productToolsItems.map((item) => {
              if (!canAccess(item.access)) return null;
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Settings Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-label">SETTINGS</div>
            {settingsItems.map((item) => {
              if (!canAccess(item.access)) return null;
              const Icon = item.icon;
              
              // Handle button type items (like Install App)
              if (item.type === 'button') {
                return (
                  <button
                    key={item.label || 'install-app'}
                    onClick={item.onClick}
                    className="nav-item"
                    type="button"
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              }
              
              // Regular link items
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div 
            className="user-profile-card"
            onClick={() => setShowLogoutModal(true)}
          >
            <div className="user-profile-avatar">
              {user?.avatar || user?.avatarUrl || user?.avatar_url ? (
                <img 
                  src={user?.avatar || user?.avatarUrl || user?.avatar_url} 
                  alt={user?.name || 'User'} 
                  className="user-profile-avatar-img"
                />
              ) : (
                userInitials
              )}
            </div>
            <div className="user-profile-info">
              <div className="user-profile-name">{user?.name || 'User'}</div>
              <div className="user-profile-email">{user?.email || 'user@example.com'}</div>
            </div>
            <ChevronRight size={16} className="user-profile-arrow" />
          </div>
        </div>
      </aside>

      {/* PWA Install Modal */}
      <PWAInstallModal 
        isOpen={showInstallModal} 
        onClose={() => setShowInstallModal(false)} 
      />

      {/* Logout Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Log Out?"
        size="sm"
        footer={
          <>
            <button 
              className="modal-btn-cancel"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </button>
            <button 
              className="modal-btn-danger"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? (
                <>
                  <span className="spinner-small"></span>
                  Logging out...
                </>
              ) : (
                'Log Out'
              )}
            </button>
          </>
        }
      >
        <div className="logout-modal-content">
          <p className="logout-modal-description">
            You're about to log out of your ZynDrx workspace.
          </p>
          <div className="logout-user-info">
            <div className="logout-user-avatar">
              {user?.avatar || user?.avatarUrl || user?.avatar_url ? (
                <img 
                  src={user?.avatar || user?.avatarUrl || user?.avatar_url} 
                  alt={user?.name || 'User'} 
                  className="logout-user-avatar-img"
                />
              ) : (
                userInitials
              )}
            </div>
            <div>
              <div className="logout-user-name">{user?.name || 'User'}</div>
              <div className="logout-user-email">{user?.email || 'user@example.com'}</div>
            </div>
          </div>
          <label className="logout-remember-device">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
            />
            <span>Remember this device</span>
          </label>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
