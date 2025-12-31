import { api } from './client';

/**
 * Get upload token for task attachment
 * @param {string} taskId - Task ID
 * @param {Object} fileInfo - File information
 * @param {string} fileInfo.file_name - Name of the file
 * @param {number} fileInfo.file_size - Size of the file in bytes
 * @param {string} fileInfo.file_type - MIME type of the file
 * @returns {Promise<Object>} Upload token data with upload_path, expires_at, max_file_size
 */
export const getTaskAttachmentUploadToken = (taskId, fileInfo) => {
  return api.post(`/tasks/${taskId}/attachments/upload-token`, {
    task_id: taskId,
    file_name: fileInfo.file_name,
    file_size: fileInfo.file_size,
    file_type: fileInfo.file_type
  }).then(response => {
    return response?.data || response;
  });
};

/**
 * Save task attachment metadata after upload
 * @param {string} taskId - Task ID
 * @param {Object} metadata - Attachment metadata
 * @param {string} metadata.task_id - Task ID
 * @param {string} metadata.project_id - Project ID
 * @param {string} metadata.file_name - File name
 * @param {string} metadata.file_path - Path in storage
 * @param {string} metadata.file_url - Public URL
 * @param {string} metadata.file_type - MIME type
 * @param {number} metadata.file_size - File size in bytes
 * @returns {Promise<Object>} Created attachment
 */
export const saveTaskAttachment = (taskId, metadata) => {
  return api.post(`/tasks/${taskId}/attachments`, metadata).then(response => {
    return response?.data || response;
  });
};

/**
 * List all attachments for a task
 * @param {string} taskId - Task ID
 * @returns {Promise<Array>} Array of attachments
 */
export const getTaskAttachments = (taskId) => {
  return api.get(`/tasks/${taskId}/attachments`).then(response => {
    const attachmentsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(attachmentsData) ? attachmentsData : [];
  });
};

/**
 * Get download URL for an attachment
 * @param {string} attachmentId - Attachment ID
 * @returns {Promise<Object>} Download data with download_url and expires_at
 */
export const getAttachmentDownloadUrl = (attachmentId) => {
  return api.get(`/tasks/attachments/${attachmentId}/download`).then(response => {
    return response?.data || response;
  });
};

/**
 * Delete an attachment
 * @param {string} attachmentId - Attachment ID
 * @returns {Promise<void>}
 */
export const deleteAttachment = (attachmentId) => {
  return api.delete(`/tasks/attachments/${attachmentId}`);
};




