import { api } from './client';

export const fetchProjects = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/projects${query}`).then(response => {
    const projectsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(projectsData) ? projectsData : [];
  });
};

export const getProject = (id) => {
  return api.get(`/projects/${id}`).then(response => {
    return response?.data || response;
  });
};

export const createProject = (payload) => {
  // Ensure dates are in ISO format
  const projectPayload = { ...payload };
  if (projectPayload.start_date && !(projectPayload.start_date instanceof Date)) {
    const startDate = new Date(projectPayload.start_date);
    projectPayload.start_date = startDate.toISOString();
  }
  if (projectPayload.end_date && !(projectPayload.end_date instanceof Date)) {
    const endDate = new Date(projectPayload.end_date);
    projectPayload.end_date = endDate.toISOString();
  }
  return api.post('/projects', projectPayload).then(response => {
    return response?.data || response;
  });
};

export const updateProject = (id, updates) => {
  // Ensure dates are in ISO format if provided
  const projectPayload = { ...updates };
  if (projectPayload.start_date && !(projectPayload.start_date instanceof Date)) {
    const startDate = new Date(projectPayload.start_date);
    projectPayload.start_date = startDate.toISOString();
  }
  if (projectPayload.end_date && !(projectPayload.end_date instanceof Date)) {
    const endDate = new Date(projectPayload.end_date);
    projectPayload.end_date = endDate.toISOString();
  }
  return api.patch(`/projects/${id}`, projectPayload).then(response => {
    return response?.data || response;
  });
};

export const deleteProject = (id) => {
  return api.delete(`/projects/${id}`);
};

export const inviteToProject = (projectId, payload) => {
  return api.post(`/projects/${projectId}/invite`, payload).then(response => {
    return response?.data || response;
  });
};

export const getProjectMembers = (projectId) => {
  return api.get(`/projects/${projectId}/members`).then(response => {
    const membersData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(membersData) ? membersData : [];
  });
};

export const removeProjectMember = (projectId, userId) => {
  return api.delete(`/projects/${projectId}/members/${userId}`);
};


