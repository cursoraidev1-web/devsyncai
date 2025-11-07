/**
 * Main App Component
 * Entry point for DevSync AI application
 */

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Dashboard from './pages/Dashboard';
import { setComplianceData } from './redux/complianceSlice';
import type { ComplianceData } from './types/compliance';

function App() {
  const dispatch = useDispatch();

  // Simulate loading compliance data (in real app, this would be an API call)
  useEffect(() => {
    // Mock compliance data for demonstration
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

    // Simulate API delay
    const timer = setTimeout(() => {
      dispatch(setComplianceData(mockComplianceData));
    }, 800);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
