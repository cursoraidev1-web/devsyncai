import { api } from './client';

export const fetchIntegrations = () => {
  return api.get('/integrations').then(response => {
    const integrationsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(integrationsData) ? integrationsData : [];
  });
};

export const getIntegration = (id) => {
  return api.get(`/integrations/${id}`).then(response => {
    return response?.data || response;
  });
};

export const connectIntegration = (id, config = {}) => {
  return api.post(`/integrations/${id}/connect`, config).then(response => {
    return response?.data || response;
  });
};

export const disconnectIntegration = (id) => {
  return api.post(`/integrations/${id}/disconnect`).then(response => {
    return response?.data || response;
  });
};

export const getIntegrationConfig = (id) => {
  return api.get(`/integrations/${id}/config`).then(response => {
    return response?.data || response;
  });
};

export const updateIntegrationConfig = (id, config) => {
  return api.patch(`/integrations/${id}/config`, config).then(response => {
    return response?.data || response;
  });
};

export const syncIntegration = (id) => {
  return api.post(`/integrations/${id}/sync`).then(response => {
    return response?.data || response;
  });
};

// OAuth-specific endpoints
export const githubOAuthCallback = (code, state) => {
  return api.post('/integrations/github/oauth', { code, state }).then(response => {
    return response?.data || response;
  });
};

export const slackOAuthCallback = (code, state) => {
  return api.post('/integrations/slack/oauth', { code, state }).then(response => {
    return response?.data || response;
  });
};




