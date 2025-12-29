import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  User, 
  FileText, 
  MessageSquare,
  Check,
  X,
  AlertCircle,
  Calendar,
  Tag,
  ArrowRightLeft
} from 'lucide-react';
import { Modal } from '../components/ui';
import './HandoffDetails.css';

const HandoffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');

  // TODO: Load handoff from API when available
  const handoff = null; // Will be loaded from API based on id param

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="status-icon completed" />;
      case 'in-review':
        return <AlertCircle size={20} className="status-icon in-review" />;
      case 'pending':
        return <Clock size={20} className="status-icon pending" />;
      default:
        return <Clock size={20} className="status-icon" />;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReview = (status) => {
    setReviewStatus(status);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = () => {
    // Handle review submission
    alert(`Handoff ${reviewStatus === 'approved' ? 'approved' : 'rejected'} successfully!`);
    setShowReviewModal(false);
    navigate('/handoffs');
  };

  if (!handoff) {
    return (
      <div className="handoff-details-page">
        <div className="handoff-details-header">
          <button className="back-btn" onClick={() => navigate('/handoffs')}>
            <ArrowLeft size={18} />
            Back to Handoffs
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <ArrowRightLeft size={48} style={{ color: '#718096', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>Handoff not found</h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>The handoff you're looking for doesn't exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate('/handoffs')}>
            Go to Handoffs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="handoff-details-page">
      <div className="handoff-details-header">
        <button className="back-btn" onClick={() => navigate('/handoffs')}>
          <ArrowLeft size={18} />
          Back to Handoffs
        </button>
        <div className="handoff-actions">
          {handoff.status === 'in-review' && (
            <>
              <button 
                className="review-btn approve"
                onClick={() => handleReview('approved')}
              >
                <Check size={18} />
                Approve
              </button>
              <button 
                className="review-btn reject"
                onClick={() => handleReview('rejected')}
              >
                <X size={18} />
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      <div className="handoff-details-content">
        <div className="handoff-main">
          <div className="handoff-title-section">
            <h1>{handoff.title}</h1>
            <div className="handoff-meta-badges">
              <div className="handoff-status-badge">
                {getStatusIcon(handoff.status)}
                <span>{getStatusLabel(handoff.status)}</span>
              </div>
              <div 
                className="handoff-priority-badge"
                style={{ color: getPriorityColor(handoff.priority) }}
              >
                {handoff.priority.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="handoff-participants">
            <div className="participant-card">
              <div className="participant-avatar">{handoff.from.avatar}</div>
              <div className="participant-info">
                <div className="participant-label">From</div>
                <div className="participant-name">{handoff.from.name}</div>
                <div className="participant-role">{handoff.from.role}</div>
                <div className="participant-email">{handoff.from.email}</div>
              </div>
            </div>
            <div className="participant-arrow">→</div>
            <div className="participant-card">
              <div className="participant-avatar">{handoff.to.avatar}</div>
              <div className="participant-info">
                <div className="participant-label">To</div>
                <div className="participant-name">{handoff.to.name}</div>
                <div className="participant-role">{handoff.to.role}</div>
                <div className="participant-email">{handoff.to.email}</div>
              </div>
            </div>
          </div>

          <div className="handoff-description-section">
            <h2>Description</h2>
            <p>{handoff.description}</p>
          </div>

          <div className="handoff-tags-section">
            <h2>Tags</h2>
            <div className="handoff-tags">
              {handoff.tags.map((tag, idx) => (
                <span key={idx} className="handoff-tag">
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="handoff-attachments-section">
            <h2>Attachments</h2>
            <div className="attachments-list">
              {handoff.attachments.map(attachment => (
                <div key={attachment.id} className="attachment-item">
                  <FileText size={20} />
                  <div className="attachment-info">
                    <div className="attachment-name">{attachment.name}</div>
                    <div className="attachment-size">{attachment.size}</div>
                  </div>
                  <button className="attachment-download">Download</button>
                </div>
              ))}
            </div>
          </div>

          <div className="handoff-comments-section">
            <h2>Comments</h2>
            <div className="comments-list">
              {handoff.comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">{comment.avatar}</div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-time">{formatDate(comment.timestamp)}</span>
                    </div>
                    <div className="comment-text">{comment.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="comment-input">
              <textarea placeholder="Add a comment..." rows={3} />
              <button className="comment-submit-btn">Post Comment</button>
            </div>
          </div>
        </div>

        <div className="handoff-sidebar">
          <div className="sidebar-section">
            <h3>Details</h3>
            <div className="detail-item">
              <Calendar size={16} />
              <div>
                <div className="detail-label">Created</div>
                <div className="detail-value">{formatDate(handoff.createdAt)}</div>
              </div>
            </div>
            <div className="detail-item">
              <Clock size={16} />
              <div>
                <div className="detail-label">Due Date</div>
                <div className="detail-value">{formatDate(handoff.dueDate)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Handoff Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={reviewStatus === 'approved' ? 'Approve Handoff' : 'Reject Handoff'}
        subtitle={reviewStatus === 'approved' 
          ? 'Confirm that you approve this handoff and it meets all requirements.'
          : 'Please provide a reason for rejecting this handoff.'}
        size="md"
        footer={
          <>
            <button 
              className="modal-btn-cancel"
              onClick={() => setShowReviewModal(false)}
            >
              Cancel
            </button>
            <button 
              className={`modal-btn-${reviewStatus === 'approved' ? 'primary' : 'danger'}`}
              onClick={handleReviewSubmit}
            >
              {reviewStatus === 'approved' ? 'Approve' : 'Reject'} Handoff
            </button>
          </>
        }
      >
        <div className="review-modal-content">
          {reviewStatus === 'rejected' && (
            <div className="form-group">
              <label htmlFor="rejection-reason">Reason for Rejection *</label>
              <textarea
                id="rejection-reason"
                placeholder="Please explain why this handoff is being rejected..."
                rows={4}
                required
              />
            </div>
          )}
          <div className="review-summary">
            <h4>Handoff Summary</h4>
            <div className="review-summary-item">
              <span>Title:</span>
              <span>{handoff.title}</span>
            </div>
            <div className="review-summary-item">
              <span>From:</span>
              <span>{handoff.from.name}</span>
            </div>
            <div className="review-summary-item">
              <span>To:</span>
              <span>{handoff.to.name}</span>
            </div>
            <div className="review-summary-item">
              <span>Priority:</span>
              <span style={{ color: getPriorityColor(handoff.priority) }}>
                {handoff.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HandoffDetails;

