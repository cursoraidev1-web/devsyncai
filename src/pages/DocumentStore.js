import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  FolderOpen,
  File,
  Image,
  FileCode,
  Plus,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PulsingLoader from '../components/PulsingLoader';
import { CardSkeleton } from '../components/SkeletonLoader';
import './DocumentStore.css';

const DocumentStore = () => {
  const { documents, loadDocuments, createDocument, projects } = useApp();
  const navigate = useNavigate();
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    file_type: 'application/pdf',
    file_url: '',
    file_size: 0,
    project_id: projects?.[0]?.id || ''
  });

  useEffect(() => {
    const projectId = projects?.[0]?.id;
    if (projectId) {
      loadDocuments(projectId).catch(console.error);
    }
  }, [projects, loadDocuments]);

  const documentTypes = [
    { id: 'prd', label: 'PRD', icon: FileText, color: '#4f46e5' },
    { id: 'documentation', label: 'Documentation', icon: FileCode, color: '#10b981' },
    { id: 'design', label: 'Design', icon: Image, color: '#f59e0b' },
    { id: 'other', label: 'Other', icon: File, color: '#6b7280' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const docName = doc.name || doc.title || '';
    const docType = doc.type || doc.file_type || '';
    const matchesSearch = docName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || docType === filterType;
    return matchesSearch && matchesType;
  });

  const handleUpload = async () => {
    if (!newDocument.title || !newDocument.project_id) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createDocument(newDocument);
      setShowUploadModal(false);
      setNewDocument({
        title: '',
        file_type: 'application/pdf',
        file_url: '',
        file_size: 0,
        project_id: projects?.[0]?.id || ''
      });
    } catch (error) {
      console.error('Failed to create document:', error);
      alert('Failed to upload document. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    // Note: Delete endpoint may not be available in the API
    // For now, this is a placeholder - implement when delete endpoint is available
    if (window.confirm('Are you sure you want to delete this document?')) {
      // Optimistic update - remove from local state
      // In production, call API delete endpoint here
      console.warn('Document delete not yet implemented in API');
    }
  };

  const getDocumentIcon = (type) => {
    const docType = documentTypes.find(t => t.id === type);
    return docType || documentTypes[documentTypes.length - 1];
  };

  return (
    <div className="document-store">
      <div className="documents-header">
        <div>
          <h1>Documentation Store</h1>
          <p className="page-subtitle">Centralized repository for all project files</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/documents/editor')}>
            <Plus size={18} />
            New Documentation
          </button>
          <button className="btn btn-secondary" onClick={() => setShowUploadModal(true)}>
            <Upload size={18} />
            Upload Document
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="documents-controls">
        <div className="documents-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="documents-filters">
          <div className="filter-group">
            <Filter size={18} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              {documentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="documents-stats">
        {documentTypes.map(type => {
          const count = documents.filter(d => d.type === type.id).length;
          return (
            <div key={type.id} className="stat-item">
              <div className="stat-icon" style={{ backgroundColor: `${type.color}15`, color: type.color }}>
                <type.icon size={20} />
              </div>
              <div className="stat-details">
                <div className="stat-count">{count}</div>
                <div className="stat-label">{type.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Documents Grid View */}
      {view === 'grid' && (
        <div className="documents-grid">
          {filteredDocuments.map(doc => {
            const docIcon = getDocumentIcon(doc.type);
            return (
              <div key={doc.id} className="document-card-grid">
                <div className="document-card-icon" style={{ backgroundColor: `${docIcon.color}15`, color: docIcon.color }}>
                  <docIcon.icon size={32} />
                </div>
                <div className="document-card-content">
                  <h3>{doc.name}</h3>
                  <div className="document-card-meta">
                    <span className="document-size">{doc.size}</span>
                    <span className="document-date">{doc.uploadedAt}</span>
                  </div>
                  <div className="document-card-tags">
                    {doc.tags.map((tag, idx) => (
                      <span key={idx} className="badge badge-secondary">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="document-card-actions">
                  <button className="action-btn" title="Download">
                    <Download size={16} />
                  </button>
                  <button className="action-btn danger" onClick={() => handleDelete(doc.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Documents List View */}
      {view === 'list' && (
        <div className="documents-list-view">
          <div className="documents-list-header">
            <div className="list-col col-name">Name</div>
            <div className="list-col col-type">Type</div>
            <div className="list-col col-size">Size</div>
            <div className="list-col col-uploaded">Uploaded</div>
            <div className="list-col col-tags">Tags</div>
            <div className="list-col col-actions">Actions</div>
          </div>
          <div className="documents-list-body">
            {filteredDocuments.map(doc => {
              const docIcon = getDocumentIcon(doc.type);
              return (
                <div key={doc.id} className="document-list-item">
                  <div className="list-col col-name">
                    <div className="document-name-cell">
                      <div className="document-list-icon" style={{ backgroundColor: `${docIcon.color}15`, color: docIcon.color }}>
                        <docIcon.icon size={20} />
                      </div>
                      <div>
                        <div className="document-list-title">{doc.name}</div>
                        <div className="document-list-uploader">By {doc.uploadedBy}</div>
                      </div>
                    </div>
                  </div>
                  <div className="list-col col-type">
                    <span className="badge badge-primary">{doc.type}</span>
                  </div>
                  <div className="list-col col-size">{doc.size}</div>
                  <div className="list-col col-uploaded">{doc.uploadedAt}</div>
                  <div className="list-col col-tags">
                    <div className="document-tags-cell">
                      {doc.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="badge badge-secondary">{tag}</span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="badge badge-secondary">+{doc.tags.length - 2}</span>
                      )}
                    </div>
                  </div>
                  <div className="list-col col-actions">
                    <div className="document-list-actions">
                      <button className="action-btn" title="Download">
                        <Download size={16} />
                      </button>
                      <button className="action-btn danger" onClick={() => handleDelete(doc.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="empty-state">
          <FolderOpen size={64} />
          <h2>No Documents Found</h2>
          <p>Upload your first document to get started</p>
          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
            <Upload size={18} />
            Upload Document
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Upload Document</h2>
            
            <div className="upload-area">
              <Upload size={48} />
              <p>Drag & drop files here or click to browse</p>
              <button className="btn btn-outline">Choose Files</button>
            </div>

            <div className="input-group">
              <label htmlFor="doc-name">Document Name</label>
              <input
                id="doc-name"
                type="text"
                placeholder="E.g., API Documentation v2.0"
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label htmlFor="doc-type">Document Type</label>
              <select
                id="doc-type"
                value={newDocument.type}
                onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
              >
                {documentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="doc-tags">Tags (comma-separated)</label>
              <input
                id="doc-tags"
                type="text"
                placeholder="E.g., technical, api, backend"
                value={newDocument.tags}
                onChange={(e) => setNewDocument({ ...newDocument, tags: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpload}>
                <Upload size={18} />
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentStore;
