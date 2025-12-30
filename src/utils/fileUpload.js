import { getTaskAttachmentUploadToken, saveTaskAttachment } from '../api/attachments';
import { getDocumentUploadToken, createDocument } from '../api/documents';
import { uploadFile, getPublicUrl } from './supabase';

/**
 * Upload a task attachment following the guide pattern:
 * 1. Get upload token from backend
 * 2. Upload to Supabase Storage
 * 3. Save metadata to backend
 * 
 * @param {string} taskId - Task ID
 * @param {string} projectId - Project ID
 * @param {File} file - File to upload
 * @param {Object} [options] - Additional options
 * @param {Function} [options.onProgress] - Progress callback
 * @returns {Promise<Object>} Created attachment with metadata
 */
export const uploadTaskAttachment = async (taskId, projectId, file, options = {}) => {
  try {
    // Step 1: Get upload token from backend
    const tokenData = await getTaskAttachmentUploadToken(taskId, {
      file_name: file.name,
      file_size: file.size,
      file_type: file.type
    });

    if (!tokenData || !tokenData.upload_path) {
      throw new Error('Failed to get upload token');
    }

    // Step 2: Upload to Supabase Storage
    const uploadResult = await uploadFile(
      file,
      'task-attachments',
      tokenData.upload_path,
      {
        onProgress: options.onProgress,
        contentType: file.type
      }
    );

    // Step 3: Get public URL
    const publicUrl = getPublicUrl('task-attachments', tokenData.upload_path) || uploadResult.url;

    // Step 4: Save metadata to backend
    const attachment = await saveTaskAttachment(taskId, {
      task_id: taskId,
      project_id: projectId,
      file_name: file.name,
      file_path: tokenData.upload_path,
      file_url: publicUrl,
      file_type: file.type,
      file_size: file.size
    });

    return attachment;
  } catch (error) {
    console.error('Error uploading task attachment:', error);
    throw error;
  }
};

/**
 * Upload a document following the guide pattern:
 * 1. Get upload token from backend
 * 2. Upload to Supabase Storage
 * 3. Save metadata to backend
 * 
 * @param {string} projectId - Project ID
 * @param {File} file - File to upload
 * @param {Object} [metadata] - Additional metadata
 * @param {string} [metadata.title] - Document title
 * @param {Array<string>} [metadata.tags] - Document tags
 * @param {Function} [options.onProgress] - Progress callback
 * @returns {Promise<Object>} Created document with metadata
 */
export const uploadDocumentFile = async (projectId, file, metadata = {}, options = {}) => {
  try {
    // Step 1: Get upload token from backend
    const tokenData = await getDocumentUploadToken({
      project_id: projectId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type
    });

    if (!tokenData || !tokenData.upload_path) {
      throw new Error('Failed to get upload token');
    }

    // Step 2: Upload to Supabase Storage
    const uploadResult = await uploadFile(
      file,
      'documents',
      tokenData.upload_path,
      {
        onProgress: options.onProgress,
        contentType: file.type
      }
    );

    // Step 3: Get public URL
    const publicUrl = getPublicUrl('documents', tokenData.upload_path) || uploadResult.url;

    // Step 4: Save metadata to backend
    const document = await createDocument({
      project_id: projectId,
      title: metadata.title || file.name,
      file_path: tokenData.upload_path,
      file_url: publicUrl,
      file_type: file.type,
      file_size: file.size,
      tags: metadata.tags || []
    });

    return document;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Download a file from a URL
 * @param {string} url - File URL
 * @param {string} filename - Optional filename for download
 */
export const downloadFileFromUrl = (url, filename = null) => {
  try {
    const link = document.createElement('a');
    link.href = url;
    if (filename) {
      link.download = filename;
    }
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} [options] - Validation options
 * @param {number} [options.maxSize] - Maximum file size in bytes
 * @param {Array<string>} [options.allowedTypes] - Allowed MIME types
 * @returns {Object} Validation result with isValid and error message
 */
export const validateFile = (file, options = {}) => {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = [] } = options; // Default 10MB

  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  return { isValid: true };
};



