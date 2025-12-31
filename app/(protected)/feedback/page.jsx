'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React, { useState } from 'react';
import { Send, MessageSquare, Star, Bug, Lightbulb, AlertCircle } from 'lucide-react';
import { submitFeedback } from '../../../api/feedback';
import { toast } from 'react-toastify';
import '../../styles/pages/Feedback.css';

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

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback', icon: MessageSquare },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'issue', label: 'Issue Report', icon: AlertCircle }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || formData.rating === 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    
    try {
      await submitFeedback(formData);
      setSubmitted(true);
      toast.success('Feedback submitted successfully!');
      
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
      </div>

      {submitted ? (
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
              <label className="feedback-label">How would you rate your experience? *</label>
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

