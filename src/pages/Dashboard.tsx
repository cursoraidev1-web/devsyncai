/**
 * Main Dashboard Page
 * Routes to role-specific dashboards
 */

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import ProductOwnerDashboard from '../components/dashboards/ProductOwnerDashboard';
import DeveloperDashboard from '../components/dashboards/DeveloperDashboard';

type DashboardRole = 'po' | 'developer';

const Dashboard: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<DashboardRole>('po');

  return (
    <Provider store={store}>
      <div>
        {/* Role Selector */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">DevSync AI</h2>
              <span className="text-gray-400">|</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentRole('po')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentRole === 'po'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Product Owner
                </button>
                <button
                  onClick={() => setCurrentRole('developer')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentRole === 'developer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Developer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {currentRole === 'po' && <ProductOwnerDashboard />}
        {currentRole === 'developer' && <DeveloperDashboard />}
      </div>
    </Provider>
  );
};

export default Dashboard;
