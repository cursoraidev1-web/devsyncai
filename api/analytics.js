import { api } from './client';

export const getAnalytics = (projectId) => {
  return api.get(`/analytics?project_id=${projectId}`).then(response => {
    return response?.data || response;
  });
};

export const getKPIs = (projectId) => {
  const query = projectId ? `?project_id=${projectId}` : '';
  return api.get(`/analytics/kpi${query}`).then(response => {
    return response?.data || response;
  });
};

export const getProjectProgress = (projectId) => {
  const query = projectId ? `?project_id=${projectId}` : '';
  return api.get(`/analytics/progress${query}`).then(response => {
    return response?.data || response;
  });
};

export const getTeamPerformance = (projectId) => {
  const query = projectId ? `?project_id=${projectId}` : '';
  return api.get(`/analytics/team-performance${query}`).then(response => {
    return response?.data || response;
  });
};

export const getTaskAnalytics = (projectId) => {
  const query = projectId ? `?project_id=${projectId}` : '';
  return api.get(`/analytics/tasks${query}`).then(response => {
    return response?.data || response;
  });
};













