/**
 * Mock Data for Testing DevSync AI Dashboard
 * Use this to populate the store with sample compliance data
 */

import { ComplianceData } from '../types/compliance';

export const mockComplianceData: {
  excellent: ComplianceData;
  good: ComplianceData;
  needsWork: ComplianceData;
  critical: ComplianceData;
} = {
  excellent: {
    score: 95,
    latestCommitId: 'f8e3a21',
    recommendations: [],
    timestamp: new Date().toISOString(),
    deviations: [],
  },
  
  good: {
    score: 78,
    latestCommitId: 'b4c2d91',
    recommendations: [
      {
        section: 'User Dashboard - Analytics Widget',
        fix: 'Add missing real-time metrics display as specified in PRD Section 4.2'
      },
      {
        section: 'API Integration',
        fix: 'Update REST endpoint naming convention to match PRD standards'
      }
    ],
    timestamp: new Date().toISOString(),
    deviations: ['Analytics Widget incomplete', 'API naming mismatch'],
  },
  
  needsWork: {
    score: 62,
    latestCommitId: 'c7d9e45',
    recommendations: [
      {
        section: 'Authentication Module',
        fix: 'Implement OAuth2 flow as per PRD Section 3.2 - currently using basic auth only'
      },
      {
        section: 'User Dashboard',
        fix: 'Add missing role-based access controls defined in PRD Section 5.1'
      },
      {
        section: 'Data Export Feature',
        fix: 'CSV export functionality missing - required by PRD Section 6.3'
      },
      {
        section: 'Error Handling',
        fix: 'Global error boundary not implemented per PRD Section 7.4'
      }
    ],
    timestamp: new Date().toISOString(),
    deviations: [
      'OAuth2 not implemented',
      'RBAC incomplete',
      'Export feature missing',
      'Error handling inadequate'
    ],
  },
  
  critical: {
    score: 38,
    latestCommitId: 'a1b2c3d',
    recommendations: [
      {
        section: 'Authentication Module',
        fix: 'Critical: Implement OAuth2 + JWT as per PRD Section 3.2'
      },
      {
        section: 'User Dashboard',
        fix: 'Critical: Add all 8 required widgets from PRD Section 4'
      },
      {
        section: 'Database Schema',
        fix: 'Urgent: Align with PRD-specified schema - missing 4 core tables'
      },
      {
        section: 'API Endpoints',
        fix: 'Major: Implement RESTful standards per PRD Section 8'
      },
      {
        section: 'Security',
        fix: 'Critical: Add encryption for sensitive data (PRD Section 9.1)'
      },
      {
        section: 'Testing',
        fix: 'Missing: Unit tests coverage <40%, PRD requires 80% minimum'
      },
      {
        section: 'Documentation',
        fix: 'API documentation incomplete - PRD requires OpenAPI specs'
      }
    ],
    timestamp: new Date().toISOString(),
    deviations: [
      'Authentication incomplete',
      'Dashboard features missing',
      'Schema misalignment',
      'API non-compliant',
      'Security vulnerabilities',
      'Insufficient test coverage',
      'Documentation gaps'
    ],
  }
};

/**
 * Helper function to get compliance data by score range
 */
export const getComplianceByScore = (score: number): ComplianceData => {
  if (score >= 85) return mockComplianceData.excellent;
  if (score >= 70) return mockComplianceData.good;
  if (score >= 50) return mockComplianceData.needsWork;
  return mockComplianceData.critical;
};

/**
 * Helper to simulate compliance data update
 * Use this in development to test different states
 */
export const simulateComplianceUpdate = (store: any, type: keyof typeof mockComplianceData) => {
  const data = mockComplianceData[type];
  store.dispatch({
    type: 'compliance/setComplianceData',
    payload: {
      ...data,
      timestamp: new Date().toISOString(),
    }
  });
  console.log(`✅ Loaded ${type} compliance data:`, data);
};
