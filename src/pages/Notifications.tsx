/**
 * Notifications Page
 * Feature 4: Role-Based Handoff & Alert System
 */

import React, { useState } from 'react';

interface Notification {
  id: string;
  type: 'handoff' | 'alert' | 'approval' | 'mention';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  from: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
}

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'handoffs'>('all');
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'handoff',
      priority: 'high',
      title: 'New Feature Ready for QA Testing',
      message: 'Feature "User Authentication" completed and ready for testing. Test cases and code links attached.',
      from: 'Sarah Chen (Developer)',
      timestamp: '5 minutes ago',
      read: false,
      actionable: true,
    },
    {
      id: '2',
      type: 'alert',
      priority: 'high',
      title: 'PRD Compliance Issue Detected',
      message: 'Feature 3.2: Real-time Notifications is missing WebSocket implementation as specified in PRD section 4.1.',
      from: 'AI Compliance Agent',
      timestamp: '2 hours ago',
      read: false,
      actionable: true,
    },
    {
      id: '3',
      type: 'approval',
      priority: 'medium',
      title: 'PRD Section Awaiting Approval',
      message: '"Acceptance Criteria" section has been updated and requires your review and approval.',
      from: 'Mike Johnson (PM)',
      timestamp: '3 hours ago',
      read: false,
      actionable: true,
    },
    {
      id: '4',
      type: 'mention',
      priority: 'low',
      title: 'You were mentioned in a comment',
      message: '@you Great work on the dashboard optimization! The load time improved significantly.',
      from: 'Alex Kumar',
      timestamp: '1 day ago',
      read: true,
      actionable: false,
    },
    {
      id: '5',
      type: 'handoff',
      priority: 'medium',
      title: 'Security Review Required',
      message: 'API endpoints deployment completed. Security review needed before going to production.',
      from: 'DevOps Team',
      timestamp: '1 day ago',
      read: true,
      actionable: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'handoffs') return n.type === 'handoff';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'handoff':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'alert':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'approval':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'mention':
        return (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            Role-based alerts and handoffs across the development chain
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex justify-between align-center mb-4">
          <div className="flex gap-2">
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`btn btn-sm ${filter === 'unread' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`btn btn-sm ${filter === 'handoffs' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('handoffs')}
            >
              Handoffs
            </button>
          </div>
          <button className="btn btn-outline" onClick={markAllAsRead}>
            Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex flex-column gap-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="card"
              style={{
                backgroundColor: notification.read ? 'var(--color-white)' : 'var(--color-info-light)',
                borderLeft: `4px solid ${
                  notification.priority === 'high' ? 'var(--color-error)' :
                  notification.priority === 'medium' ? 'var(--color-warning)' :
                  'var(--color-info)'
                }`,
              }}
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-gray-100)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div className="flex justify-between align-center mb-2">
                    <div className="flex align-center gap-2">
                      <h4 style={{ fontWeight: 600, margin: 0 }}>{notification.title}</h4>
                      {!notification.read && (
                        <span
                          style={{
                            width: '0.5rem',
                            height: '0.5rem',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--color-primary)',
                          }}
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span className={`badge badge-${notification.priority === 'high' ? 'error' : notification.priority === 'medium' ? 'warning' : 'info'}`}>
                        {notification.priority}
                      </span>
                      <span className="badge badge-outline">{notification.type}</span>
                    </div>
                  </div>

                  <p style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-gray-700)' }}>
                    {notification.message}
                  </p>

                  <div className="flex justify-between align-center">
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                      From: {notification.from} • {notification.timestamp}
                    </span>

                    <div className="flex gap-2">
                      {notification.actionable && (
                        <>
                          <button className="btn btn-sm btn-primary">Take Action</button>
                          <button className="btn btn-sm btn-outline">View Details</button>
                        </>
                      )}
                      {!notification.read && (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="card">
            <div className="empty-state">
              <svg className="icon-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="empty-state-title">All caught up!</p>
              <p className="empty-state-subtitle">You have no {filter} notifications.</p>
            </div>
          </div>
        )}

        {/* Notification Preferences */}
        <div className="card mt-4">
          <h3 className="card-title mb-3">Notification Preferences</h3>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">
                <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                Role handoffs (when tasks are assigned to my role)
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">
                <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                PRD compliance alerts
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">
                <input type="checkbox" defaultChecked style={{ marginRight: 'var(--spacing-sm)' }} />
                Approval requests
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">
                <input type="checkbox" style={{ marginRight: 'var(--spacing-sm)' }} />
                All team mentions
              </label>
            </div>
          </div>
          <button className="btn btn-primary mt-2">Save Preferences</button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
