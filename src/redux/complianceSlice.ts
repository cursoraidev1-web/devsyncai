/**
 * Redux Toolkit Slice for AI PRD Compliance Agent
 * Manages the state of compliance data and audit results
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComplianceData } from '../types/compliance';
import type { RootState } from './store';

interface ComplianceState {
  data: ComplianceData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ComplianceState = {
  data: null,
  loading: false,
  error: null,
};

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    setComplianceData: (state, action: PayloadAction<ComplianceData>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearComplianceData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
});

// Actions
export const { setComplianceData, setLoading, setError, clearComplianceData } = complianceSlice.actions;

// Selectors
export const selectComplianceData = (state: RootState) => state.compliance.data;
export const selectComplianceLoading = (state: RootState) => state.compliance.loading;
export const selectComplianceError = (state: RootState) => state.compliance.error;

// Reducer
export default complianceSlice.reducer;
