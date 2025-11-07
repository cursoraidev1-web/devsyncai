/**
 * Developer Dashboard Component (Placeholder)
 * Future: Will display commit summaries, PR insights, and blockers
 */

import React from 'react';

const DeveloperDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Developer Dashboard
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600">
            Developer dashboard coming soon...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Will include: commit summaries, PR insights, AI-detected blockers
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
