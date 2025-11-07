/**
 * Documentation Store Page
 * Feature 2: Centralized Documentation Store with AI search
 */

import React, { useState } from 'react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'link' | 'image' | 'doc';
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  size?: string;
}

const Documentation: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Competitor Analysis Q4 2025',
      type: 'pdf',
      category: 'Research',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2025-11-03',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'Figma Design System',
      type: 'link',
      category: 'Design',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2025-11-05',
    },
    {
      id: '3',
      name: 'API Documentation v2.0',
      type: 'doc',
      category: 'Technical',
      uploadedBy: 'Sarah Chen',
      uploadedAt: '2025-11-06',
      size: '1.1 MB',
    },
    {
      id: '4',
      name: 'User Research Findings',
      type: 'pdf',
      category: 'Research',
      uploadedBy: 'John Doe',
      uploadedAt: '2025-11-01',
      size: '5.7 MB',
    },
    {
      id: '5',
      name: 'AWS Architecture Diagram',
      type: 'image',
      category: 'Infrastructure',
      uploadedBy: 'Alex Kumar',
      uploadedAt: '2025-11-04',
      size: '890 KB',
    },
    {
      id: '6',
      name: 'Security Compliance Guide',
      type: 'pdf',
      category: 'Security',
      uploadedBy: 'Emily Davis',
      uploadedAt: '2025-10-28',
      size: '3.2 MB',
    },
  ]);

  const categories = ['All', 'Research', 'Design', 'Technical', 'Infrastructure', 'Security'];

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Documentation Store</h1>
          <p className="page-subtitle">
            Centralized repository for all project documents and external references
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-4">
          <div className="flex justify-between align-center mb-3">
            <div className="header-search" style={{ marginBottom: 0 }}>
              <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="AI-powered search: Ask anything..."
                style={{ width: '400px' }}
              />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary">
                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Document
              </button>
              <button className="btn btn-outline">
                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Add Link
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`btn btn-sm ${category === 'All' ? 'btn-primary' : 'btn-outline'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-between align-center mb-3">
          <p style={{ color: 'var(--color-gray-600)' }}>
            Showing {documents.length} documents
          </p>
          <div className="flex gap-1">
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>

        {/* Documents Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-3">
            {documents.map((doc) => (
              <div key={doc.id} className="card">
                <div className="flex align-center justify-center" style={{ height: '120px', backgroundColor: 'var(--color-gray-100)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)' }}>
                  <svg style={{ width: '3rem', height: '3rem', color: 'var(--color-gray-400)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {doc.type === 'pdf' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    )}
                    {doc.type === 'link' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    )}
                    {doc.type === 'image' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    )}
                  </svg>
                </div>
                <h4 style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>{doc.name}</h4>
                <div className="flex gap-1 mb-2">
                  <span className="badge badge-info">{doc.category}</span>
                  {doc.size && <span className="badge badge-outline">{doc.size}</span>}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>
                  By {doc.uploadedBy} • {doc.uploadedAt}
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="btn btn-sm btn-primary" style={{ flex: 1 }}>Open</button>
                  <button className="btn btn-sm btn-outline">⋯</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Documents List View */
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Uploaded By</th>
                    <th>Date</th>
                    <th>Size</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="flex align-center gap-2">
                          <svg style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-gray-400)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {doc.name}
                        </div>
                      </td>
                      <td><span className="badge badge-info">{doc.category}</span></td>
                      <td>{doc.uploadedBy}</td>
                      <td>{doc.uploadedAt}</td>
                      <td>{doc.size || '-'}</td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-sm btn-primary">Open</button>
                          <button className="btn btn-sm btn-outline">Share</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Summary Panel */}
        <div className="card mt-4">
          <h3 className="card-title mb-3">
            <svg style={{ width: '1.5rem', height: '1.5rem', display: 'inline', marginRight: 'var(--spacing-sm)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Document Insights
          </h3>
          <div className="alert alert-info">
            <p><strong>Quick Summary:</strong> Your documentation library contains 6 documents across 5 categories. Most recent uploads focus on technical architecture and security compliance.</p>
            <p style={{ marginTop: 'var(--spacing-sm)' }}><strong>Recommendation:</strong> Consider organizing API documentation into a dedicated folder structure for better discoverability.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
