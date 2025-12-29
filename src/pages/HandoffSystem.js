import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, ArrowRightLeft, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './HandoffSystem.css';

const HandoffSystem = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // TODO: Load handoffs from API when available
  const handoffs = [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="status-icon completed" />;
      case 'in-review':
        return <AlertCircle size={16} className="status-icon in-review" />;
      case 'pending':
        return <Clock size={16} className="status-icon pending" />;
      default:
        return <Clock size={16} className="status-icon" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'in-review': 'In Review',
      'completed': 'Completed'
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': '#EF4444',
      'medium': '#F59E0B',
      'low': '#10B981'
    };
    return colors[priority] || '#718096';
  };

  const filteredHandoffs = handoffs.filter(handoff => {
    const matchesSearch = handoff.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         handoff.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || handoff.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="handoff-system-page">
      <div className="handoff-header">
        <div>
          <h1>Handoff System</h1>
          <p className="handoff-subtitle">Manage handoffs between teams and track their progress.</p>
        </div>
        <button className="handoff-new-btn">
          <Plus size={18} />
          New Handoff
        </button>
      </div>

      <div className="handoff-controls">
        <div className="handoff-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search handoffs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="handoff-filters">
          <button
            className={`handoff-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`handoff-filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`handoff-filter-btn ${filter === 'in-review' ? 'active' : ''}`}
            onClick={() => setFilter('in-review')}
          >
            In Review
          </button>
          <button
            className={`handoff-filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {handoffs.length > 0 ? (
        <div className="handoff-list">
          {filteredHandoffs.map(handoff => (
            <div
              key={handoff.id}
              className="handoff-card"
              onClick={() => navigate(`/handoffs/${handoff.id}`)}
            >
              <div className="handoff-card-header">
                <div className="handoff-title-section">
                  <div className="handoff-icon">
                    <ArrowRightLeft size={20} />
                  </div>
                  <div>
                    <h3 className="handoff-title">{handoff.title}</h3>
                    <div className="handoff-meta">
                      <span className="handoff-from">
                        <User size={14} />
                        {handoff.from}
                      </span>
                      <span className="handoff-arrow">→</span>
                      <span className="handoff-to">
                        <User size={14} />
                        {handoff.to}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="handoff-status-section">
                  <div className="handoff-status">
                    {getStatusIcon(handoff.status)}
                    <span>{getStatusLabel(handoff.status)}</span>
                  </div>
                  <div
                    className="handoff-priority"
                    style={{ color: getPriorityColor(handoff.priority) }}
                  >
                    {handoff.priority.toUpperCase()}
                  </div>
                </div>
              </div>
              <p className="handoff-description">{handoff.description}</p>
              <div className="handoff-card-footer">
                <div className="handoff-dates">
                  <span className="handoff-date">
                    <Clock size={14} />
                    Created {handoff.createdAt}
                  </span>
                  <span className="handoff-date">
                    Due: {handoff.dueDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="handoff-empty">
          <ArrowRightLeft size={48} style={{ color: '#718096', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No handoffs yet</h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>Create your first handoff to transfer work between team members</p>
          <button className="handoff-new-btn" onClick={() => {/* TODO: Open create handoff modal */}}>
            <Plus size={18} />
            Create Handoff
          </button>
        </div>
      )}

      {handoffs.length > 0 && filteredHandoffs.length === 0 && (
        <div className="handoff-empty">
          <ArrowRightLeft size={48} style={{ color: '#718096', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>No handoffs found</h3>
          <p style={{ color: '#718096' }}>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default HandoffSystem;

