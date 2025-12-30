import { api } from './client';

/**
 * Get comments for a resource (task, PRD, etc.)
 * @param {Object} params - Query parameters
 * @param {string} params.resource_type - Type of resource ('task', 'prd', etc.)
 * @param {string} params.resource_id - ID of the resource
 * @returns {Promise<Array>} Array of comments
 */
export const getComments = (params) => {
  const queryParams = new URLSearchParams(params).toString();
  return api.get(`/comments?${queryParams}`).then(response => {
    const commentsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(commentsData) ? commentsData : [];
  });
};

/**
 * Create a new comment
 * @param {Object} payload - Comment data
 * @param {string} payload.resource_type - Type of resource ('task', 'prd', etc.)
 * @param {string} payload.resource_id - ID of the resource
 * @param {string} payload.project_id - Project ID
 * @param {string} payload.content - Comment content
 * @param {string} [payload.parent_id] - Parent comment ID for threading
 * @returns {Promise<Object>} Created comment
 */
export const createComment = (payload) => {
  return api.post('/comments', payload).then(response => {
    return response?.data || response;
  });
};

/**
 * Update a comment
 * @param {string} id - Comment ID
 * @param {Object} updates - Updates to apply
 * @param {string} [updates.content] - Updated comment content
 * @returns {Promise<Object>} Updated comment
 */
export const updateComment = (id, updates) => {
  return api.patch(`/comments/${id}`, updates).then(response => {
    return response?.data || response;
  });
};

/**
 * Delete a comment
 * @param {string} id - Comment ID
 * @returns {Promise<void>}
 */
export const deleteComment = (id) => {
  return api.delete(`/comments/${id}`);
};




