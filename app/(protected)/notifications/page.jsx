'use client';


import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { deleteNotification as apiDeleteNotification } from '../../../services/api/notifications';
import { toast } from 'react-toastify';
import {
  Bell,
  CheckCircle,
  Trash2,
  Filter,
  GitBranch,
  FileText,
  AlertCircle,
  MessageSquare,
  User
} from 'lucide-react';
import '../../../styles/pages/Notifications.css';

const Notifications = () => {
  const { notifications, notificationsLoading, markNotificationRead, markAllNotificationsRead, setNotifications } = useApp();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    if (filter === 'mentions') return notif.type === 'mention';
    if (filter === 'tasks') return notif.type === 'task';
    if (filter === 'projects') return notif.type === 'project';
    if (filter === 'cicd') return notif.type === 'deployment';
    if (filter === 'prds') return notif.type === 'prd';
    if (filter === 'system') return notif.type === 'alert' || notif.type === 'user';
    return true;
  }).filter(notif => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (notif.title || '').toLowerCase().includes(q) ||
      (notif.message || '').toLowerCase().includes(q) ||
      (notif.source || '').toLowerCase().includes(q)
    );
  });

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const days = Math.floor(diff / 86400000);

    if (days === 0 && minutes < 60) {
      return `Today at ${new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    if (days === 0) {
      return `Today at ${new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    }
    if (days === 1) {
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
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (e, notifId) => {
    e.stopPropagation();
    try {
      await apiDeleteNotification(notifId);
      // Remove from local state
      if (typeof setNotifications === 'function') {
        setNotifications(prev => prev.filter(n => n.id !== notifId));
      }
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>
          Notifications{' '}
          {unreadCount > 0 && (
            <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#6b7280' }}>
              ({unreadCount} unread)
            </span>
          )}
        </h1>
        <button className="btn btn-outline" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="notifications-controls">
        <div className="filter-tabs">
          {[
            { id: 'all', label: 'All' },
            { id: 'mentions', label: 'Mentions' },
            { id: 'tasks', label: 'Tasks' },
            { id: 'projects', label: 'Projects' },
            { id: 'cicd', label: 'CI/CD' },
            { id: 'prds', label: 'PRDs' },
            { id: 'system', label: 'System' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`filter-tab ${filter === tab.id ? 'active' : ''}`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-container">
        {notificationsLoading && (
          <div className="notifications-loading">Loading notifications...</div>
        )}
        {!notificationsLoading && filteredNotifications.length > 0 ? (
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
                    </div>
                    <p>{notif.message}</p>
                    <div className="notification-footer">
                      <span className="notification-source">
                        {notif.source || 'System'} â€¢ {formatTimestamp(notif.timestamp || notif.created_at)}
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
                    title="Delete notification"
                    onClick={(e) => handleDelete(e, notif.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : !notificationsLoading ? (
          <div className="empty-state">
            <Bell size={64} />
            <h2>No Notifications</h2>
            <p>You're all caught up!{filter !== 'all' ? ` No ${filter} notifications to show.` : ''}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Notifications;
