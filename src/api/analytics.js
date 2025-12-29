import { api } from './client';

export const getAnalytics = (projectId) => {
  return api.get(`/analytics?project_id=${projectId}`);
};











