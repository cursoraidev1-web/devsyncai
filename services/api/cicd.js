import { api } from './client';

export const fetchPipelines = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/cicd/pipelines${query}`).then(response => {
    const pipelinesData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(pipelinesData) ? pipelinesData : [];
  });
};

export const getPipeline = (id) => {
  return api.get(`/cicd/pipelines/${id}`).then(response => {
    return response?.data || response;
  });
};

export const getPipelineLogs = (id, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/cicd/pipelines/${id}/logs${query}`).then(response => {
    return response?.data || response;
  });
};

export const triggerPipeline = (id, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.post(`/cicd/pipelines/${id}/trigger${query}`).then(response => {
    return response?.data || response;
  });
};

export const cancelPipeline = (id, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.post(`/cicd/pipelines/${id}/cancel${query}`).then(response => {
    return response?.data || response;
  });
};

export const fetchDeployments = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/cicd/deployments${query}`).then(response => {
    const deploymentsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(deploymentsData) ? deploymentsData : [];
  });
};

export const getDeployment = (id) => {
  return api.get(`/cicd/deployments/${id}`).then(response => {
    return response?.data || response;
  });
};

export const rollbackDeployment = (id, filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.post(`/cicd/deployments/${id}/rollback${query}`).then(response => {
    return response?.data || response;
  });
};

export const fetchCommits = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/cicd/commits${query}`).then(response => {
    const commitsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(commitsData) ? commitsData : [];
  });
};

export const getCommit = (id) => {
  return api.get(`/cicd/commits/${id}`).then(response => {
    return response?.data || response;
  });
};

export const getCICDMetrics = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/cicd/metrics${query}`).then(response => {
    return response?.data || response;
  });
};

