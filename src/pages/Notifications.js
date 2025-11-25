import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  CheckCircle, 
  Trash2,
  Filter,
  CheckCheck,
  GitBranch,
  FileText,
  AlertCircle,
  MessageSquare,
  User
} from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const { notifications, markNotificationRead } = useApp();
  const [filter, setFilter] = useState('all');

  const notificationIcons = {
    'task': CheckCircle,
    'deployment': GitBranch,
    'prd': FileText,
    'mention': MessageSquare,
    'alert': AlertCircle,
    'user': User
  };

  const notificationColors = {
    'task': '#10b981',
    'deployment': '#4f46e5',
    'prd': '#f59e0b',
    'mention': '#8b5cf6',
    'alert': '#ef4444',
    'user': '#06b6d4'
  };

  const allNotifications = [
    {
      id: 1,
      type: 'task',
      title: 'New task assigned',
      message: 'You have been assigned to "User Authentication API"',
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'deployment',
      title: 'Deployment successful',
      message: 'Production build #234 deployed successfully',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 3,
      type: 'mention',
      title: 'You were mentioned',
      message: 'Sarah Wilson mentioned you in "Dashboard Redesign"',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    },
    {
      id: 4,
      type: 'prd',
      title: 'PRD needs approval',
      message: 'Mobile App Authentication v1.0 is ready for review',
      timestamp: new Date(Date.now() - 10800000),
      read: false
    },
    {
      id: 5,
      type: 'deployment',
      title: 'Build failed',
      message: 'Feature branch build failed with 3 errors',
      timestamp: new Date(Date.now() - 14400000),
      read: true
    },
    {
      id: 6,
      type: 'task',
      title: 'Task completed',
      message: 'Mike Johnson completed "Setup CI/CD Pipeline"',
      timestamp: new Date(Date.now() - 21600000),
      read: true
    },
    {
      id: 7,
      type: 'user',
      title: 'New team member',
      message: 'Tom Brown joined the E-Commerce Platform project',
      timestamp: new Date(Date.now() - 43200000),
      read: true
    },
    {
      id: 8,
      type: 'alert',
      title: 'System maintenance',
      message: 'Scheduled maintenance on Saturday at 2:00 AM',
      timestamp: new Date(Date.now() - 86400000),
      read: true
    }
  ];

  const filteredNotifications = allNotifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = allNotifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleMarkAllRead = () => {
    allNotifications.forEach(notif => {
      if (!notif.read) {
        markNotificationRead(notif.id);
      }
    });
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-subtitle">Stay updated with your team's activity</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={handleMarkAllRead}>
            <CheckCheck size={18} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="notifications-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
            <Bell size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{allNotifications.length}</div>
            <div className="stat-label">Total Notifications</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{unreadCount}</div>
            <div className="stat-label">Unread</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{allNotifications.length - unreadCount}</div>
            <div className="stat-label">Read</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="notifications-controls">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
            <span className="tab-count">{allNotifications.length}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread
            {unreadCount > 0 && <span className="tab-count unread">{unreadCount}</span>}
          </button>
          <button
            className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read
            <span className="tab-count">{allNotifications.length - unreadCount}</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-container">
        {filteredNotifications.length > 0 ? (
          <div className="notifications-list">
            {filteredNotifications.map(notif => {
              const Icon = notificationIcons[notif.type] || Bell;
              const color = notificationColors[notif.type] || '#6b7280';

              return (
                <div
                  key={notif.id}
                  className={`notification-card ${notif.read ? 'read' : 'unread'}`}
                  onClick={() => !notif.read && markNotificationRead(notif.id)}
                >
                  <div
                    className="notification-icon"
                    style={{ backgroundColor: `${color}15`, color: color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h3>{notif.title}</h3>
                      {!notif.read && <div className="unread-dot" />}
                    </div>
                    <p>{notif.message}</p>
                    <div className="notification-footer">
                      <span className="notification-time">
                        {formatTimestamp(notif.timestamp)}
                      </span>
                      <span className={`notification-type badge badge-${
                        notif.type === 'alert' ? 'danger' : 
                        notif.type === 'task' ? 'success' : 
                        notif.type === 'deployment' ? 'primary' : 
                        'secondary'
                      }`}>
                        {notif.type}
                      </span>
                    </div>
                  </div>
                  <button
                    className="notification-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Bell size={64} />
            <h2>No Notifications</h2>
            <p>You're all caught up! No {filter !== 'all' ? filter : ''} notifications to show.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
