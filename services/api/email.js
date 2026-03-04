import { api } from './client';

/**
 * Send a test email
 * @param {Object} data - Email data
 * @param {string} data.to - Recipient email address
 * @param {string} data.subject - Email subject
 * @param {string} data.html - HTML content
 * @returns {Promise} API response
 */
export const sendTestEmail = (data) => {
  return api.post('/email/test', data);
};

/**
 * Get email usage and limits for current company
 * @returns {Promise} API response with usage data
 */
export const getEmailUsage = () => {
  return api.get('/email/usage');
};

