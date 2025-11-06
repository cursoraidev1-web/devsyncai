/**
 * Redux Toolkit Slice for Role-Based Handoff & Alert System (Feature 4)
 * Placeholder for future implementation
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface Alert {
  id: string;
  role: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
}

interface AlertsState {
  alerts: Alert[];
  unreadCount: number;
}

const initialState: AlertsState = {
  alerts: [],
  unreadCount: 0,
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    clearAlerts: (state) => {
      state.alerts = [];
      state.unreadCount = 0;
    },
  },
});

// Actions
export const { addAlert, markAsRead, clearAlerts } = alertsSlice.actions;

// Selectors
export const selectAlerts = (state: RootState) => state.alerts.alerts;
export const selectUnreadCount = (state: RootState) => state.alerts.unreadCount;

// Reducer
export default alertsSlice.reducer;
