import { api } from './client';

/**
 * Transform backend PRD response to frontend format
 */
const transformPRDResponse = (prd) => {
  if (!prd) return null;

  // Parse content JSONB to sections array
  let sections = [];
  if (prd.content) {
    const content = typeof prd.content === 'string' ? JSON.parse(prd.content) : prd.content;
    if (content.sections && Array.isArray(content.sections)) {
      sections = content.sections.map((section, index) => ({
        id: section.id || `section-${index}`,
        title: section.title || `Section ${index + 1}`,
        content: section.content || ''
      }));
    } else if (Array.isArray(content)) {
      // Handle case where content is directly an array
      sections = content.map((section, index) => ({
        id: section.id || `section-${index}`,
        title: section.title || `Section ${index + 1}`,
        content: section.content || ''
      }));
    }
  }

  // Extract user info
  const creator = prd.users || prd.user || {};
  const project = prd.projects || prd.project || {};

  return {
    ...prd,
    sections: sections.length > 0 ? sections : [
      { id: 'overview', title: 'Overview', content: '' },
      { id: 'goals', title: 'Goals & Objectives', content: '' },
      { id: 'features', title: 'Features & Requirements', content: '' },
      { id: 'technical', title: 'Technical Specifications', content: '' },
      { id: 'metrics', title: 'Success Metrics', content: '' }
    ],
    author: creator.full_name || 'Unknown',
    lastUpdated: prd.updated_at ? new Date(prd.updated_at).toLocaleDateString() : 'Unknown',
    assignees: prd.assignees || [], // TODO: Implement assignees if backend supports it
    projectName: project.name || 'Unknown Project'
  };
};

export const fetchPRDs = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const query = params ? `?${params}` : '';
  return api.get(`/prds${query}`).then(response => {
    const prdsData = response?.data || (Array.isArray(response) ? response : []);
    const prdsArray = Array.isArray(prdsData) ? prdsData : [];
    return prdsArray.map(transformPRDResponse);
  });
};

export const createPRD = (payload) => {
  // Transform sections array to JSONB content format
  let content;
  if (payload.content) {
    // If content is already provided, use it
    content = typeof payload.content === 'string' ? JSON.parse(payload.content) : payload.content;
  } else if (payload.sections) {
    // Transform sections array to JSONB object
    content = { sections: payload.sections };
  } else {
    // Default empty content
    content = { sections: [] };
  }

  const prdPayload = {
    project_id: payload.project_id, // REQUIRED
    title: payload.title,
    content: content, // JSONB format
    version: payload.version || 1
  };
  return api.post('/prds', prdPayload).then(response => {
    const prd = response?.data || response;
    return transformPRDResponse(prd);
  });
};

export const getPRD = (id) => {
  return api.get(`/prds/${id}`).then(response => {
    const prd = response?.data || response;
    return transformPRDResponse(prd);
  });
};

export const updatePRD = (id, updates) => {
  // Transform sections to content JSONB if needed
  let payload = { ...updates };
  if (updates.sections && !updates.content) {
    payload.content = { sections: updates.sections };
    delete payload.sections;
  } else if (updates.content) {
    // Ensure content is in correct format
    if (typeof updates.content === 'string') {
      payload.content = JSON.parse(updates.content);
    }
  }

  // Only send title and content to backend
  const backendPayload = {
    title: payload.title,
    content: payload.content
  };

  return api.patch(`/prds/${id}`, backendPayload).then(response => {
    const prd = response?.data || response;
    return transformPRDResponse(prd);
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
  // Backend uses PATCH /prds/:id/status with { status: 'approved' }
  return api.patch(`/prds/${id}/status`, { status: 'approved' }).then(response => {
    return response?.data || response;
  });
};






