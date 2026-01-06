import { api } from './client';

/**
 * Send a test email
 * @param {Object} data - Email data
 * @param {string} data.to - Recipient email address
 * @param {string} data.subject - Email subject
 * @param {string} [data.html] - HTML content (optional if template is provided)
 * @param {string} [data.template] - Template name: 'welcome', 'notification', or 'invitation'
 * @returns {Promise} API response
 */
export const sendTestEmail = (data) => {
  return api.post('/email/test', data);
};

/**
 * Get available email templates
 * @returns {Promise} API response with templates
 */
export const getEmailTemplates = () => {
  return api.get('/email/templates');
};

/**
 * Get email usage and limits for current company
 * @returns {Promise} API response with usage data
 */
export const getEmailUsage = () => {
  return api.get('/email/usage');
};

