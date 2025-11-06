/**
 * Product Owner Dashboard Component
 * Displays PRD Compliance Score and AI-generated recommendations
 * Feature Focus: AI PRD Compliance Agent (Feature 3)
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { selectComplianceData } from '../../redux/complianceSlice';

const ProductOwnerDashboard: React.FC = () => {
  const complianceData = useSelector(selectComplianceData);

  // Determine score color based on compliance level
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Determine background color based on compliance level
  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Owner Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor PRD compliance and track product development alignment</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI PRD Compliance Card - Primary Focus */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-lg shadow-lg border-2 p-6 ${complianceData ? getScoreBgColor(complianceData.score) : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">AI PRD Compliance Score</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  AI Powered
                </span>
              </div>

              {complianceData ? (
                <>
                  {/* Compliance Score Display */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className={`text-6xl font-bold ${getScoreColor(complianceData.score)}`}>
                        {complianceData.score}
                      </span>
                      <span className="text-2xl text-gray-500 ml-2">/100</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            complianceData.score >= 80
                              ? 'bg-green-600'
                              : complianceData.score >= 60
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${complianceData.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Commit Info */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Latest Commit Analyzed:</p>
                    <p className="text-sm font-mono font-semibold text-gray-800 mt-1">
                      {complianceData.latestCommitId}
                    </p>
                  </div>

                  {/* Recommendations Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">Pending Recommendations</h3>
                      <span className={`text-2xl font-bold ${
                        complianceData.recommendations.length === 0
                          ? 'text-green-600'
                          : complianceData.recommendations.length < 5
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {complianceData.recommendations.length}
                      </span>
                    </div>
                    {complianceData.recommendations.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        AI has identified areas requiring attention to maintain PRD alignment
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No compliance data available</p>
                  <p className="text-gray-400 text-sm mt-2">AI analysis will appear here once commits are detected</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations Detail Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Recommendations</h3>
              
              {complianceData && complianceData.recommendations.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {complianceData.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <p className="text-sm font-semibold text-gray-700 mb-1">{rec.section}</p>
                      <p className="text-xs text-gray-600">{rec.fix}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">All Clear!</p>
                  <p className="text-gray-400 text-xs mt-1">No recommendations at this time</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Additional Dashboard Sections */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* PRD Completion Rate */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">PRD Completion Rate</h3>
            <p className="text-3xl font-bold text-gray-900">Coming Soon</p>
          </div>

          {/* Backlog Health */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Backlog Health</h3>
            <p className="text-3xl font-bold text-gray-900">Coming Soon</p>
          </div>

          {/* Sprint Velocity */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Sprint Velocity</h3>
            <p className="text-3xl font-bold text-gray-900">Coming Soon</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductOwnerDashboard;
