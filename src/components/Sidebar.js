import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  FolderOpen, 
  GitBranch, 
  BarChart3, 
  Bell,
  Settings
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/prd-designer', icon: FileText, label: 'PRD Designer' },
    { path: '/tasks', icon: CheckSquare, label: 'Task Tracker' },
    { path: '/documents', icon: FolderOpen, label: 'Documents' },
    { path: '/ci-cd', icon: GitBranch, label: 'CI/CD' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">Zyndrx</h1>
        <p className="sidebar-tagline">Project Coordination</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <img src={user?.avatar} alt={user?.name} className="user-avatar" />
          <div className="user-details">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
