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

export const createHandoff = (payload) => {
  return api.post('/handoffs', payload).then(response => {
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

export const rejectHandoff = (id, comment = '') => {
  return api.post(`/handoffs/${id}/reject`, { comment }).then(response => {
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




