/**
 * Notifications Redux Slice
 * Manages notification state with full CRUD operations
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface Notification {
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

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [
    {
      id: '1',
      type: 'handoff',
      priority: 'high',
      title: 'New Feature Ready for QA Testing',
      message: 'Feature "User Authentication" completed and ready for testing. Test cases and code links attached.',
      from: 'Sarah Chen (Developer)',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
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
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
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
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
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
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      actionable: false,
    },
  ],
  unreadCount: 3,
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.unshift(newNotification);
      if (!newNotification.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        if (!state.notifications[index].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    clearAll: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAll,
} = notificationsSlice.actions;

export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;

export default notificationsSlice.reducer;
