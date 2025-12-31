'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
;
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
import { getHandoff, getHandoffComments, addHandoffComment, approveHandoff, rejectHandoff } from '../../../api/handoffs';
import { Modal } from '../../../components/ui';
import { toast } from 'react-toastify';
import PulsingLoader from '../../../components/PulsingLoader';
import '../../../styles/pages/HandoffDetails.css';

const HandoffDetails = () => {
  const params = useParams(); const id = params.id;
  const router = useRouter();
  const [handoff, setHandoff] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const loadHandoffData = async () => {
      if (!id) {
        setError('Invalid handoff ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [handoffData, commentsData] = await Promise.all([
          getHandoff(id),
          getHandoffComments(id)
        ]);
        setHandoff(handoffData);
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (err) {
        console.error('Failed to load handoff:', err);
        setError(err?.response?.data?.error || err?.message || 'Failed to load handoff');
        toast.error('Failed to load handoff details');
      } finally {
        setLoading(false);
      }
    };

    loadHandoffData();
  }, [id]);

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
    setReviewComment('');
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    if (reviewStatus === 'rejected' && !reviewComment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setSubmitting(true);
    try {
      if (reviewStatus === 'approved') {
        await approveHandoff(id, reviewComment);
        toast.success('Handoff approved successfully!');
      } else {
        await rejectHandoff(id, reviewComment);
        toast.success('Handoff rejected');
      }
      setShowReviewModal(false);
      // Reload handoff to get updated status
      const updatedHandoff = await getHandoff(id);
      setHandoff(updatedHandoff);
      router.push('/handoffs');
    } catch (error) {
      console.error('Failed to review handoff:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to review handoff';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      const comment = await addHandoffComment(id, newComment);
      setComments(prev => [...prev, comment]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Failed to add comment:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to add comment';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="handoff-details-page">
        <div className="handoff-details-header">
          <button className="back-btn" onClick={() => router.push('/handoffs')}>
            <ArrowLeft size={18} />
            Back to Handoffs
          </button>
        </div>
        <PulsingLoader message="Loading handoff details..." />
      </div>
    );
  }

  if (error || !handoff) {
    return (
      <div className="handoff-details-page">
        <div className="handoff-details-header">
          <button className="back-btn" onClick={() => router.push('/handoffs')}>
            <ArrowLeft size={18} />
            Back to Handoffs
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <ArrowRightLeft size={48} style={{ color: '#718096', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#1A1F36' }}>Handoff not found</h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>
            {error ? String(error) : 'The handoff you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <button className="btn btn-primary" onClick={() => router.push('/handoffs')}>
            Go to Handoffs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="handoff-details-page">
      <div className="handoff-details-header">
        <button className="back-btn" onClick={() => router.push('/handoffs')}>
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
              <div className="participant-avatar">
                {handoff.from_user?.name?.[0]?.toUpperCase() || handoff.from?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="participant-info">
                <div className="participant-label">From</div>
                <div className="participant-name">
                  {handoff.from_user?.name || handoff.from?.name || handoff.from_user_id || 'Unknown'}
                </div>
                <div className="participant-role">
                  {handoff.from_user?.role || handoff.from?.role || ''}
                </div>
                <div className="participant-email">
                  {handoff.from_user?.email || handoff.from?.email || ''}
                </div>
              </div>
            </div>
            <div className="participant-arrow">→</div>
            <div className="participant-card">
              <div className="participant-avatar">
                {handoff.to_user?.name?.[0]?.toUpperCase() || handoff.to?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="participant-info">
                <div className="participant-label">To</div>
                <div className="participant-name">
                  {handoff.to_user?.name || handoff.to?.name || handoff.to_user_id || 'Unknown'}
                </div>
                <div className="participant-role">
                  {handoff.to_user?.role || handoff.to?.role || ''}
                </div>
                <div className="participant-email">
                  {handoff.to_user?.email || handoff.to?.email || ''}
                </div>
              </div>
            </div>
          </div>

          <div className="handoff-description-section">
            <h2>Description</h2>
            <p>{handoff.description}</p>
          </div>

          {handoff.tags && handoff.tags.length > 0 && (
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
          )}

          {handoff.attachments && handoff.attachments.length > 0 && (
            <div className="handoff-attachments-section">
              <h2>Attachments</h2>
              <div className="attachments-list">
                {handoff.attachments.map(attachment => (
                  <div key={attachment.id || attachment.name} className="attachment-item">
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
          )}

          <div className="handoff-comments-section">
            <h2>Comments</h2>
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      {comment.user?.name?.[0]?.toUpperCase() || comment.author?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.user?.name || comment.author || 'Unknown'}
                        </span>
                        <span className="comment-time">
                          {formatDate(comment.created_at || comment.timestamp || comment.createdAt)}
                        </span>
                      </div>
                      <div className="comment-text">{comment.comment || comment.text || comment.content}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#718096', fontStyle: 'italic' }}>No comments yet</p>
              )}
            </div>
            <div className="comment-input">
              <textarea
                placeholder="Add a comment..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="comment-submit-btn" onClick={handleAddComment}>
                Post Comment
              </button>
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
                <div className="detail-value">
                  {formatDate(handoff.created_at || handoff.createdAt)}
                </div>
              </div>
            </div>
            {handoff.due_date || handoff.dueDate ? (
              <div className="detail-item">
                <Clock size={16} />
                <div>
                  <div className="detail-label">Due Date</div>
                  <div className="detail-value">
                    {formatDate(handoff.due_date || handoff.dueDate)}
                  </div>
                </div>
              </div>
            ) : null}
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
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              className={`modal-btn-${reviewStatus === 'approved' ? 'primary' : 'danger'}`}
              onClick={handleReviewSubmit}
              disabled={submitting}
            >
              {submitting ? 'Processing...' : `${reviewStatus === 'approved' ? 'Approve' : 'Reject'} Handoff`}
            </button>
          </>
        }
      >
        <div className="review-modal-content">
          {(reviewStatus === 'approved' || reviewStatus === 'rejected') && (
            <div className="form-group">
              <label htmlFor="review-comment">
                {reviewStatus === 'rejected' ? 'Reason for Rejection *' : 'Comment (optional)'}
              </label>
              <textarea
                id="review-comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={
                  reviewStatus === 'rejected'
                    ? 'Please explain why this handoff is being rejected...'
                    : 'Add any additional comments...'
                }
                rows={4}
                required={reviewStatus === 'rejected'}
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
              <span>{handoff.from_user?.name || handoff.from?.name || 'Unknown'}</span>
            </div>
            <div className="review-summary-item">
              <span>To:</span>
              <span>{handoff.to_user?.name || handoff.to?.name || 'Unknown'}</span>
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

