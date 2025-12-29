import { api } from './client';

/**
 * Get current subscription information
 * @returns {Promise<Object>} Subscription data with plan, limits, and usage
 */
export const getSubscription = async () => {
  const response = await api.get('/subscription');
  return response?.data || response;
};

/**
 * Get all available plans
 * @returns {Promise<Array>} Array of plan objects
 */
export const getPlans = async () => {
  const response = await api.get('/plans');
  return response?.data || response;
};

/**
 * Upgrade subscription to a new plan
 * @param {string} planType - 'pro' or 'enterprise'
 * @param {string} paymentMethodId - Optional Stripe payment method ID
 * @returns {Promise<Object>} Updated subscription data
 */
export const upgradeSubscription = async (planType, paymentMethodId = null) => {
  const response = await api.post('/subscription/upgrade', {
    planType,
    paymentMethodId,
  });
  return response?.data || response;
};

/**
 * Cancel subscription
 * @param {boolean} cancelImmediately - If true, cancel now; if false, cancel at period end
 * @returns {Promise<Object>} Updated subscription data
 */
export const cancelSubscription = async (cancelImmediately = false) => {
  const response = await api.post('/subscription/cancel', {
    cancelImmediately,
  });
  return response?.data || response;
};

/**
 * Check plan limits and usage
 * @param {string} resource - Optional: 'projects' | 'tasks' | 'team_members' | 'documents' | 'storage'
 * @returns {Promise<Object>} Limits, usage, and canCreate flags
 */
export const checkLimits = async (resource = null) => {
  const url = resource ? `/subscription/limits?resource=${resource}` : '/subscription/limits';
  const response = await api.get(url);
  return response?.data || response;
};



