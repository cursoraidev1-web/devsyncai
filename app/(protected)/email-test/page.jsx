'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { sendTestEmail, getEmailUsage } from '../../../api/email';
import { handleApiError } from '../../../utils/errorHandler';
import logger from '../../../utils/logger';
import { Mail, Send, Loader, FileText, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import '../../../styles/pages/EmailTest.css';

const EmailTest = () => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    html: '',
  });
  const [loading, setLoading] = useState(false);
  const [emailUsage, setEmailUsage] = useState({
    currentUsage: 0,
    maxLimit: 15,
    remaining: 15,
    planType: 'free',
    planName: 'Free',
    isUnlimited: false,
  });
  const [loadingUsage, setLoadingUsage] = useState(false);

  useEffect(() => {
    loadEmailUsage();
  }, []);

  const loadEmailUsage = async () => {
    setLoadingUsage(true);
    try {
      const response = await getEmailUsage();
      if (response.data) {
        setEmailUsage(response.data);
      }
    } catch (error) {
      logger.error('Failed to load email usage:', error);
    } finally {
      setLoadingUsage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.to || !formData.subject || !formData.html) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        to: formData.to,
        subject: formData.subject,
        html: formData.html,
      };

      await sendTestEmail(payload);
      toast.success('Test email sent successfully!');
      
      // Reload usage after sending
      await loadEmailUsage();
      
      // Reset form
      setFormData({
        to: '',
        subject: '',
        html: '',
      });
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast.error(errorInfo.message || 'Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-test-container">
      <div className="email-test-header">
        <div className="email-test-header-content">
          <div className="email-test-icon">
            <Mail size={24} />
          </div>
          <div>
            <h1 className="email-test-title">Team Email Tool</h1>
            <p className="email-test-subtitle">
              Send emails within your team with tier-based limits
            </p>
          </div>
        </div>
        <div className="email-usage-card">
          {loadingUsage ? (
            <Loader size={16} className="spinner" />
          ) : (
            <>
              <div className="email-usage-info">
                <div className="email-usage-plan">
                  <span className={`plan-badge plan-badge-${emailUsage.planType}`}>
                    {emailUsage.planName} Plan
                  </span>
                </div>
                <div className="email-usage-stats">
                  {emailUsage.isUnlimited ? (
                    <div className="usage-unlimited">
                      <CheckCircle size={16} />
                      <span>Unlimited emails</span>
                    </div>
                  ) : (
                    <>
                      <div className="usage-progress">
                        <div className="usage-text">
                          <span className="usage-current">{emailUsage.currentUsage}</span>
                          <span className="usage-separator">/</span>
                          <span className="usage-max">{emailUsage.maxLimit}</span>
                          <span className="usage-label">emails today</span>
                        </div>
                        <div className="usage-bar-container">
                          <div 
                            className={`usage-bar ${
                              emailUsage.remaining === 0 ? 'error' : 
                              emailUsage.remaining <= 3 ? 'warning' : 'success'
                            }`}
                            style={{ 
                              width: `${Math.min(100, (emailUsage.currentUsage / emailUsage.maxLimit) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="usage-remaining">
                        {emailUsage.remaining === 0 ? (
                          <div className="usage-warning">
                            <AlertCircle size={16} />
                            <span>Limit reached</span>
                          </div>
                        ) : (
                          <div className="usage-success">
                            <TrendingUp size={16} />
                            <span>{emailUsage.remaining} remaining</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="email-test-content">
        <div className="email-test-card">
          <div className="email-test-card-header">
            <h2>Send Test Email</h2>
            <p>Send a test email to verify your email configuration</p>
          </div>

          <form onSubmit={handleSubmit} className="email-test-form">
            <div className="email-test-form-group">
              <label htmlFor="to">
                Recipient Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="recipient@example.com"
                required
                className="email-test-input"
              />
            </div>

            <div className="email-test-form-group">
              <label htmlFor="subject">
                Subject <span className="required">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Test Email Subject"
                required
                className="email-test-input"
              />
            </div>

            <div className="email-test-form-group">
              <label htmlFor="html">
                Email Content (HTML) <span className="required">*</span>
              </label>
              <textarea
                id="html"
                name="html"
                value={formData.html}
                onChange={handleChange}
                placeholder="<h1>Hello</h1><p>This is a test email.</p>"
                rows={10}
                required
                className="email-test-textarea"
              />
              <small className="email-test-hint">
                Enter HTML content for your email. You can use HTML tags for formatting.
              </small>
            </div>

            <button
              type="submit"
              disabled={loading || (!emailUsage.isUnlimited && emailUsage.remaining === 0)}
              className="email-test-submit-btn"
            >
              {loading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Test Email
                </>
              )}
            </button>
          </form>
        </div>

        <div className="email-test-info-card">
          <div className="email-test-info-header">
            <FileText size={20} />
            <h3>Email Testing Guide</h3>
          </div>
          <div className="email-test-info-content">
            <h4>How to Send Emails</h4>
            <ul>
              <li>Enter a valid email address where you want to send the email</li>
              <li>Choose a subject line for your email</li>
              <li>Write your email content in HTML format</li>
              <li>Click "Send Test Email" to send</li>
            </ul>

            <h4>Plan Limits</h4>
            <ul>
              <li><strong>Free Plan:</strong> 15 emails per day</li>
              <li><strong>Pro Plan:</strong> 100 emails per day</li>
              <li><strong>Enterprise Plan:</strong> Custom limits (unlimited by default)</li>
            </ul>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              Limits reset daily at midnight UTC. Upgrade your plan to send more emails.
            </p>

            <h4>HTML Content</h4>
            <p>
              Write your email content using HTML. You can use standard HTML tags
              like &lt;h1&gt;, &lt;p&gt;, &lt;a&gt;, &lt;div&gt;, etc. for formatting.
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
              Example: <code>&lt;h1&gt;Hello&lt;/h1&gt;&lt;p&gt;This is a test email.&lt;/p&gt;</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTest;



