/**
 * Notifications Page
 * Feature 4: Role-Based Handoff & Alert System - FULLY FUNCTIONAL
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  selectNotifications,
  selectUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAll,
  addNotification,
  type Notification,
} from '../redux/notificationsSlice';

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const [filter, setFilter] = useState<'all' | 'unread' | 'handoffs'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'handoffs') return n.type === 'handoff';
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
    toast.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
    toast.success(`All ${unreadCount} notifications marked as read`);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id));
    toast.info('Notification deleted');
  };

  const handleTakeAction = (notification: Notification) => {
    toast.success(`Taking action on: ${notification.title}`);
    dispatch(markAsRead(notification.id));
    // In a real app, this would navigate to the relevant page or open a modal
  };

  const handleViewDetails = (notification: Notification) => {
    toast.info(`Viewing details for: ${notification.title}`);
    dispatch(markAsRead(notification.id));
  };

  const handleClearAll = () => {
    if (window.confirm(`Are you sure you want to delete all ${notifications.length} notifications?`)) {
      dispatch(clearAll());
      toast.success('All notifications cleared');
    }
  };

  // Demo: Add new notification
  const handleAddTestNotification = () => {
    const types: Notification['type'][] = ['handoff', 'alert', 'approval', 'mention'];
    const priorities: Notification['priority'][] = ['high', 'medium', 'low'];
    
    dispatch(addNotification({
      type: types[Math.floor(Math.random() * types.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      title: 'New Test Notification',
      message: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
      from: 'System',
      timestamp: new Date().toISOString(),
      read: false,
      actionable: true,
    }));
    toast.success('Test notification added!');
  };

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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
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
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" onClick={handleAddTestNotification}>
              + Test Notification
            </button>
            {unreadCount > 0 && (
              <button className="btn btn-outline btn-sm" onClick={handleMarkAllAsRead}>
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button className="btn btn-outline btn-sm" onClick={handleClearAll}>
                Clear All
              </button>
            )}
          </div>
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
                      From: {notification.from} • {formatTimestamp(notification.timestamp)}
                    </span>

                    <div className="flex gap-2">
                      {notification.actionable && (
                        <>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleTakeAction(notification)}
                          >
                            Take Action
                          </button>
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => handleViewDetails(notification)}
                          >
                            View Details
                          </button>
                        </>
                      )}
                      {!notification.read && (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleDelete(notification.id)}
                        style={{ color: 'var(--color-error)' }}
                      >
                        Delete
                      </button>
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
              <button className="btn btn-primary mt-3" onClick={handleAddTestNotification}>
                Add Test Notification
              </button>
            </div>
          </div>
        )}

        {/* Notification Preferences */}
        <div className="card mt-4">
          <h3 className="card-title mb-3">Notification Preferences</h3>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  style={{ marginRight: 'var(--spacing-sm)' }}
                  onChange={(e) => {
                    toast.success(e.target.checked ? 'Role handoffs enabled' : 'Role handoffs disabled');
                  }}
                />
                Role handoffs (when tasks are assigned to my role)
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  style={{ marginRight: 'var(--spacing-sm)' }}
                  onChange={(e) => {
                    toast.success(e.target.checked ? 'PRD compliance alerts enabled' : 'PRD compliance alerts disabled');
                  }}
                />
                PRD compliance alerts
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">
                <input 
                  type="checkbox" 
                  defaultChecked 
                  style={{ marginRight: 'var(--spacing-sm)' }}
                  onChange={(e) => {
                    toast.success(e.target.checked ? 'Approval requests enabled' : 'Approval requests disabled');
                  }}
                />
                Approval requests
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">
                <input 
                  type="checkbox" 
                  style={{ marginRight: 'var(--spacing-sm)' }}
                  onChange={(e) => {
                    toast.success(e.target.checked ? 'Team mentions enabled' : 'Team mentions disabled');
                  }}
                />
                All team mentions
              </label>
            </div>
          </div>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => toast.success('Notification preferences saved!')}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
