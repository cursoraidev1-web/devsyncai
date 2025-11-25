import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ collapsed, onToggle, currentUser }) {
  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/prd', icon: '📝', label: 'PRD Designer' },
    { path: '/tasks', icon: '✓', label: 'Tasks' },
    { path: '/docs', icon: '📁', label: 'Documentation' },
    { path: '/cicd', icon: '🚀', label: 'CI/CD' },
    { path: '/analytics', icon: '📈', label: 'Analytics' },
    { path: '/team', icon: '👥', label: 'Team' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {!collapsed && <span className="logo-text">Zyndrx</span>}
          {collapsed && <span className="logo-icon">Z</span>}
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">{currentUser.avatar}</div>
          {!collapsed && (
            <div className="user-info">
              <div className="user-name">{currentUser.name}</div>
              <div className="user-role">{currentUser.role}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
