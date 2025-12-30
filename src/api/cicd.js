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

export const getPipelineLogs = (id) => {
  return api.get(`/cicd/pipelines/${id}/logs`).then(response => {
    return response?.data || response;
  });
};

export const triggerPipeline = (id) => {
  return api.post(`/cicd/pipelines/${id}/trigger`).then(response => {
    return response?.data || response;
  });
};

export const cancelPipeline = (id) => {
  return api.post(`/cicd/pipelines/${id}/cancel`).then(response => {
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

export const rollbackDeployment = (id) => {
  return api.post(`/cicd/deployments/${id}/rollback`).then(response => {
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




