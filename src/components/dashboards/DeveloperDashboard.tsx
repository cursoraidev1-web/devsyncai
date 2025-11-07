/**
 * Developer Dashboard Component (Placeholder)
 * Future: Will display commit summaries, PR insights, and blockers
 */

import React from 'react';

const DeveloperDashboard: React.FC = () => {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Developer Dashboard</h1>
        </div>
        <div className="card">
          <p className="empty-state-title">
            Developer dashboard coming soon...
          </p>
          <p className="empty-state-subtitle">
            Will include: commit summaries, PR insights, AI-detected blockers
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
