import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  CheckCircle,
  Users,
  Clock,
  MessageSquare
} from 'lucide-react';
import './PRDDesigner.css';

const PRDDesigner = () => {
  const [prds, setPrds] = useState([
    {
      id: 1,
      title: 'E-Commerce Platform v2.0',
      status: 'approved',
      version: '2.0',
      author: 'Product Manager',
      lastUpdated: '2025-11-20',
      assignees: ['Dev Team', 'QA Team'],
      sections: [
        { id: 1, title: 'Overview', content: 'Complete redesign of the e-commerce platform...' },
        { id: 2, title: 'Goals', content: 'Improve user experience, increase conversion rate...' },
        { id: 3, title: 'Features', content: 'New checkout flow, product recommendations...' }
      ]
    },
    {
      id: 2,
      title: 'Mobile App Authentication',
      status: 'in-review',
      version: '1.0',
      author: 'Product Owner',
      lastUpdated: '2025-11-23',
      assignees: ['Mobile Team'],
      sections: [
        { id: 1, title: 'Overview', content: 'Implement secure authentication for mobile app...' }
      ]
    }
  ]);

  const [selectedPrd, setSelectedPrd] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewPrdModal, setShowNewPrdModal] = useState(false);

  const [newPrd, setNewPrd] = useState({
    title: '',
    version: '1.0',
    sections: []
  });

  const handleCreatePrd = () => {
    if (newPrd.title) {
      const prd = {
        id: Date.now(),
        ...newPrd,
        status: 'draft',
        author: 'Current User',
        lastUpdated: new Date().toISOString().split('T')[0],
        assignees: [],
        sections: [
          { id: 1, title: 'Overview', content: '' },
          { id: 2, title: 'Goals & Objectives', content: '' },
          { id: 3, title: 'Features & Requirements', content: '' },
          { id: 4, title: 'Technical Specifications', content: '' },
          { id: 5, title: 'Success Metrics', content: '' }
        ]
      };
      setPrds([...prds, prd]);
      setSelectedPrd(prd);
      setShowNewPrdModal(false);
      setNewPrd({ title: '', version: '1.0', sections: [] });
      setIsEditing(true);
    }
  };

  const handleUpdatePrd = () => {
    setPrds(prds.map(prd => prd.id === selectedPrd.id ? selectedPrd : prd));
    setIsEditing(false);
  };

  const handleDeletePrd = (id) => {
    setPrds(prds.filter(prd => prd.id !== id));
    if (selectedPrd?.id === id) {
      setSelectedPrd(null);
    }
  };

  const handleApprove = (id) => {
    setPrds(prds.map(prd => prd.id === id ? { ...prd, status: 'approved' } : prd));
    if (selectedPrd?.id === id) {
      setSelectedPrd({ ...selectedPrd, status: 'approved' });
    }
  };

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
                      <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                        <Edit2 size={18} />
                        Edit
                      </button>
                      {selectedPrd.status !== 'approved' && (
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
                  <span>Author: {selectedPrd.author}</span>
                </div>
                <div className="prd-info-item">
                  <Clock size={16} />
                  <span>Last updated: {selectedPrd.lastUpdated}</span>
                </div>
                <div className="prd-info-item">
                  <MessageSquare size={16} />
                  <span>{selectedPrd.assignees.length} assignees</span>
                </div>
              </div>

              <div className="prd-sections">
                {selectedPrd.sections.map(section => (
                  <div key={section.id} className="prd-section">
                    <h2>{section.title}</h2>
                    {isEditing ? (
                      <textarea
                        value={section.content}
                        onChange={(e) => {
                          const updatedSections = selectedPrd.sections.map(s =>
                            s.id === section.id ? { ...s, content: e.target.value } : s
                          );
                          setSelectedPrd({ ...selectedPrd, sections: updatedSections });
                        }}
                        rows={6}
                        placeholder={`Enter ${section.title.toLowerCase()} details...`}
                      />
                    ) : (
                      <p>{section.content || `No ${section.title.toLowerCase()} details yet.`}</p>
                    )}
                  </div>
                ))}
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
