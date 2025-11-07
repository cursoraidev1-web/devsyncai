/**
 * Redux Store Configuration
 * Centralizes state management for DevSync AI platform
 */

import { configureStore } from '@reduxjs/toolkit';
import complianceReducer from './complianceSlice';
import alertsReducer from './alertsSlice';

/**
 * Configure and create the Redux store
 */
export const store = configureStore({
  reducer: {
    compliance: complianceReducer,
    alerts: alertsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if needed for non-serializable values
        ignoredActions: [],
      },
    }),
});

// Infer types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
