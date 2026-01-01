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

/**
 * Updates a task with proper data normalization
 * @param {string|number} taskId - Task ID
 * @param {Object} updates - Update payload
 * @returns {Promise<Object>} Updated task
 */
export const updateTask = (taskId, updates) => {
  const normalizedUpdates = { ...updates };
  
  // Normalize status if provided
  if (normalizedUpdates.status) {
    normalizedUpdates.status = normalizeStatusToBackend(normalizedUpdates.status);
  }
  
  // Map frontend field names to backend field names
  if (normalizedUpdates.dueDate !== undefined) {
    if (normalizedUpdates.dueDate === '' || normalizedUpdates.dueDate === null) {
      delete normalizedUpdates.due_date;
    } else {
      normalizedUpdates.due_date = normalizedUpdates.dueDate;
    }
    delete normalizedUpdates.dueDate;
  }
  
  // CRITICAL FIX: Normalize assignee_id - empty string should be undefined
  if (normalizedUpdates.assignee_id === '' || normalizedUpdates.assignee_id === null) {
    delete normalizedUpdates.assignee_id;
  }
  
  // Normalize project_id if provided (should be UUID, not empty string)
  if (normalizedUpdates.project_id === '' || normalizedUpdates.project_id === null) {
    delete normalizedUpdates.project_id;
  }
  
  // Remove empty string values
  const cleanPayload = {};
  for (const [key, value] of Object.entries(normalizedUpdates)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanPayload[key] = value;
    }
  }
  
  return api.patch(`/tasks/${taskId}`, cleanPayload).then(response => {
    // Handle response structure: { success: true, data: {...}, message: "..." } or direct task object
    const task = response?.data || response;
    return {
      ...task,
      status: normalizeStatusFromBackend(task.status)
    };
  });
};

/**
 * Creates a new task with proper data normalization
 * @param {Object} payload - Task payload from form
 * @returns {Promise<Object>} Created task
 */
export const createTask = (payload) => {
  // Normalize status if provided
  const normalizedPayload = { ...payload };
  
  // Ensure required fields are present
  if (!normalizedPayload.title || normalizedPayload.title.trim() === '') {
    throw new Error('Task title is required');
  }
  
  if (!normalizedPayload.project_id || normalizedPayload.project_id === '') {
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
  if (normalizedPayload.assignee && !normalizedPayload.assignee_id) {
    delete normalizedPayload.assignee;
  }
  
  // CRITICAL FIX: Normalize assignee_id - empty string should be undefined
  if (normalizedPayload.assignee_id === '' || normalizedPayload.assignee_id === null) {
    delete normalizedPayload.assignee_id; // Don't send empty/null assignee_id
  }
  
  // Ensure tags is properly formatted (array or empty array)
  if (normalizedPayload.tags) {
    if (!Array.isArray(normalizedPayload.tags)) {
      normalizedPayload.tags = [normalizedPayload.tags];
    }
    // Remove empty tags
    normalizedPayload.tags = normalizedPayload.tags.filter(tag => tag && tag.trim() !== '');
  } else {
    normalizedPayload.tags = [];
  }
  
  // Ensure priority is set
  if (!normalizedPayload.priority) {
    normalizedPayload.priority = 'medium';
  }
  
  // Remove any undefined or null values to prevent validation errors
  const cleanPayload = {};
  for (const [key, value] of Object.entries(normalizedPayload)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanPayload[key] = value;
    }
  }
  
  // Ensure required fields are still present after cleaning
  if (!cleanPayload.title) {
    throw new Error('Task title is required');
  }
  if (!cleanPayload.project_id) {
    throw new Error('Project ID is required');
  }
  
  return api.post('/tasks', cleanPayload).then(response => {
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


