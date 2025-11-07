/**
 * Main App Component
 * Entry point with routing and authentication
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MFAVerification from './pages/MFAVerification';
import Dashboard from './pages/Dashboard';
import PRDDesigner from './pages/PRDDesigner';
import Documentation from './pages/Documentation';
import CICDPipeline from './pages/CICDPipeline';
import DevelopmentInsights from './pages/DevelopmentInsights';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Security from './pages/Security';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import Team from './pages/Team';
import { setComplianceData } from './redux/complianceSlice';
import type { ComplianceData } from './types/compliance';

function AppRoutes() {
  const dispatch = useDispatch();

  // Load mock compliance data on app start
  useEffect(() => {
    const mockComplianceData: ComplianceData = {
      score: 72,
      latestCommitId: 'a3f5c9d',
      lastChecked: new Date().toISOString(),
      prdVersion: 'v2.1.0',
      recommendations: [
        {
          section: 'Feature 3.2: Real-time Notifications',
          fix: 'Missing WebSocket implementation for real-time alerts. Required by PRD section 4.1.',
        },
        {
          section: 'Security Requirement 5.1',
          fix: 'API endpoints lack rate limiting middleware as specified in security compliance.',
        },
        {
          section: 'Feature 2.3: Document Search',
          fix: 'AI-powered search summarization not yet implemented. Blocking PRD requirement 2.3.b.',
        },
      ],
    };

    dispatch(setComplianceData(mockComplianceData));
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/mfa-verify" element={<MFAVerification />} />

      {/* Protected Routes with Layout */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/prd-designer" element={<PRDDesigner />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/cicd-pipeline" element={<CICDPipeline />} />
        <Route path="/development-insights" element={<DevelopmentInsights />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/security" element={<Security />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/team" element={<Team />} />
      </Route>

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
