/**
 * Redux Toolkit Slice for AI PRD Compliance Management
 * Implements the Model/Controller layer for Feature 3: AI PRD Compliance Agent
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComplianceData } from '../types/compliance';
import type { RootState } from './store';

/**
 * State shape for compliance feature
 */
interface ComplianceState {
  data: ComplianceData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial state
 */
const initialState: ComplianceState = {
  data: null,
  isLoading: false,
  error: null,
};

/**
 * Compliance slice - manages AI PRD compliance audit data
 */
export const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    /**
     * Updates the compliance data with the latest AI audit results
     */
    setComplianceData: (state, action: PayloadAction<ComplianceData>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    /**
     * Sets loading state during compliance checks
     */
    setComplianceLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /**
     * Sets error state if compliance check fails
     */
    setComplianceError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    /**
     * Clears compliance data (e.g., on logout or project switch)
     */
    clearComplianceData: (state) => {
      state.data = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

// Action creators
export const {
  setComplianceData,
  setComplianceLoading,
  setComplianceError,
  clearComplianceData,
} = complianceSlice.actions;

// Selectors
/**
 * Selects the full compliance data object
 */
export const selectComplianceData = (state: RootState): ComplianceData | null =>
  state.compliance.data;

/**
 * Selects just the compliance score
 */
export const selectComplianceScore = (state: RootState): number | null =>
  state.compliance.data?.score ?? null;

/**
 * Selects recommendations array
 */
export const selectComplianceRecommendations = (state: RootState) =>
  state.compliance.data?.recommendations ?? [];

/**
 * Selects loading state
 */
export const selectComplianceLoading = (state: RootState): boolean =>
  state.compliance.isLoading;

/**
 * Selects error state
 */
export const selectComplianceError = (state: RootState): string | null =>
  state.compliance.error;

// Reducer export
export default complianceSlice.reducer;
