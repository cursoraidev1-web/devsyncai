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
          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Dashboard
              </h1>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-gray-600">
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
      {/* Role Switcher (for demo purposes) */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Role:</span>
            {(['po', 'developer', 'pm', 'designer'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeRole === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
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
