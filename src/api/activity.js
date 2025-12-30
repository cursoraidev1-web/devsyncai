import { api } from './client';

export const fetchActivity = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/activity${query}`).then(response => {
    const activityData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(activityData) ? activityData : [];
  });
};

export const createActivity = (payload) => {
  return api.post('/activity', payload).then(response => {
    return response?.data || response;
  });
};




