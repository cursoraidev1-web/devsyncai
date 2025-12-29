import { api } from './client';

export const createDocument = (payload) => {
  // Ensure all required fields are present
  const documentPayload = {
    project_id: payload.project_id,
    title: payload.title,
    file_url: payload.file_url,
    file_type: payload.file_type,
    file_size: payload.file_size
  };
  return api.post('/documents', documentPayload).then(response => {
    return response?.data || response;
  });
};

export const fetchDocuments = (projectId) => {
  return api.get(`/documents?project_id=${projectId}`).then(response => {
    const documentsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(documentsData) ? documentsData : [];
  });
};

export const getDocument = (id) => {
  return api.get(`/documents/${id}`).then(response => {
    return response?.data || response;
  });
};

export const updateDocument = (id, updates) => {
  return api.patch(`/documents/${id}`, updates).then(response => {
    return response?.data || response;
  });
};

export const deleteDocument = (id) => {
  return api.delete(`/documents/${id}`);
};

/**
 * Get upload token for document
 * @param {Object} fileInfo - File information
 * @param {string} fileInfo.project_id - Project ID
 * @param {string} fileInfo.file_name - Name of the file
 * @param {number} fileInfo.file_size - Size of the file in bytes
 * @param {string} fileInfo.file_type - MIME type of the file
 * @returns {Promise<Object>} Upload token data with upload_path, expires_at, max_file_size
 */
export const getDocumentUploadToken = (fileInfo) => {
  return api.post('/documents/upload-token', {
    project_id: fileInfo.project_id,
    file_name: fileInfo.file_name,
    file_size: fileInfo.file_size,
    file_type: fileInfo.file_type
  }).then(response => {
    return response?.data || response;
  });
};

/**
 * Legacy upload method (kept for backward compatibility)
 * @deprecated Use getDocumentUploadToken + Supabase upload + createDocument instead
 */
export const uploadDocument = (file, projectId, metadata = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('project_id', projectId);
  if (metadata.title) formData.append('title', metadata.title);
  if (metadata.file_type) formData.append('file_type', metadata.file_type);
  
  return api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(response => {
    return response?.data || response;
  });
};

export const downloadDocument = (id) => {
  return api.get(`/documents/${id}/download`).then(response => {
    return response?.data || response;
  });
};










