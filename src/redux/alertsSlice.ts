/**
 * Redux Toolkit Slice for Role-Based Handoff & Alert System
 * Placeholder for Feature 4: Role-Based Handoff & Alert System
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

/**
 * Alert/Notification structure
 */
interface Alert {
  id: string;
  role: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  read: boolean;
}

/**
 * State shape for alerts feature
 */
interface AlertsState {
  alerts: Alert[];
  unreadCount: number;
}

/**
 * Initial state
 */
const initialState: AlertsState = {
  alerts: [],
  unreadCount: 0,
};

/**
 * Alerts slice - manages role-based notifications and handoffs
 */
export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    /**
     * Adds a new alert to the system
     */
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    /**
     * Marks an alert as read
     */
    markAlertAsRead: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert && !alert.read) {
        alert.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    /**
     * Clears all alerts
     */
    clearAlerts: (state) => {
      state.alerts = [];
      state.unreadCount = 0;
    },
  },
});

// Action creators
export const { addAlert, markAlertAsRead, clearAlerts } = alertsSlice.actions;

// Selectors
export const selectAlerts = (state: RootState) => state.alerts.alerts;
export const selectUnreadCount = (state: RootState) => state.alerts.unreadCount;

// Reducer export
export default alertsSlice.reducer;
