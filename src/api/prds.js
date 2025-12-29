import { api } from './client';

export const fetchPRDs = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/prds${query}`).then(response => {
    const prdsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(prdsData) ? prdsData : [];
  });
};

export const createPRD = (payload) => {
  const prdPayload = {
    project_id: payload.project_id,
    title: payload.title,
    content: payload.content || JSON.stringify(payload.sections || []),
    version: payload.version || 1
  };
  return api.post('/prds', prdPayload).then(response => {
    return response?.data || response;
  });
};

export const getPRD = (id) => {
  return api.get(`/prds/${id}`).then(response => {
    return response?.data || response;
  });
};

export const updatePRD = (id, updates) => {
  return api.patch(`/prds/${id}`, updates).then(response => {
    return response?.data || response;
  });
};

export const deletePRD = (id) => {
  return api.delete(`/prds/${id}`);
};

export const updatePRDStatus = (id, status) => {
  return api.patch(`/prds/${id}/status`, { status }).then(response => {
    return response?.data || response;
  });
};

export const createPRDVersion = (id, payload) => {
  return api.post(`/prds/${id}/versions`, payload).then(response => {
    return response?.data || response;
  });
};

export const getPRDVersions = (id) => {
  return api.get(`/prds/${id}/versions`).then(response => {
    const versionsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(versionsData) ? versionsData : [];
  });
};

export const addPRDSection = (id, section) => {
  return api.post(`/prds/${id}/sections`, section).then(response => {
    return response?.data || response;
  });
};

export const updatePRDSection = (id, sectionId, updates) => {
  return api.patch(`/prds/${id}/sections/${sectionId}`, updates).then(response => {
    return response?.data || response;
  });
};

export const deletePRDSection = (id, sectionId) => {
  return api.delete(`/prds/${id}/sections/${sectionId}`);
};

export const addPRDAssignee = (id, userId) => {
  return api.post(`/prds/${id}/assignees`, { userId }).then(response => {
    return response?.data || response;
  });
};

export const removePRDAssignee = (id, userId) => {
  return api.delete(`/prds/${id}/assignees/${userId}`);
};

export const approvePRD = (id) => {
  return api.post(`/prds/${id}/approve`).then(response => {
    return response?.data || response;
  });
};






