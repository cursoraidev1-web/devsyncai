import { api } from './client';

export const submitFeedback = (payload) => {
  return api.post('/feedback', payload).then(response => {
    return response?.data || response;
  });
};

export const fetchFeedback = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/feedback${query}`).then(response => {
    const feedbackData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(feedbackData) ? feedbackData : [];
  });
};

export const getFeedback = (id) => {
  return api.get(`/feedback/${id}`).then(response => {
    return response?.data || response;
  });
};

export const updateFeedbackStatus = (id, status) => {
  return api.patch(`/feedback/${id}/status`, { status }).then(response => {
    return response?.data || response;
  });
};




