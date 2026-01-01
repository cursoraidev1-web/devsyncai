'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
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
import '../../../styles/pages/Notifications.css';

const Notifications = () => {
  const { notifications, notificationsLoading, markNotificationRead, markAllNotificationsRead } = useApp();
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

  const filteredNotifications = (notifications || []).filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'mentions') return notif.type === 'mention';
    if (filter === 'tasks') return notif.type === 'task';
    if (filter === 'projects') return notif.type === 'project';
    if (filter === 'cicd') return notif.type === 'deployment';
    if (filter === 'prds') return notif.type === 'prd';
    if (filter === 'system') return notif.type === 'alert' || notif.type === 'user';
    return true;
  });

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    const isToday = days === 0;
    const isYesterday = days === 1;

    if (isToday && minutes < 60) {
      return `Today at ${new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    if (isToday) {
      return `Today at ${new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    if (isYesterday) {
      return `Yesterday at ${new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    if (days < 7) {
      return `${days} days ago`;
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <button className="btn btn-outline" onClick={handleMarkAllRead}>
          Mark All as Read
        </button>
      </div>

      {/* Search Bar */}
      <div className="notifications-search-bar">
        <div className="notifications-search-input">
          <Filter size={18} />
          <input
            type="text"
            placeholder="Search notifications..."
            className="search-input"
          />
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
          </button>
          <button
            className={`filter-tab ${filter === 'mentions' ? 'active' : ''}`}
            onClick={() => setFilter('mentions')}
          >
            Mentions
          </button>
          <button
            className={`filter-tab ${filter === 'tasks' ? 'active' : ''}`}
            onClick={() => setFilter('tasks')}
          >
            Tasks
          </button>
          <button
            className={`filter-tab ${filter === 'projects' ? 'active' : ''}`}
            onClick={() => setFilter('projects')}
          >
            Projects
          </button>
          <button
            className={`filter-tab ${filter === 'cicd' ? 'active' : ''}`}
            onClick={() => setFilter('cicd')}
          >
            CI/CD
          </button>
          <button
            className={`filter-tab ${filter === 'prds' ? 'active' : ''}`}
            onClick={() => setFilter('prds')}
          >
            PRDs
          </button>
          <button
            className={`filter-tab ${filter === 'system' ? 'active' : ''}`}
            onClick={() => setFilter('system')}
          >
            System
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-container">
        {filteredNotifications.length > 0 ? (
          <div className="notifications-list">
      {notificationsLoading && (
        <div className="notifications-loading">Loading notifications...</div>
      )}
      {!notificationsLoading && filteredNotifications.length === 0 && (
        <div className="notifications-empty">No notifications yet.</div>
      )}
      {!notificationsLoading && filteredNotifications.map(notif => {
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
                    </div>
                    <p>{notif.message}</p>
                    <div className="notification-footer">
                      <span className="notification-source">
                        {notif.source || 'System'} • {formatTimestamp(notif.timestamp)}
                      </span>
                      {notif.action && (
                        <button className="notification-action-btn">
                          {notif.action}
                        </button>
                      )}
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
