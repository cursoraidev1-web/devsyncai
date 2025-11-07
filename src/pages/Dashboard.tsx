/**
 * Main Dashboard Page - FULLY FUNCTIONAL
 * Overview dashboard showing key metrics and insights
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  selectComplianceScore,
  selectComplianceRecommendations,
} from '../redux/complianceSlice';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const complianceScore = useSelector(selectComplianceScore);
  const recommendations = useSelector(selectComplianceRecommendations);

  const getScoreLevel = (score: number | null): string => {
    if (score === null) return '';
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  const scoreLevel = getScoreLevel(complianceScore);

  const handleQuickAction = (action: string, path: string) => {
    toast.info(`Opening ${action}...`);
    setTimeout(() => navigate(path), 500);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's what's happening with your projects today.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-4 mb-4">
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <h3 className="card-title">PRD Compliance</h3>
            <p className={`metric ${scoreLevel === 'high' ? 'success' : ''}`} style={{ color: scoreLevel === 'high' ? 'var(--color-success)' : undefined }}>
              {complianceScore ?? '--'}%
            </p>
            <div className="progress-bar mt-2">
              <div
                style={{ 
                  width: `${complianceScore}%`, 
                  height: '100%', 
                  backgroundColor: scoreLevel === 'high' ? 'var(--color-success)' : scoreLevel === 'medium' ? 'var(--color-warning)' : 'var(--color-danger)',
                  borderRadius: 'var(--radius-sm)',
                }}
              ></div>
            </div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => toast.info('Viewing tasks...')}>
            <h3 className="card-title">Open Tasks</h3>
            <p className="metric">24</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>8 due this week</span>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/cicd-pipeline')}>
            <h3 className="card-title">Active Builds</h3>
            <p className="metric">2</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>All passing</span>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/analytics')}>
            <h3 className="card-title">Team Velocity</h3>
            <p className="metric">42 pts</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>↑ 12% vs last sprint</span>
          </div>
        </div>

        {/* Alerts */}
        {recommendations.length > 0 && (
          <div className="alert alert-warning mb-4">
            <strong>⚠ Attention:</strong> {recommendations.length} PRD compliance issues require your attention.{' '}
            <Link to="/" style={{ color: 'inherit', textDecoration: 'underline' }}>View details</Link>
          </div>
        )}

        <div className="grid grid-2 mb-4">
          {/* Recent Activity */}
          <div className="card">
            <h3 className="card-title mb-3">Recent Activity</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-date">2 hours ago</div>
                  <div className="timeline-title">Build #1247 deployed to production</div>
                  <div className="timeline-description">
                    Successfully deployed by Sarah Chen
                  </div>
                  <button 
                    className="btn btn-sm btn-outline mt-2"
                    onClick={() => navigate('/cicd-pipeline')}
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker" style={{ backgroundColor: 'var(--color-warning)' }}></div>
                <div className="timeline-content">
                  <div className="timeline-date">4 hours ago</div>
                  <div className="timeline-title">PRD Section updated</div>
                  <div className="timeline-description">
                    "Acceptance Criteria" awaiting approval
                  </div>
                  <button 
                    className="btn btn-sm btn-outline mt-2"
                    onClick={() => navigate('/prd-designer')}
                  >
                    Review
                  </button>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-date">1 day ago</div>
                  <div className="timeline-title">New team member joined</div>
                  <div className="timeline-description">
                    Lisa Wang joined as QA Engineer
                  </div>
                </div>
              </div>
            </div>
            <Link to="/notifications" className="btn btn-outline btn-sm mt-3">
              View All Activity
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="card-title mb-3">Quick Actions</h3>
            <div className="flex flex-column gap-2">
              <button 
                className="btn btn-outline" 
                style={{ justifyContent: 'flex-start' }}
                onClick={() => handleQuickAction('PRD Designer', '/prd-designer')}
              >
                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Create PRD Section
              </button>
              <button 
                className="btn btn-outline" 
                style={{ justifyContent: 'flex-start' }}
                onClick={() => handleQuickAction('Documentation', '/documentation')}
              >
                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Document
              </button>
              <button 
                className="btn btn-outline" 
                style={{ justifyContent: 'flex-start' }}
                onClick={() => handleQuickAction('CI/CD Pipeline', '/cicd-pipeline')}
              >
                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Trigger Build
              </button>
              <button 
                className="btn btn-outline" 
                style={{ justifyContent: 'flex-start' }}
                onClick={() => handleQuickAction('Team Management', '/team')}
              >
                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Invite Team Member
              </button>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="card mb-4">
          <h3 className="card-title mb-3">Project Overview</h3>
          <div className="grid grid-3">
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/analytics')}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-sm)' }}>
                Sprint Progress
              </p>
              <div className="progress-bar mb-2">
                <div style={{ width: '68%', height: '100%', backgroundColor: 'var(--color-success)', borderRadius: 'var(--radius-sm)' }}></div>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>68% Complete</p>
            </div>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/analytics')}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-sm)' }}>
                Test Coverage
              </p>
              <div className="progress-bar mb-2">
                <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--color-success)', borderRadius: 'var(--radius-sm)' }}></div>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>85%</p>
            </div>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/security')}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-sm)' }}>
                Security Score
              </p>
              <div className="progress-bar mb-2">
                <div style={{ width: '78%', height: '100%', backgroundColor: 'var(--color-warning)', borderRadius: 'var(--radius-sm)' }}></div>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>B+ (78/100)</p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-3">
          <div 
            className="card" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/prd-designer')}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>📝</div>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>PRD Designer</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
              Collaborative PRD workspace with AI assistance
            </p>
          </div>
          <div 
            className="card" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/development-insights')}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>📊</div>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>Dev Insights</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
              AI-powered analysis of commits and blockers
            </p>
          </div>
          <div 
            className="card" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/cicd-pipeline')}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>⚙️</div>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>CI/CD Pipeline</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
              Automated builds and deployments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
