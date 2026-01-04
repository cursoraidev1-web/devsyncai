'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Star, Bug, Lightbulb, AlertCircle, List, CheckCircle, Clock, XCircle } from 'lucide-react';
import { submitFeedback, fetchFeedback } from '../../../api/feedback';
import { toast } from 'react-toastify';
import '../../../styles/pages/Feedback.css';

const Feedback = () => {
  const [formData, setFormData] = useState({
    type: 'general',
    rating: 0,
    title: '',
    description: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showList, setShowList] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageSquare },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'issue', label: 'Issue Report', icon: AlertCircle }
  ];

  const loadFeedbackList = async () => {
    setLoadingList(true);
    try {
      const data = await fetchFeedback();
      setFeedbackList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load feedback list:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (showList) {
      loadFeedbackList();
    }
  }, [showList]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle size={16} className="status-icon resolved" />;
      case 'reviewed':
        return <Clock size={16} className="status-icon reviewed" />;
      case 'pending':
        return <Clock size={16} className="status-icon pending" />;
      default:
        return <Clock size={16} className="status-icon" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Pending',
      'reviewed': 'Reviewed',
      'resolved': 'Resolved',
      'closed': 'Closed'
    };
    return labels[status] || status;
  };

  const getTypeIcon = (type) => {
    const typeMap = feedbackTypes.find(t => t.value === type);
    return typeMap ? typeMap.icon : MessageSquare;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in title and description');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Only send rating if it's set
      const payload = {
        ...formData,
        rating: formData.rating > 0 ? formData.rating : undefined
      };
      await submitFeedback(payload);
      setSubmitted(true);
      toast.success('Feedback submitted successfully!');
      
      // Reload feedback list
      loadFeedbackList();
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          type: 'general',
          rating: 0,
          title: '',
          description: '',
          email: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <div>
          <h1>Feedback</h1>
          <p className="feedback-subtitle">We'd love to hear from you! Share your thoughts, report bugs, or suggest new features.</p>
        </div>
        <button 
          className="feedback-list-btn"
          onClick={() => setShowList(!showList)}
        >
          <List size={18} />
          {showList ? 'Hide' : 'View'} My Feedback
        </button>
      </div>

      {showList ? (
        <div className="feedback-list-section">
          <h2>My Feedback</h2>
          {loadingList ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Loading feedback...</p>
            </div>
          ) : feedbackList.length > 0 ? (
            <div className="feedback-list">
              {feedbackList.map(feedback => {
                const TypeIcon = getTypeIcon(feedback.type);
                return (
                  <div key={feedback.id} className="feedback-item">
                    <div className="feedback-item-header">
                      <div className="feedback-item-type">
                        <TypeIcon size={18} />
                        <span className="feedback-type-label">{feedback.type}</span>
                      </div>
                      <div className="feedback-item-status">
                        {getStatusIcon(feedback.status)}
                        <span>{getStatusLabel(feedback.status)}</span>
                      </div>
                    </div>
                    <h3 className="feedback-item-title">{feedback.title}</h3>
                    <p className="feedback-item-description">{feedback.description}</p>
                    <div className="feedback-item-footer">
                      {feedback.rating && (
                        <div className="feedback-item-rating">
                          {[1, 2, 3, 4, 5].map(r => (
                            <Star 
                              key={r} 
                              size={14} 
                              fill={r <= feedback.rating ? '#F59E0B' : 'none'}
                              style={{ color: r <= feedback.rating ? '#F59E0B' : '#D1D5DB' }}
                            />
                          ))}
                        </div>
                      )}
                      <div className="feedback-item-date">
                        {new Date(feedback.createdAt || feedback.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="feedback-empty">
              <MessageSquare size={48} style={{ color: '#9CA3AF', marginBottom: '16px' }} />
              <h3>No feedback submitted yet</h3>
              <p>Submit your first feedback to see it here.</p>
            </div>
          )}
        </div>
      ) : submitted ? (
        <div className="feedback-success">
          <div className="success-icon">✓</div>
          <h2>Thank you for your feedback!</h2>
          <p>We've received your submission and will review it shortly.</p>
        </div>
      ) : (
        <div className="feedback-content">
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="feedback-section">
              <label className="feedback-label">Feedback Type *</label>
              <div className="feedback-type-grid">
                {feedbackTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <label
                      key={type.value}
                      className={`feedback-type-option ${formData.type === type.value ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleChange}
                      />
                      <Icon size={20} />
                      <span>{type.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="feedback-section">
              <label className="feedback-label">How would you rate your experience? (Optional)</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    className={`rating-star ${formData.rating >= rating ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, rating })}
                  >
                    <Star size={24} fill={formData.rating >= rating ? '#F59E0B' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="feedback-section">
              <label htmlFor="feedback-title" className="feedback-label">Title *</label>
              <input
                type="text"
                id="feedback-title"
                name="title"
                placeholder="Brief summary of your feedback..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="feedback-section">
              <label htmlFor="feedback-description" className="feedback-label">Description *</label>
              <textarea
                id="feedback-description"
                name="description"
                placeholder="Tell us more about your feedback, bug report, or feature request..."
                rows={8}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="feedback-section">
              <label htmlFor="feedback-email" className="feedback-label">Email (Optional)</label>
              <input
                type="email"
                id="feedback-email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <p className="feedback-help-text">We'll use this to follow up if needed.</p>
            </div>

            <div className="feedback-actions">
              <button type="submit" className="feedback-submit-btn" disabled={submitting}>
                <Send size={18} />
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Feedback;

