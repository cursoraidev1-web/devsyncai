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
   * Determine score color based on compliance level
   */
  const getScoreColor = (score: number | null): string => {
    if (score === null) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  /**
   * Determine background color for score badge
   */
  const getScoreBgColor = (score: number | null): string => {
    if (score === null) return 'bg-gray-100';
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Product Owner Dashboard
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Owner Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor PRD compliance and track development alignment
          </p>
        </div>

        {/* Main Compliance Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              AI PRD Compliance Status
            </h2>
            {complianceData?.lastChecked && (
              <span className="text-sm text-gray-500">
                Last checked: {new Date(complianceData.lastChecked).toLocaleString()}
              </span>
            )}
          </div>

          {complianceData ? (
            <>
              {/* Compliance Score Display */}
              <div className="flex items-center justify-center mb-8">
                <div
                  className={`${getScoreBgColor(
                    score
                  )} rounded-full w-40 h-40 flex flex-col items-center justify-center`}
                >
                  <span
                    className={`text-5xl font-bold ${getScoreColor(score)}`}
                  >
                    {score}
                  </span>
                  <span className="text-sm font-medium text-gray-600 mt-2">
                    Compliance Score
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Latest Commit</p>
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {complianceData.latestCommitId}
                  </p>
                </div>
                {complianceData.prdVersion && (
                  <div>
                    <p className="text-sm text-gray-600">PRD Version</p>
                    <p className="font-medium text-gray-900">
                      {complianceData.prdVersion}
                    </p>
                  </div>
                )}
              </div>

              {/* Recommendations Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Pending Recommendations
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      recommendations.length === 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {recommendations.length} issue{recommendations.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                            <span className="text-yellow-700 font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {rec.section}
                            </h4>
                            <p className="text-gray-700 text-sm">{rec.fix}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-green-500 mb-4"
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
                    <p className="text-gray-600 font-medium">
                      All clear! Development is fully aligned with PRD.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
              <p className="text-gray-600 font-medium mb-2">
                No compliance data available
              </p>
              <p className="text-gray-500 text-sm">
                Run an AI compliance check to see results
              </p>
            </div>
          )}
        </div>

        {/* Additional PO Metrics (Placeholder) */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              PRD Completion
            </h3>
            <p className="text-3xl font-bold text-gray-900">78%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Backlog Health
            </h3>
            <p className="text-3xl font-bold text-green-600">Good</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Sprint Velocity
            </h3>
            <p className="text-3xl font-bold text-gray-900">42</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOwnerDashboard;
