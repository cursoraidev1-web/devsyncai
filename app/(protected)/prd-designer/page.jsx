'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  CheckCircle,
  Users,
  Clock,
  MessageSquare,
  Download
} from 'lucide-react';
import { fetchPRDs, createPRD as apiCreatePRD, updatePRD as apiUpdatePRD, deletePRD as apiDeletePRD, approvePRD as apiApprovePRD } from '../../../api/prds';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import PulsingLoader from '../../../components/PulsingLoader';
import '../../../styles/pages/PRDDesigner.css';

const PRDDesigner = () => {
  const { projects } = useApp();
  const { user } = useAuth();
  const [prds, setPrds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrd, setSelectedPrd] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewPrdModal, setShowNewPrdModal] = useState(false);

  useEffect(() => {
    const loadPRDs = async () => {
      try {
        const data = await fetchPRDs();
        setPrds(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load PRDs:', error);
        toast.error('Failed to load PRDs');
        setPrds([]);
      } finally {
        setLoading(false);
      }
    };
    loadPRDs();
  }, []);

  const [newPrd, setNewPrd] = useState({
    title: '',
    project_id: projects?.[0]?.id || '',
    version: '1.0',
    sections: []
  });

  const handleCreatePrd = async () => {
    if (!newPrd.title) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!newPrd.project_id) {
      toast.error('Please select a project');
      return;
    }
    
    try {
      const prdData = {
        project_id: newPrd.project_id,
        title: newPrd.title,
        version: parseFloat(newPrd.version) || 1,
        sections: [
          { title: 'Overview', content: '' },
          { title: 'Goals & Objectives', content: '' },
          { title: 'Features & Requirements', content: '' },
          { title: 'Technical Specifications', content: '' },
          { title: 'Success Metrics', content: '' }
        ]
      };
      
      const prd = await apiCreatePRD(prdData);
      setPrds([prd, ...prds]);
      setSelectedPrd(prd);
      setShowNewPrdModal(false);
      setNewPrd({ title: '', project_id: projects?.[0]?.id || '', version: '1.0', sections: [] });
      setIsEditing(true);
      toast.success('PRD created successfully');
    } catch (error) {
      console.error('Failed to create PRD:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to create PRD';
      toast.error(errorMessage);
    }
  };

  const handleUpdatePrd = async () => {
    if (!selectedPrd) return;
    
    try {
      const updated = await apiUpdatePRD(selectedPrd.id, {
        title: selectedPrd.title,
        sections: selectedPrd.sections
      });
      setPrds(prds.map(prd => prd.id === selectedPrd.id ? updated : prd));
      setSelectedPrd(updated);
      setIsEditing(false);
      toast.success('PRD updated successfully');
    } catch (error) {
      console.error('Failed to update PRD:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update PRD';
      toast.error(errorMessage);
    }
  };

  const handleExportPRD = () => {
    if (!selectedPrd) return;
    
    try {
      // Create markdown content
      let markdown = `# ${selectedPrd.title}\n\n`;
      markdown += `**Version:** ${selectedPrd.version}\n`;
      markdown += `**Status:** ${selectedPrd.status}\n`;
      markdown += `**Author:** ${selectedPrd.author}\n`;
      markdown += `**Last Updated:** ${selectedPrd.lastUpdated}\n\n`;
      markdown += `---\n\n`;
      
      // Add sections
      if (selectedPrd.sections && selectedPrd.sections.length > 0) {
        selectedPrd.sections.forEach(section => {
          markdown += `## ${section.title}\n\n`;
          markdown += `${section.content || '_No content_'}\n\n`;
        });
      }
      
      // Create blob and download
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedPrd.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_v${selectedPrd.version}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('PRD exported successfully');
    } catch (error) {
      console.error('Failed to export PRD:', error);
      toast.error('Failed to export PRD');
    }
  };

  const handleDeletePrd = async (id) => {
    try {
      await apiDeletePRD(id);
      setPrds(prds.filter(prd => prd.id !== id));
      if (selectedPrd?.id === id) {
        setSelectedPrd(null);
      }
      toast.success('PRD deleted successfully');
    } catch (error) {
      console.error('Failed to delete PRD:', error);
      toast.error('Failed to delete PRD');
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiApprovePRD(id);
      setPrds(prds.map(prd => prd.id === id ? { ...prd, status: 'approved' } : prd));
      if (selectedPrd?.id === id) {
        setSelectedPrd({ ...selectedPrd, status: 'approved' });
      }
      toast.success('PRD approved successfully');
    } catch (error) {
      console.error('Failed to approve PRD:', error);
      toast.error('Failed to approve PRD');
    }
  };

  if (loading) {
    return (
      <div className="prd-designer">
        <div className="prd-header">
          <div>
            <h1>PRD Designer</h1>
            <p className="page-subtitle">Collaborative workspace for product requirements</p>
          </div>
        </div>
        <PulsingLoader message="Loading PRDs..." />
      </div>
    );
  }

  return (
    <div className="prd-designer">
      <div className="prd-header">
        <div>
          <h1>PRD Designer</h1>
          <p className="page-subtitle">Collaborative workspace for product requirements</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewPrdModal(true)}>
          <Plus size={18} />
          New PRD
        </button>
      </div>

      <div className="prd-container">
        {/* PRD List Sidebar */}
        <div className="prd-sidebar">
          <div className="prd-sidebar-header">
            <h2>All PRDs</h2>
            <span className="prd-count">{prds.length}</span>
          </div>
          {prds.length > 0 ? (
            <div className="prd-list">
              {prds.map(prd => (
                <div
                  key={prd.id}
                  className={`prd-list-item ${selectedPrd?.id === prd.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPrd(prd);
                    setIsEditing(false);
                  }}
                >
                  <div className="prd-list-icon">
                    <FileText size={20} />
                  </div>
                  <div className="prd-list-content">
                    <div className="prd-list-title">{prd.title}</div>
                    <div className="prd-list-meta">
                      <span className={`badge badge-${
                        prd.status === 'approved' ? 'success' : 
                        prd.status === 'in-review' ? 'warning' : 
                        'secondary'
                      }`}>
                        {prd.status}
                      </span>
                      <span className="prd-list-date">v{prd.version}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#718096' }}>
              <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ marginBottom: '16px' }}>No PRDs yet</p>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowNewPrdModal(true)}
                style={{ fontSize: '14px', padding: '8px 16px' }}
              >
                <Plus size={16} />
                Create Your First PRD
              </button>
            </div>
          )}
        </div>

        {/* PRD Content */}
        <div className="prd-content">
          {selectedPrd ? (
            <>
              <div className="prd-content-header">
                <div className="prd-title-section">
                  <h1>{selectedPrd.title}</h1>
                  <div className="prd-meta-info">
                    <span className={`badge badge-${
                      selectedPrd.status === 'approved' ? 'success' : 
                      selectedPrd.status === 'in-review' ? 'warning' : 
                      'secondary'
                    }`}>
                      {selectedPrd.status}
                    </span>
                    <span className="prd-version">Version {selectedPrd.version}</span>
                  </div>
                </div>
                <div className="prd-actions">
                  {!isEditing ? (
                    <>
                      <button className="btn btn-outline" onClick={handleExportPRD}>
                        <Download size={18} />
                        Export
                      </button>
                      <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                        <Edit2 size={18} />
                        Edit
                      </button>
                      {selectedPrd.status !== 'approved' && user?.role === 'admin' && (
                        <button 
                          className="btn btn-success" 
                          onClick={() => handleApprove(selectedPrd.id)}
                        >
                          <CheckCircle size={18} />
                          Approve
                        </button>
                      )}
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDeletePrd(selectedPrd.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary" onClick={handleUpdatePrd}>
                        <Save size={18} />
                        Save Changes
                      </button>
                      <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="prd-info-bar">
                <div className="prd-info-item">
                  <Users size={16} />
                  <span>Author: {selectedPrd.author || 'Unknown'}</span>
                </div>
                <div className="prd-info-item">
                  <Clock size={16} />
                  <span>Last updated: {selectedPrd.lastUpdated || 'Unknown'}</span>
                </div>
                {selectedPrd.projectName && (
                  <div className="prd-info-item">
                    <FileText size={16} />
                    <span>Project: {selectedPrd.projectName}</span>
                  </div>
                )}
              </div>

              <div className="prd-sections">
                {selectedPrd.sections && selectedPrd.sections.length > 0 ? (
                  selectedPrd.sections.map((section, index) => (
                    <div key={section.id || `section-${index}`} className="prd-section">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                              const updatedSections = selectedPrd.sections.map((s, i) =>
                                (s.id === section.id || i === index) ? { ...s, title: e.target.value } : s
                              );
                              setSelectedPrd({ ...selectedPrd, sections: updatedSections });
                            }}
                            className="section-title-input"
                            placeholder="Section title"
                          />
                          <textarea
                            value={section.content || ''}
                            onChange={(e) => {
                              const updatedSections = selectedPrd.sections.map((s, i) =>
                                (s.id === section.id || i === index) ? { ...s, content: e.target.value } : s
                              );
                              setSelectedPrd({ ...selectedPrd, sections: updatedSections });
                            }}
                            rows={6}
                            placeholder={`Enter ${section.title?.toLowerCase() || 'section'} details...`}
                          />
                        </>
                      ) : (
                        <>
                          <h2>{section.title}</h2>
                          <div className="section-content">
                            {section.content ? (
                              <div style={{ whiteSpace: 'pre-wrap' }}>{section.content}</div>
                            ) : (
                              <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                                No {section.title?.toLowerCase() || 'content'} details yet.
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="prd-section">
                    <p style={{ color: '#9ca3af' }}>No sections available. Start editing to add content.</p>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="prd-section">
                  <button className="btn btn-outline">
                    <Plus size={18} />
                    Add Section
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="prd-empty-state">
              <FileText size={64} />
              <h2>No PRD Selected</h2>
              <p>Select a PRD from the list or create a new one to get started</p>
              <button className="btn btn-primary" onClick={() => setShowNewPrdModal(true)}>
                <Plus size={18} />
                Create New PRD
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New PRD Modal */}
      {showNewPrdModal && (
        <div className="modal-overlay" onClick={() => setShowNewPrdModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New PRD</h2>
            <div className="input-group">
              <label htmlFor="prd-title">PRD Title</label>
              <input
                id="prd-title"
                type="text"
                placeholder="E.g., Mobile App Redesign v2.0"
                value={newPrd.title}
                onChange={(e) => setNewPrd({ ...newPrd, title: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label htmlFor="prd-project">Project *</label>
              <select
                id="prd-project"
                value={newPrd.project_id}
                onChange={(e) => setNewPrd({ ...newPrd, project_id: e.target.value })}
                required
              >
                <option value="">Select a project</option>
                {projects && projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name || project.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="prd-version">Version</label>
              <input
                id="prd-version"
                type="text"
                placeholder="1.0"
                value={newPrd.version}
                onChange={(e) => setNewPrd({ ...newPrd, version: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowNewPrdModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreatePrd}>
                <Plus size={18} />
                Create PRD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PRDDesigner;
