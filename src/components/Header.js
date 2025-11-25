import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Menu, Bell, LogOut, User } from 'lucide-react';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <h2 className="page-title">Welcome back, {user?.name}!</h2>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="header-item">
          <button 
            className="icon-button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="dropdown-menu notifications-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button 
                  className="view-all-btn"
                  onClick={() => {
                    navigate('/notifications');
                    setShowNotifications(false);
                  }}
                >
                  View All
                </button>
              </div>
              <div className="notifications-list">
                {notifications.slice(0, 5).map(notif => (
                  <div 
                    key={notif.id} 
                    className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                  >
                    <div className="notification-title">{notif.title}</div>
                    <div className="notification-message">{notif.message}</div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="empty-state">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="header-item">
          <button 
            className="user-button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <img src={user?.avatar} alt={user?.name} className="user-avatar-small" />
          </button>

          {showUserMenu && (
            <div className="dropdown-menu user-dropdown">
              <div className="user-menu-header">
                <img src={user?.avatar} alt={user?.name} className="user-avatar-large" />
                <div>
                  <div className="user-menu-name">{user?.name}</div>
                  <div className="user-menu-email">{user?.email}</div>
                  <div className="user-menu-role">{user?.role}</div>
                </div>
              </div>
              <div className="user-menu-items">
                <button 
                  className="user-menu-item"
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                >
                  <User size={16} />
                  <span>Settings</span>
                </button>
                <button className="user-menu-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
