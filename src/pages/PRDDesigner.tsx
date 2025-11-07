/**
 * PRD Designer Page
 * Feature 1: Built-in PRD Designer for collaborative product requirements
 */

import React, { useState } from 'react';

interface PRDSection {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'review' | 'approved';
  lastUpdated: string;
}

const PRDDesigner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [sections] = useState<PRDSection[]>([
    {
      id: '1',
      title: 'Product Overview',
      content: 'DevSync AI is an intelligent project management and development coordination platform...',
      status: 'approved',
      lastUpdated: '2025-11-05',
    },
    {
      id: '2',
      title: 'Target Users',
      content: 'Product Manager, Product Owner, Designers, Developers, DevOps, QA, Security Engineers...',
      status: 'approved',
      lastUpdated: '2025-11-04',
    },
    {
      id: '3',
      title: 'Core Features',
      content: '1. Built-in PRD Designer\n2. Centralized Documentation Store\n3. AI PRD Compliance Agent...',
      status: 'review',
      lastUpdated: '2025-11-06',
    },
    {
      id: '4',
      title: 'Acceptance Criteria',
      content: 'Feature must support real-time collaboration, version control, and AI assistance...',
      status: 'draft',
      lastUpdated: '2025-11-07',
    },
  ]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">PRD Designer</h1>
          <p className="page-subtitle">
            Collaborative workspace for drafting and managing product requirements
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between align-center mb-4">
          <div className="flex gap-2">
            <button className="btn btn-primary">
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Section
            </button>
            <button className="btn btn-outline">
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </button>
          </div>
          <button className="btn btn-success">
            <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Request Approval
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </button>
          <button
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Version History
          </button>
          <button
            className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Comments (12)
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-2">
          {/* PRD Sections List */}
          <div className="card">
            <h3 className="card-title mb-3">PRD Sections</h3>
            <div className="flex flex-column gap-2">
              {sections.map((section) => (
                <div key={section.id} className="card" style={{ padding: 'var(--spacing-md)' }}>
                  <div className="flex justify-between align-center mb-2">
                    <h4 style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
                      {section.title}
                    </h4>
                    <span className={`badge badge-${
                      section.status === 'approved' ? 'success' :
                      section.status === 'review' ? 'warning' : 'info'
                    }`}>
                      {section.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-sm)' }}>
                    {section.content.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between align-center">
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                      Updated: {section.lastUpdated}
                    </span>
                    <button className="btn btn-sm btn-outline">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor Area */}
          <div className="card">
            <div className="flex justify-between align-center mb-3">
              <h3 className="card-title">AI-Assisted Editor</h3>
              <button className="btn btn-sm btn-primary">
                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Suggest
              </button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Section Title</label>
              <input type="text" className="form-input" placeholder="Enter section title..." />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-textarea"
                style={{ minHeight: '300px' }}
                placeholder="Write your PRD section here... AI will assist with suggestions."
              />
              <p className="form-help">
                💡 Tip: Press Ctrl+Space for AI-powered completions
              </p>
            </div>

            <div className="alert alert-info">
              <strong>AI Suggestion:</strong> Consider adding acceptance criteria and edge cases to this section for better clarity.
            </div>

            <div className="flex gap-2">
              <button className="btn btn-primary">Save Draft</button>
              <button className="btn btn-outline">Discard Changes</button>
            </div>
          </div>
        </div>

        {/* Related Features */}
        <div className="card mt-4">
          <h3 className="card-title mb-3">Linked Tasks & Features</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Task ID</th>
                  <th>Description</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Compliance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span style={{ fontFamily: 'var(--font-family-mono)' }}>TASK-1234</span></td>
                  <td>Implement user authentication flow</td>
                  <td>Sarah Chen</td>
                  <td><span className="badge badge-warning">In Progress</span></td>
                  <td><span className="badge badge-success">✓ Aligned</span></td>
                </tr>
                <tr>
                  <td><span style={{ fontFamily: 'var(--font-family-mono)' }}>TASK-1235</span></td>
                  <td>Design dashboard UI components</td>
                  <td>Mike Johnson</td>
                  <td><span className="badge badge-success">Completed</span></td>
                  <td><span className="badge badge-success">✓ Aligned</span></td>
                </tr>
                <tr>
                  <td><span style={{ fontFamily: 'var(--font-family-mono)' }}>TASK-1236</span></td>
                  <td>Set up CI/CD pipeline</td>
                  <td>Alex Kumar</td>
                  <td><span className="badge badge-info">Pending</span></td>
                  <td><span className="badge badge-error">⚠ Review Needed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDDesigner;
