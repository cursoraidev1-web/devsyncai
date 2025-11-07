/**
 * Product Owner (PO) Dashboard Component
 * Primary View for Feature 3: AI PRD Compliance Agent
 * Displays compliance score and recommendations for the Product Owner role
 */

import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectComplianceData,
  selectComplianceScore,
  selectComplianceRecommendations,
  selectComplianceLoading,
} from '../../redux/complianceSlice';

/**
 * ProductOwnerDashboard - Displays AI PRD compliance metrics
 */
const ProductOwnerDashboard: React.FC = () => {
  const complianceData = useSelector(selectComplianceData);
  const score = useSelector(selectComplianceScore);
  const recommendations = useSelector(selectComplianceRecommendations);
  const isLoading = useSelector(selectComplianceLoading);

  /**
   * Determine score level for styling
   */
  const getScoreLevel = (score: number | null): string => {
    if (score === null) return '';
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const scoreLevel = getScoreLevel(score);

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Product Owner Dashboard</h1>
          </div>
          <div className="card">
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Product Owner Dashboard</h1>
          <p className="page-subtitle">
            Monitor PRD compliance and track development alignment
          </p>
        </div>

        {/* Main Compliance Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">AI PRD Compliance Status</h2>
            {complianceData?.lastChecked && (
              <span className="card-subtitle">
                Last checked: {new Date(complianceData.lastChecked).toLocaleString()}
              </span>
            )}
          </div>

          {complianceData ? (
            <>
              {/* Compliance Score Display */}
              <div className="score-container">
                <div className={`score-badge score-${scoreLevel}`}>
                  <span className={`score-value score-${scoreLevel}`}>
                    {score}
                  </span>
                  <span className="score-label">Compliance Score</span>
                </div>
              </div>

              {/* Metadata */}
              <div className="metadata-grid">
                <div className="metadata-item">
                  <p className="metadata-label">Latest Commit</p>
                  <p className="metadata-value mono">
                    {complianceData.latestCommitId}
                  </p>
                </div>
                {complianceData.prdVersion && (
                  <div className="metadata-item">
                    <p className="metadata-label">PRD Version</p>
                    <p className="metadata-value">
                      {complianceData.prdVersion}
                    </p>
                  </div>
                )}
              </div>

              {/* Recommendations Section */}
              <div className="recommendations-section">
                <div className="recommendations-header">
                  <h3 className="recommendations-title">
                    Pending Recommendations
                  </h3>
                  <span
                    className={`badge ${
                      recommendations.length === 0 ? 'badge-success' : 'badge-error'
                    }`}
                  >
                    {recommendations.length} issue{recommendations.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {recommendations.length > 0 ? (
                  <div className="recommendations-list">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="recommendation-card">
                        <div className="recommendation-number">
                          {index + 1}
                        </div>
                        <div className="recommendation-content">
                          <h4 className="recommendation-section">
                            {rec.section}
                          </h4>
                          <p className="recommendation-fix">{rec.fix}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state empty-state-success">
                    <svg
                      className="icon-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="empty-state-title">
                      All clear! Development is fully aligned with PRD.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <svg
                className="icon-document"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="empty-state-title">
                No compliance data available
              </p>
              <p className="empty-state-subtitle">
                Run an AI compliance check to see results
              </p>
            </div>
          )}
        </div>

        {/* Additional PO Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3 className="metric-label">PRD Completion</h3>
            <p className="metric-value">78%</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Backlog Health</h3>
            <p className="metric-value success">Good</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-label">Sprint Velocity</h3>
            <p className="metric-value">42</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOwnerDashboard;
