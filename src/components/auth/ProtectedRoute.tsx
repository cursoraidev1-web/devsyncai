/**
 * Protected Route Component
 * Prevents unauthorized access to pages
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-gray-50)',
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="page">
        <div className="container">
          <div className="card" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
            <svg style={{ width: '4rem', height: '4rem', color: 'var(--color-error)', margin: '0 auto var(--spacing-lg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
              Access Denied
            </h2>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-lg)' }}>
              You don't have permission to access this page. Your role ({user.role}) does not allow access to this resource.
            </p>
            <button className="btn btn-primary" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
