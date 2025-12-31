import { api } from './client';

// Team Management
export const fetchTeams = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/teams${query}`).then(response => {
    const teamsData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(teamsData) ? teamsData : [];
  });
};

export const getTeam = (id) => {
  return api.get(`/teams/${id}`).then(response => {
    return response?.data || response;
  });
};

export const createTeam = (payload) => {
  return api.post('/teams', payload).then(response => {
    return response?.data || response;
  });
};

export const updateTeam = (id, updates) => {
  return api.patch(`/teams/${id}`, updates).then(response => {
    return response?.data || response;
  });
};

export const deleteTeam = (id) => {
  return api.delete(`/teams/${id}`);
};

// Team Members
export const getTeamMembers = (teamId) => {
  return api.get(`/teams/${teamId}/members`).then(response => {
    const membersData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(membersData) ? membersData : [];
  });
};

export const addTeamMember = (teamId, payload) => {
  return api.post(`/teams/${teamId}/members`, payload).then(response => {
    return response?.data || response;
  });
};

export const removeTeamMember = (teamId, userId) => {
  return api.delete(`/teams/${teamId}/members/${userId}`);
};

// Project Invitations (existing)
export const inviteToProject = (projectId, payload) => {
  return api.post('/teams/invite', {
    projectId,
    ...payload
  }).then(response => {
    return response?.data || response;
  });
};

export const acceptInvite = (token) => {
  return api.post('/teams/accept-invite', { token }, { auth: false }).then(response => {
    return response?.data || response;
  });
};

// Legacy - kept for backwards compatibility
export const getProjectMembers = (projectId) => {
  return api.get(`/teams/${projectId}/members`).then(response => {
    const membersData = response?.data || (Array.isArray(response) ? response : []);
    return Array.isArray(membersData) ? membersData : [];
  });
};


