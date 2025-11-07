/**
 * Main Dashboard Page
 * Routes users to role-specific dashboards
 */

import React, { useState } from 'react';
import ProductOwnerDashboard from '../components/dashboards/ProductOwnerDashboard';
import DeveloperDashboard from '../components/dashboards/DeveloperDashboard';

type UserRole = 'po' | 'developer' | 'pm' | 'designer';

const Dashboard: React.FC = () => {
  // In a real app, this would come from auth/user context
  const [activeRole, setActiveRole] = useState<UserRole>('po');

  const renderDashboard = () => {
    switch (activeRole) {
      case 'po':
        return <ProductOwnerDashboard />;
      case 'developer':
        return <DeveloperDashboard />;
      default:
        return (
          <div className="page">
            <div className="container">
              <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
              </div>
              <div className="card">
                <p className="empty-state-title">
                  Dashboard for {activeRole} role coming soon...
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Role Switcher */}
      <div className="top-bar">
        <div className="top-bar-content">
          <span className="top-bar-label">Role:</span>
          <div className="role-buttons">
            {(['po', 'developer', 'pm', 'designer'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`role-button ${activeRole === role ? 'active' : ''}`}
              >
                {role.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Dashboard */}
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
