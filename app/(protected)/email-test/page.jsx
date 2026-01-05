'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { sendTestEmail, getEmailTemplates } from '../../../api/email';
import { handleApiError } from '../../../utils/errorHandler';
import { Mail, Send, Loader, FileText } from 'lucide-react';
import '../../../styles/pages/EmailTest.css';

const EmailTest = () => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    html: '',
    template: '',
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const response = await getEmailTemplates();
      setTemplates(response.data?.templates || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      template: templateId,
      html: '', // Clear custom HTML when template is selected
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.to || !formData.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!useTemplate && !formData.html) {
      toast.error('Please provide email content or select a template');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        to: formData.to,
        subject: formData.subject,
      };

      if (useTemplate && formData.template) {
        payload.template = formData.template;
      } else if (formData.html) {
        payload.html = formData.html;
      }

      await sendTestEmail(payload);
      toast.success('Test email sent successfully!');
      
      // Reset form
      setFormData({
        to: '',
        subject: '',
        html: '',
        template: '',
      });
      setUseTemplate(false);
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
            <h1 className="email-test-title">Email Testing</h1>
            <p className="email-test-subtitle">
              Test and verify email delivery from your Zyndrx workspace
            </p>
          </div>
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
              <div className="email-test-toggle">
                <label className="email-test-switch">
                  <input
                    type="checkbox"
                    checked={useTemplate}
                    onChange={(e) => setUseTemplate(e.target.checked)}
                  />
                  <span className="email-test-slider"></span>
                </label>
                <span>Use Email Template</span>
              </div>
            </div>

            {useTemplate ? (
              <div className="email-test-form-group">
                <label htmlFor="template">Select Template</label>
                {loadingTemplates ? (
                  <div className="email-test-loading">Loading templates...</div>
                ) : (
                  <select
                    id="template"
                    name="template"
                    value={formData.template}
                    onChange={handleTemplateChange}
                    className="email-test-select"
                  >
                    <option value="">Select a template...</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} - {template.description}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
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
                  required={!useTemplate}
                  className="email-test-textarea"
                />
                <small className="email-test-hint">
                  Enter HTML content for your email. You can use HTML tags for formatting.
                </small>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
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
            <h4>How to Test Emails</h4>
            <ul>
              <li>Enter a valid email address where you want to receive the test email</li>
              <li>Choose a subject line for your test email</li>
              <li>Either use a predefined template or write custom HTML content</li>
              <li>Click "Send Test Email" to send</li>
            </ul>

            <h4>Email Templates</h4>
            <ul>
              <li><strong>Welcome Email:</strong> Template for welcoming new users</li>
              <li><strong>Notification Email:</strong> General notification template</li>
              <li><strong>Invitation Email:</strong> Template for team invitations</li>
            </ul>

            <h4>Custom HTML</h4>
            <p>
              You can write custom HTML content for your test email. Use standard HTML tags
              like &lt;h1&gt;, &lt;p&gt;, &lt;a&gt;, etc. for formatting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTest;

