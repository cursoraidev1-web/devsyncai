import { api } from './client';

export const fetchHandoffs = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/handoffs${query}`).then(response => {
    const handoffsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(handoffsData) ? handoffsData : [];
  });
};

export const getHandoff = (id) => {
  return api.get(`/handoffs/${id}`).then(response => {
    return response?.data || response;
  });
};

/**
 * Creates a new handoff with proper data normalization
 * @param {Object} payload - Handoff payload from form
 * @returns {Promise<Object>} Created handoff
 */
export const createHandoff = (payload) => {
  const handoffPayload = { ...payload };
  
  // Ensure required fields
  if (!handoffPayload.title || handoffPayload.title.trim() === '') {
    throw new Error('Handoff title is required');
  }
  if (!handoffPayload.to_user_id || handoffPayload.to_user_id === '') {
    throw new Error('Recipient is required');
  }
  if (!handoffPayload.project_id || handoffPayload.project_id === '') {
    throw new Error('Project is required');
  }
  
  // Normalize dates
  if (handoffPayload.due_date) {
    if (handoffPayload.due_date === '' || handoffPayload.due_date === null) {
      delete handoffPayload.due_date;
    } else if (handoffPayload.due_date instanceof Date) {
      handoffPayload.due_date = handoffPayload.due_date.toISOString();
    } else if (typeof handoffPayload.due_date === 'string' && handoffPayload.due_date.trim() !== '') {
      const dueDate = new Date(handoffPayload.due_date);
      if (!isNaN(dueDate.getTime())) {
        handoffPayload.due_date = dueDate.toISOString();
      } else {
        delete handoffPayload.due_date;
      }
    }
  }
  
  // Remove empty string values
  const cleanPayload = {};
  for (const [key, value] of Object.entries(handoffPayload)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanPayload[key] = value;
    }
  }
  
  // Ensure required fields are still present
  if (!cleanPayload.title) {
    throw new Error('Handoff title is required');
  }
  if (!cleanPayload.to_user_id) {
    throw new Error('Recipient is required');
  }
  if (!cleanPayload.project_id) {
    throw new Error('Project is required');
  }
  
  return api.post('/handoffs', cleanPayload).then(response => {
    return response?.data || response;
  });
};

export const updateHandoff = (id, updates) => {
  return api.patch(`/handoffs/${id}`, updates).then(response => {
    return response?.data || response;
  });
};

export const deleteHandoff = (id) => {
  return api.delete(`/handoffs/${id}`);
};

export const approveHandoff = (id, comment = '') => {
  return api.post(`/handoffs/${id}/approve`, { comment }).then(response => {
    return response?.data || response;
  });
};

export const rejectHandoff = (id, reason = '') => {
  return api.post(`/handoffs/${id}/reject`, { reason }).then(response => {
    return response?.data || response;
  });
};

export const getHandoffComments = (id) => {
  return api.get(`/handoffs/${id}/comments`).then(response => {
    const commentsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(commentsData) ? commentsData : [];
  });
};

export const addHandoffComment = (id, comment) => {
  return api.post(`/handoffs/${id}/comments`, { comment }).then(response => {
    return response?.data || response;
  });
};

export const uploadHandoffAttachment = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/handoffs/${id}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(response => {
    return response?.data || response;
  });
};




