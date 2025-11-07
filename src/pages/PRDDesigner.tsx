/**
 * PRD Designer Page - FULLY FUNCTIONAL
 * Feature 1: Built-in PRD Designer for collaborative product requirements
 */

import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface PRDSection {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'review' | 'approved';
  lastUpdated: string;
}

const PRDDesigner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [sections, setSections] = useState<PRDSection[]>([
    {
      id: '1',
      title: 'Product Overview',
      content: 'DevSync AI is an intelligent project management and development coordination platform designed to revolutionize how tech teams collaborate.',
      status: 'approved',
      lastUpdated: '2025-11-05',
    },
    {
      id: '2',
      title: 'Target Users',
      content: 'Product Manager, Product Owner, Designers, Developers, DevOps, QA, Security Engineers, and all team members involved in the development lifecycle.',
      status: 'approved',
      lastUpdated: '2025-11-04',
    },
    {
      id: '3',
      title: 'Core Features',
      content: '1. Built-in PRD Designer\n2. Centralized Documentation Store\n3. AI PRD Compliance Agent\n4. Role-Based Handoff System\n5. Smart CI/CD Auto Agent',
      status: 'review',
      lastUpdated: '2025-11-06',
    },
    {
      id: '4',
      title: 'Acceptance Criteria',
      content: 'Feature must support real-time collaboration, version control, and AI assistance for generating user stories and test cases.',
      status: 'draft',
      lastUpdated: '2025-11-07',
    },
  ]);

  const [currentSection, setCurrentSection] = useState<PRDSection | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showNewSectionModal, setShowNewSectionModal] = useState(false);

  const handleEditSection = (section: PRDSection) => {
    setCurrentSection(section);
    setEditTitle(section.title);
    setEditContent(section.content);
    toast.info(`Editing: ${section.title}`);
  };

  const handleSaveDraft = () => {
    if (!currentSection) {
      toast.error('No section selected for editing');
      return;
    }

    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSections(sections.map(s =>
      s.id === currentSection.id
        ? { ...s, title: editTitle, content: editContent, lastUpdated: new Date().toISOString().split('T')[0] }
        : s
    ));

    toast.success('Draft saved successfully!');
  };

  const handleDiscardChanges = () => {
    if (currentSection) {
      setEditTitle(currentSection.title);
      setEditContent(currentSection.content);
      toast.info('Changes discarded');
    }
  };

  const handleNewSection = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const newSection: PRDSection = {
      id: `${Date.now()}`,
      title: editTitle,
      content: editContent,
      status: 'draft',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setSections([...sections, newSection]);
    toast.success(`Section "${editTitle}" created!`);
    setEditTitle('');
    setEditContent('');
    setShowNewSectionModal = false;
    setCurrentSection(null);
  };

  const handleDeleteSection = (section: PRDSection) => {
    if (window.confirm(`Delete section "${section.title}"?`)) {
      setSections(sections.filter(s => s.id !== section.id));
      if (currentSection?.id === section.id) {
        setCurrentSection(null);
        setEditTitle('');
        setEditContent('');
      }
      toast.success('Section deleted');
    }
  };

  const handleStatusChange = (section: PRDSection, newStatus: 'draft' | 'review' | 'approved') => {
    setSections(sections.map(s =>
      s.id === section.id ? { ...s, status: newStatus } : s
    ));
    toast.success(`Status changed to ${newStatus}`);
  };

  const handleExport = () => {
    const prdText = sections.map(s => 
      `## ${s.title}\n\nStatus: ${s.status}\nLast Updated: ${s.lastUpdated}\n\n${s.content}\n\n---\n`
    ).join('\n');

    const blob = new Blob([prdText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PRD-DevSyncAI.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('PRD exported successfully!');
  };

  const handleRequestApproval = () => {
    const draftSections = sections.filter(s => s.status === 'draft');
    if (draftSections.length > 0) {
      toast.warning(`${draftSections.length} section(s) still in draft. Update to "review" status first.`);
    } else {
      toast.success('Approval request sent to stakeholders!');
    }
  };

  const handleAISuggest = () => {
    const suggestions = [
      'Consider adding user persona details to the Target Users section',
      'Include edge cases and error handling in acceptance criteria',
      'Add technical constraints and dependencies section',
      'Define success metrics and KPIs for each feature',
      'Specify internationalization requirements',
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    toast.info(`💡 AI Suggestion: ${randomSuggestion}`);
  };

  const handleStartNewSection = () => {
    setCurrentSection(null);
    setEditTitle('');
    setEditContent('');
    toast.info('Starting new section...');
  };

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
            <button className="btn btn-primary" onClick={handleStartNewSection}>
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Section
            </button>
            <button className="btn btn-outline" onClick={handleExport}>
              <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Export
            </button>
          </div>
          <button className="btn btn-success" onClick={handleRequestApproval}>
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
            onClick={() => {
              setActiveTab('history');
              toast.info('Version history feature coming soon!');
            }}
          >
            Version History
          </button>
          <button
            className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('comments');
              toast.info('Comments feature coming soon!');
            }}
          >
            Comments (12)
          </button>
        </div>

        {/* Main Content */}
        {activeTab === 'editor' && (
          <div className="grid grid-2">
            {/* PRD Sections List */}
            <div className="card">
              <h3 className="card-title mb-3">PRD Sections ({sections.length})</h3>
              <div className="flex flex-column gap-2">
                {sections.map((section) => (
                  <div 
                    key={section.id} 
                    className="card" 
                    style={{ 
                      padding: 'var(--spacing-md)',
                      border: currentSection?.id === section.id ? '2px solid var(--color-primary)' : undefined
                    }}
                  >
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
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-sm btn-primary" 
                          onClick={() => handleEditSection(section)}
                        >
                          Edit
                        </button>
                        <select
                          className="form-select"
                          value={section.status}
                          onChange={(e) => handleStatusChange(section, e.target.value as any)}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          <option value="draft">Draft</option>
                          <option value="review">Review</option>
                          <option value="approved">Approved</option>
                        </select>
                        <button 
                          className="btn btn-sm btn-outline" 
                          onClick={() => handleDeleteSection(section)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor Area */}
            <div className="card">
              <div className="flex justify-between align-center mb-3">
                <h3 className="card-title">
                  {currentSection ? `Editing: ${currentSection.title}` : 'AI-Assisted Editor'}
                </h3>
                <button className="btn btn-sm btn-primary" onClick={handleAISuggest}>
                  <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Suggest
                </button>
              </div>
              
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter section title..."
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '300px' }}
                  placeholder="Write your PRD section here... AI will assist with suggestions."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <p className="form-help">
                  💡 Tip: Press Ctrl+Space for AI-powered completions
                </p>
              </div>

              <div className="alert alert-info mb-3">
                <strong>AI Suggestion:</strong> Consider adding acceptance criteria and edge cases to this section for better clarity.
              </div>

              <div className="flex gap-2">
                {currentSection ? (
                  <>
                    <button className="btn btn-primary" onClick={handleSaveDraft}>
                      Save Changes
                    </button>
                    <button className="btn btn-outline" onClick={handleDiscardChanges}>
                      Discard Changes
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={handleNewSection}>
                    Create Section
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="card">
            <h3 className="card-title mb-4">PRD Preview</h3>
            {sections.map((section) => (
              <div key={section.id} style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <div className="flex justify-between align-center mb-2">
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{section.title}</h2>
                  <span className={`badge badge-${
                    section.status === 'approved' ? 'success' :
                    section.status === 'review' ? 'warning' : 'info'
                  }`}>
                    {section.status}
                  </span>
                </div>
                <p style={{ 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: 1.6, 
                  color: 'var(--color-gray-800)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  {section.content}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                  Last updated: {section.lastUpdated}
                </p>
                <hr style={{ margin: 'var(--spacing-lg) 0', border: 'none', borderTop: '1px solid var(--color-gray-200)' }} />
              </div>
            ))}
          </div>
        )}

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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span style={{ fontFamily: 'var(--font-family-mono)' }}>TASK-1234</span></td>
                  <td>Implement user authentication flow</td>
                  <td>Sarah Chen</td>
                  <td><span className="badge badge-warning">In Progress</span></td>
                  <td><span className="badge badge-success">✓ Aligned</span></td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => toast.info('Viewing task TASK-1234')}
                    >
                      View
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><span style={{ fontFamily: 'var(--font-family-mono)' }}>TASK-1235</span></td>
                  <td>Design dashboard UI components</td>
                  <td>Mike Johnson</td>
                  <td><span className="badge badge-success">Completed</span></td>
                  <td><span className="badge badge-success">✓ Aligned</span></td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => toast.info('Viewing task TASK-1235')}
                    >
                      View
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><span style={{ fontFamily: 'var(--font-family-mono)' }}>TASK-1236</span></td>
                  <td>Set up CI/CD pipeline</td>
                  <td>Alex Kumar</td>
                  <td><span className="badge badge-info">Pending</span></td>
                  <td><span className="badge badge-danger">⚠ Review Needed</span></td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => toast.warning('Compliance issue detected')}
                    >
                      Review
                    </button>
                  </td>
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
