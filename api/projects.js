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

/**
 * Creates a new project with proper data normalization
 * @param {Object} payload - Project payload from form
 * @returns {Promise<Object>} Created project
 */
export const createProject = (payload) => {
  const projectPayload = { ...payload };
  
  // Ensure required fields
  if (!projectPayload.name || projectPayload.name.trim() === '') {
    throw new Error('Project name is required');
  }
  
  // Normalize dates - convert to ISO format or remove if empty
  if (projectPayload.start_date) {
    if (projectPayload.start_date instanceof Date) {
      projectPayload.start_date = projectPayload.start_date.toISOString();
    } else if (typeof projectPayload.start_date === 'string' && projectPayload.start_date.trim() !== '') {
      const startDate = new Date(projectPayload.start_date);
      if (!isNaN(startDate.getTime())) {
        projectPayload.start_date = startDate.toISOString();
      } else {
        delete projectPayload.start_date; // Invalid date, remove it
      }
    } else {
      delete projectPayload.start_date; // Empty or invalid
    }
  }
  
  if (projectPayload.end_date) {
    if (projectPayload.end_date instanceof Date) {
      projectPayload.end_date = projectPayload.end_date.toISOString();
    } else if (typeof projectPayload.end_date === 'string' && projectPayload.end_date.trim() !== '') {
      const endDate = new Date(projectPayload.end_date);
      if (!isNaN(endDate.getTime())) {
        projectPayload.end_date = endDate.toISOString();
      } else {
        delete projectPayload.end_date; // Invalid date, remove it
      }
    } else {
      delete projectPayload.end_date; // Empty or invalid
    }
  }
  
  // Remove empty string values (backend expects undefined, not empty strings)
  const cleanPayload = {};
  for (const [key, value] of Object.entries(projectPayload)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanPayload[key] = value;
    }
  }
  
  // Ensure required fields are still present
  if (!cleanPayload.name) {
    throw new Error('Project name is required');
  }
  
  return api.post('/projects', cleanPayload).then(response => {
    return response?.data || response;
  });
};

/**
 * Updates a project with proper data normalization
 * @param {string} id - Project ID
 * @param {Object} updates - Update payload
 * @returns {Promise<Object>} Updated project
 */
export const updateProject = (id, updates) => {
  const projectPayload = { ...updates };
  
  // Normalize dates - convert to ISO format or remove if empty
  if (projectPayload.start_date !== undefined) {
    if (projectPayload.start_date === '' || projectPayload.start_date === null) {
      delete projectPayload.start_date;
    } else if (projectPayload.start_date instanceof Date) {
      projectPayload.start_date = projectPayload.start_date.toISOString();
    } else if (typeof projectPayload.start_date === 'string' && projectPayload.start_date.trim() !== '') {
      const startDate = new Date(projectPayload.start_date);
      if (!isNaN(startDate.getTime())) {
        projectPayload.start_date = startDate.toISOString();
      } else {
        delete projectPayload.start_date;
      }
    }
  }
  
  if (projectPayload.end_date !== undefined) {
    if (projectPayload.end_date === '' || projectPayload.end_date === null) {
      delete projectPayload.end_date;
    } else if (projectPayload.end_date instanceof Date) {
      projectPayload.end_date = projectPayload.end_date.toISOString();
    } else if (typeof projectPayload.end_date === 'string' && projectPayload.end_date.trim() !== '') {
      const endDate = new Date(projectPayload.end_date);
      if (!isNaN(endDate.getTime())) {
        projectPayload.end_date = endDate.toISOString();
      } else {
        delete projectPayload.end_date;
      }
    }
  }
  
  // Remove empty string values
  const cleanPayload = {};
  for (const [key, value] of Object.entries(projectPayload)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanPayload[key] = value;
    }
  }
  
  return api.patch(`/projects/${id}`, cleanPayload).then(response => {
    return response?.data || response;
  });
};

export const deleteProject = (id) => {
  return api.delete(`/projects/${id}`);
};

/**
 * Invite user to project
 * @deprecated Use inviteToProject from teams.js instead
 * This function redirects to the correct endpoint
 */
export const inviteToProject = (projectId, payload) => {
  // Backend endpoint is /teams/invite, not /projects/:id/invite
  // Import from teams.js instead or use this redirect
  return api.post('/teams/invite', {
    projectId,
    ...payload
  }).then(response => {
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


