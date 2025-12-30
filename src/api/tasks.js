import { api } from './client';

// Normalize status: frontend uses 'in-progress', backend uses 'in_progress'
const normalizeStatusToBackend = (status) => {
  if (status === 'in-progress') return 'in_progress';
  if (status === 'in-review') return 'in_review';
  return status;
};

// Normalize status: backend uses 'in_progress', frontend uses 'in-progress'
const normalizeStatusFromBackend = (status) => {
  if (status === 'in_progress') return 'in-progress';
  if (status === 'in_review') return 'in-review';
  return status;
};

/**
 * Fetch all tasks (optionally filtered by project)
 * @param {string} [projectId] - Optional project ID to filter tasks
 * @returns {Promise<Array>} Array of tasks
 */
export const fetchTasks = (projectId = null) => {
  const query = projectId ? `?project_id=${projectId}` : '';
  return api.get(`/tasks${query}`).then(response => {
    // Handle response structure: { success: true, data: [...], message: "..." }
    const tasksData = response?.data || (Array.isArray(response) ? response : []);
    
    // Normalize status values from backend
    return Array.isArray(tasksData) ? tasksData.map(task => ({
      ...task,
      status: normalizeStatusFromBackend(task.status)
    })) : [];
  });
};

/**
 * Fetch tasks by project (for backward compatibility)
 * @param {string} projectId - Project ID
 * @returns {Promise<Array>} Array of tasks
 */
export const fetchTasksByProject = (projectId) => {
  return fetchTasks(projectId);
};

// Deprecated: Use updateTask instead
export const updateTaskStatus = (taskId, status) => {
  const normalizedStatus = normalizeStatusToBackend(status);
  return api.patch(`/tasks/${taskId}`, { status: normalizedStatus });
};

export const updateTask = (taskId, updates) => {
  // Normalize status if provided
  const normalizedUpdates = { ...updates };
  if (updates.status) {
    normalizedUpdates.status = normalizeStatusToBackend(updates.status);
  }
  return api.patch(`/tasks/${taskId}`, normalizedUpdates).then(response => {
    // Handle response structure: { success: true, data: {...}, message: "..." } or direct task object
    const task = response?.data || response;
    return {
      ...task,
      status: normalizeStatusFromBackend(task.status)
    };
  });
};

export const createTask = (payload) => {
  // Normalize status if provided
  const normalizedPayload = { ...payload };
  
  // Ensure required fields are present
  if (!normalizedPayload.title) {
    throw new Error('Task title is required');
  }
  
  if (!normalizedPayload.project_id) {
    throw new Error('Project ID is required');
  }
  
  // Normalize status
  if (normalizedPayload.status) {
    normalizedPayload.status = normalizeStatusToBackend(normalizedPayload.status);
  } else {
    normalizedPayload.status = 'todo'; // Default status
  }
  
  // Map frontend field names to backend field names
  if (normalizedPayload.dueDate) {
    normalizedPayload.due_date = normalizedPayload.dueDate;
    delete normalizedPayload.dueDate;
  }
  
  // Remove assignee if it's a role string (backend expects assignee_id, not assignee)
  // TODO: When user selection is implemented, map assignee to assignee_id
  if (normalizedPayload.assignee && !normalizedPayload.assignee_id) {
    // For now, remove assignee since backend doesn't support role-based assignment
    // Backend expects assignee_id (user UUID), not assignee (role string)
    delete normalizedPayload.assignee;
  }
  
  // Ensure tags is properly formatted (array or null)
  if (normalizedPayload.tags) {
    if (!Array.isArray(normalizedPayload.tags)) {
      normalizedPayload.tags = [normalizedPayload.tags];
    }
  } else {
    normalizedPayload.tags = [];
  }
  
  // Ensure priority is set
  if (!normalizedPayload.priority) {
    normalizedPayload.priority = 'medium';
  }
  
  return api.post('/tasks', normalizedPayload).then(response => {
    // Handle response structure: { success: true, data: {...}, message: "..." } or direct task object
    const task = response?.data || response;
    return {
      ...task,
      status: normalizeStatusFromBackend(task.status)
    };
  }).catch(error => {
    // Improve error message for RLS errors
    const errorMessage = error?.data?.error || error?.message || 'Failed to create task';
    if (errorMessage.includes('row-level security') || errorMessage.includes('RLS')) {
      throw new Error('Permission denied: Unable to create task. Please contact your administrator.');
    }
    throw new Error(errorMessage);
  });
};

export const deleteTask = (id) => api.delete(`/tasks/${id}`);


