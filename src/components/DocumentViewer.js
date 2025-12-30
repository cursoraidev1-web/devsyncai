import React, { useState, useEffect } from 'react';
import { getDocument, getDownloadUrl } from '../api/documents';
import { formatFileSize, getFileTypeInfo } from '../utils/fileUpload';
import { Download, X, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import PulsingLoader from './PulsingLoader';
import './DocumentViewer.css';

const DocumentViewer = ({ documentId, onClose }) => {
  const [document, setDocument] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const doc = await getDocument(documentId);
      setDocument(doc);

      // Get download URL
      const url = await getDownloadUrl(documentId);
      setDownloadUrl(url);
    } catch (err) {
      console.error('Failed to load document:', err);
      setError(err?.message || 'Failed to load document');
      toast.error('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document || !downloadUrl) return;
    
    setDownloading(true);
    try {
      // Create temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = document.title || document.name || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download document');
    } finally {
      setDownloading(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="document-viewer-overlay" onClick={onClose}>
        <div className="document-viewer-container" onClick={(e) => e.stopPropagation()}>
          <div className="document-viewer-loading">
            <PulsingLoader size={32} />
            <p>Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="document-viewer-overlay" onClick={onClose}>
        <div className="document-viewer-container" onClick={(e) => e.stopPropagation()}>
          <div className="document-viewer-error">
            <h3>Error</h3>
            <p>{error || 'Document not found'}</p>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fileInfo = getFileTypeInfo(document.file_type);
  const isImage = document.file_type?.startsWith('image/');
  const isPdf = document.file_type === 'application/pdf';

  return (
    <div className="document-viewer-overlay" onClick={onClose}>
      <div className="document-viewer-container" onClick={(e) => e.stopPropagation()}>
        <div className="document-viewer-header">
          <div className="document-viewer-title-section">
            <div className="document-viewer-icon" style={{ color: fileInfo.color }}>
              <span style={{ fontSize: '32px' }}>{fileInfo.icon}</span>
            </div>
            <div>
              <h2>{document.title || document.name}</h2>
              <div className="document-viewer-meta">
                <span>{formatFileSize(document.file_size || 0)}</span>
                <span>•</span>
                <span>{document.file_type || 'Unknown type'}</span>
                {document.created_at && (
                  <>
                    <span>•</span>
                    <span>Uploaded {new Date(document.created_at).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="document-viewer-actions">
            <button
              className="btn btn-outline"
              onClick={handleOpenInNewTab}
              disabled={!downloadUrl}
            >
              <ExternalLink size={16} />
              Open in New Tab
            </button>
            <button
              className="btn btn-primary"
              onClick={handleDownload}
              disabled={!downloadUrl || downloading}
            >
              {downloading ? (
                <>
                  <PulsingLoader size={16} />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download
                </>
              )}
            </button>
            {onClose && (
              <button className="btn btn-ghost" onClick={onClose}>
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="document-viewer-content">
          {isImage && downloadUrl ? (
            <div className="document-viewer-image">
              <img src={downloadUrl} alt={document.title || document.name} />
            </div>
          ) : isPdf && downloadUrl ? (
            <div className="document-viewer-pdf">
              <iframe
                src={downloadUrl}
                title={document.title || document.name}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              />
            </div>
          ) : (
            <div className="document-viewer-preview">
              <div className="document-preview-icon" style={{ color: fileInfo.color }}>
                <span style={{ fontSize: '64px' }}>{fileInfo.icon}</span>
              </div>
              <p>Preview not available for this file type</p>
              <p className="preview-hint">Click "Download" or "Open in New Tab" to view</p>
            </div>
          )}
        </div>

        {document.tags && document.tags.length > 0 && (
          <div className="document-viewer-footer">
            <div className="document-viewer-tags">
              <strong>Tags:</strong>
              {document.tags.map((tag, index) => (
                <span key={index} className="badge badge-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;

