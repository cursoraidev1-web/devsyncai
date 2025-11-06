/**
 * Redux Store Configuration
 * Centralizes all state management slices for DevSync AI
 */

import { configureStore } from '@reduxjs/toolkit';
import complianceReducer from './complianceSlice';
import alertsReducer from './alertsSlice';

export const store = configureStore({
  reducer: {
    compliance: complianceReducer,
    alerts: alertsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
