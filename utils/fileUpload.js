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
 * Get file type information (icon and color) for UI display
 * @param {string} fileType - MIME type of the file
 * @returns {Object} Object with icon emoji and color
 */
export const getFileTypeInfo = (fileType) => {
  if (!fileType) {
    return { icon: '📎', color: '#6b7280' };
  }
  
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) {
    return { icon: '📄', color: '#ef4444' };
  }
  if (type.includes('word') || type.includes('document') || type.includes('msword') || type.includes('docx')) {
    return { icon: '📝', color: '#2563eb' };
  }
  if (type.includes('image')) {
    return { icon: '🖼️', color: '#10b981' };
  }
  if (type.includes('sheet') || type.includes('excel') || type.includes('spreadsheet')) {
    return { icon: '📊', color: '#10b981' };
  }
  if (type.includes('zip') || type.includes('rar') || type.includes('archive')) {
    return { icon: '📦', color: '#6b7280' };
  }
  if (type.includes('text') || type.includes('plain')) {
    return { icon: '📄', color: '#6b7280' };
  }
  if (type.includes('markdown') || type.includes('md')) {
    return { icon: '📝', color: '#6b7280' };
  }
  
  return { icon: '📎', color: '#6b7280' };
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
 * @param {string} [metadata.prd_id] - PRD ID if linked to a PRD
 * @param {Object} [options] - Additional options
 * @param {Function} [options.onProgress] - Progress callback
 * @returns {Promise<Object>} Created document with metadata
 */
export const uploadDocumentFile = async (projectId, file, metadata = {}, options = {}) => {
  try {
    // Validate file before requesting token
    const validation = validateFile(file, {
      maxSize: 100 * 1024 * 1024, // 100MB default (backend will validate too)
      allowedTypes: [] // Backend handles type validation
    });
    
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Step 1: Get upload token from backend
    const tokenData = await getDocumentUploadToken({
      project_id: projectId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type
    });

    if (!tokenData || !tokenData.upload_path) {
      throw new Error('Failed to get upload token from server');
    }

    // Step 2: Upload to Supabase Storage
    await uploadFile(
      file,
      'documents',
      tokenData.upload_path,
      {
        onProgress: options.onProgress,
        contentType: file.type
      }
    );

    // Step 3: Save metadata to backend (use file_path, not file_url)
    // Backend will generate the URL from file_path
    const document = await createDocument({
      project_id: projectId,
      title: metadata.title || file.name,
      file_path: tokenData.upload_path, // Use file_path, backend handles URL generation
      file_type: file.type,
      file_size: file.size,
      tags: metadata.tags || [],
      prd_id: metadata.prd_id
    });

    return document;
  } catch (error) {
    console.error('Error uploading document:', error);
    
    // Provide user-friendly error messages
    if (error.message.includes('exceeds limit') || error.message.includes('too large')) {
      throw new Error('File size exceeds the maximum allowed limit');
    }
    if (error.message.includes('not allowed') || error.message.includes('invalid type')) {
      throw new Error('File type is not allowed');
    }
    if (error.message.includes('Storage limit') || error.message.includes('quota')) {
      throw new Error('Storage limit reached. Please upgrade your plan or delete files.');
    }
    if (error.message.includes('permission') || error.message.includes('403')) {
      throw new Error('You do not have permission to upload documents to this project');
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    // Re-throw with original message if no specific handling
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



