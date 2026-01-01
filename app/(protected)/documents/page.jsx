'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { deleteDocument, getDownloadUrl } from '../../../api/documents';
import { uploadDocumentFile, formatFileSize, getFileTypeInfo, validateFile } from '../../../utils/fileUpload';
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
  Edit,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
;
import { toast } from 'react-toastify';
import { Modal } from '../../../components/ui';
import PulsingLoader from '../../../components/PulsingLoader';
import { CardSkeleton } from '../../../components/SkeletonLoader';
import '../../../styles/pages/DocumentStore.css';

const DocumentStore = () => {
  const { documents, loadDocuments, projects } = useApp();
  const router = useRouter();
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentTags, setDocumentTags] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const fileInputRef = useRef(null);
  const uploadAreaRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

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

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;
    
    // Validate file
    const validation = validateFile(file, {
      maxSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: [] // Backend handles validation
    });
    
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }
    
    setSelectedFile(file);
    // Set default title to filename without extension
    if (!documentTitle) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setDocumentTitle(nameWithoutExt);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!uploading) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragActive to false if we're leaving the upload area itself
    // (not just moving between child elements)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragActive(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Set dragActive on dragover to ensure it stays active
    if (!uploading) {
      setDragActive(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (uploading) {
      toast.error('Please wait for the current upload to complete');
      return;
    }
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    } else {
      toast.error('No file detected. Please try again.');
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    const projectId = projects?.[0]?.id;
    if (!projectId) {
      toast.error('No project selected');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Parse tags from comma-separated string
      const tags = documentTags
        ? documentTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // Simulate progress (Supabase doesn't provide progress events easily)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload document using 3-step flow
      await uploadDocumentFile(
        projectId,
        selectedFile,
        {
          title: documentTitle || selectedFile.name,
          tags: tags
        },
        {
          onProgress: (progress) => {
            setUploadProgress(progress);
          }
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Refresh document list
      await loadDocuments(projectId);

      // Reset form
      setSelectedFile(null);
      setDocumentTitle('');
      setDocumentTags('');
      setShowUploadModal(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success('Document uploaded successfully');
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 1000);
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      const errorMessage = error?.message || 'Failed to upload document. Please try again.';
      toast.error(errorMessage);
      console.error('Upload error:', error);
    }
  };

  // Handle download
  const handleDownload = async (doc) => {
    if (downloadingId === doc.id) return; // Prevent double-click
    
    setDownloadingId(doc.id);
    
    try {
      const downloadUrl = await getDownloadUrl(doc.id);
      
      // Create temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = doc.title || doc.name || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error?.message || 'Failed to download document. Please try again.';
      toast.error(errorMessage);
    } finally {
      setDownloadingId(null);
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDelete = async (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    const projectId = projects?.[0]?.id;
    
    try {
      await deleteDocument(deleteConfirmId);
      toast.success('Document deleted successfully');
      setDeleteConfirmId(null);
      
      // Refresh document list
      if (projectId) {
        await loadDocuments(projectId);
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to delete document';
      toast.error(errorMessage);
      setDeleteConfirmId(null);
    }
  };

  const getDocumentIcon = (doc) => {
    // Use file type info if available, otherwise fall back to document type
    const fileType = doc.file_type || doc.type || '';
    const fileInfo = getFileTypeInfo(fileType);
    
    // Map file type to document type icon for backward compatibility
    const docType = documentTypes.find(t => t.id === doc.type);
    if (docType) {
      return docType;
    }
    
    // Return a default icon based on file type
    return {
      icon: File,
      color: fileInfo.color
    };
  };

  return (
    <div className="document-store">
      <div className="documents-header">
        <div>
          <h1>Documentation Store</h1>
          <p className="page-subtitle">Centralized repository for all project files</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => router.push('/documents/editor')}>
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
                  <h3>{doc.title || doc.name}</h3>
                  <div className="document-card-meta">
                    <span className="document-size">{doc.size || formatFileSize(doc.file_size || 0)}</span>
                    <span className="document-date">{doc.uploadedAt || 'Unknown date'}</span>
                  </div>
                  {doc.uploadedBy && (
                    <div className="document-card-uploader" style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      By {doc.uploadedBy}
                    </div>
                  )}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="document-card-tags">
                      {doc.tags.map((tag, idx) => (
                        <span key={idx} className="badge badge-secondary">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="document-card-actions">
                  <button 
                    className="action-btn" 
                    title="Download"
                    onClick={() => handleDownload(doc)}
                    disabled={downloadingId === doc.id}
                  >
                    {downloadingId === doc.id ? (
                      <PulsingLoader size={16} />
                    ) : (
                      <Download size={16} />
                    )}
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
                        <div className="document-list-title">{doc.title || doc.name}</div>
                        <div className="document-list-uploader">By {doc.uploadedBy || 'Unknown'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="list-col col-type">
                    <span className="badge badge-primary">{doc.type || 'other'}</span>
                  </div>
                  <div className="list-col col-size">{doc.size || formatFileSize(doc.file_size || 0)}</div>
                  <div className="list-col col-uploaded">{doc.uploadedAt || 'Unknown date'}</div>
                  <div className="list-col col-tags">
                    <div className="document-tags-cell">
                      {doc.tags && doc.tags.length > 0 ? (
                        <>
                          {doc.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="badge badge-secondary">{tag}</span>
                          ))}
                          {doc.tags.length > 2 && (
                            <span className="badge badge-secondary">+{doc.tags.length - 2}</span>
                          )}
                        </>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>No tags</span>
                      )}
                    </div>
                  </div>
                  <div className="list-col col-actions">
                    <div className="document-list-actions">
                      <button 
                        className="action-btn" 
                        title="Download"
                        onClick={() => handleDownload(doc)}
                        disabled={downloadingId === doc.id}
                      >
                        {downloadingId === doc.id ? (
                          <PulsingLoader size={16} />
                        ) : (
                          <Download size={16} />
                        )}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Document"
        subtitle="Are you sure you want to delete this document? This action cannot be undone."
        size="md"
        footer={
          <>
            <button
              className="modal-btn-cancel"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </button>
            <button
              className="modal-btn-danger"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </>
        }
      />

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          if (!uploading) {
            setShowUploadModal(false);
            setSelectedFile(null);
            setDocumentTitle('');
            setDocumentTags('');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }
        }}
        title="Upload Document"
        size="lg"
        footer={
          <>
            <button
              className="modal-btn-cancel"
              onClick={() => {
                if (!uploading) {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setDocumentTitle('');
                  setDocumentTags('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }
              }}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              className="modal-btn-primary"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <PulsingLoader size={16} />
                  Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload
                </>
              )}
            </button>
          </>
        }
      >
        <div className="upload-modal-content">
          {/* File Upload Area */}
          <div
            ref={uploadAreaRef}
            className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={(e) => {
              // Only trigger file input if clicking directly on the upload area (not on child elements like buttons)
              if (!uploading && !selectedFile && e.target === e.currentTarget) {
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              disabled={uploading}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.webp,.xls,.xlsx,.csv,.zip,.rar"
            />
            
            {selectedFile ? (
              <div className="selected-file">
                <div className="file-icon">
                  {(() => {
                    const fileInfo = getFileTypeInfo(selectedFile.type);
                    return <span style={{ fontSize: '48px' }}>{fileInfo.icon}</span>;
                  })()}
                </div>
                <div className="file-info">
                  <div className="file-name">{selectedFile.name}</div>
                  <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                </div>
                {!uploading && (
                  <button
                    className="remove-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setDocumentTitle('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ) : (
              <>
                <Upload size={48} />
                <p>Drag & drop files here or click to browse</p>
                <button 
                  className="btn btn-outline" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!uploading) {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      } else {
                        console.error('File input ref is not available');
                        toast.error('File input not available. Please refresh the page.');
                      }
                    }
                  }}
                  type="button"
                >
                  Choose Files
                </button>
              </>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="progress-text">{uploadProgress}%</div>
            </div>
          )}

          {/* Document Title */}
          <div className="input-group">
            <label htmlFor="doc-title">Document Title</label>
            <input
              id="doc-title"
              type="text"
              placeholder="E.g., API Documentation v2.0"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              disabled={uploading}
            />
          </div>

          {/* Document Tags */}
          <div className="input-group">
            <label htmlFor="doc-tags">Tags (comma-separated)</label>
            <input
              id="doc-tags"
              type="text"
              placeholder="E.g., technical, api, backend"
              value={documentTags}
              onChange={(e) => setDocumentTags(e.target.value)}
              disabled={uploading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentStore;
