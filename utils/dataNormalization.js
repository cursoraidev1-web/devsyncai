/**
 * Data Normalization Utility
 * Normalizes data before sending to API to ensure correct types
 * Prevents validation errors from type mismatches
 */

/**
 * Normalizes a value - converts empty strings to null/undefined
 * @param {*} value - Value to normalize
 * @param {string} type - Expected type ('string', 'number', 'uuid', 'array', 'object')
 * @returns {*} Normalized value
 */
export const normalizeValue = (value, type = 'string') => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return type === 'string' ? undefined : (type === 'array' ? [] : undefined);
  }

  // Handle empty strings
  if (value === '' || (typeof value === 'string' && value.trim() === '')) {
    if (type === 'string') {
      return undefined; // Don't send empty strings
    }
    if (type === 'uuid' || type === 'number') {
      return undefined; // Empty string for ID/number = undefined
    }
    if (type === 'array') {
      return [];
    }
    return undefined;
  }

  // Type conversions
  if (type === 'number') {
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? undefined : num;
  }

  if (type === 'uuid' && typeof value === 'string') {
    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value) ? value : undefined;
  }

  if (type === 'array' && !Array.isArray(value)) {
    return [value];
  }

  return value;
};

/**
 * Normalizes an object by cleaning empty strings and ensuring correct types
 * @param {Object} obj - Object to normalize
 * @param {Object} schema - Schema defining expected types for each field
 * @returns {Object} Normalized object
 */
export const normalizeObject = (obj, schema = {}) => {
  const normalized = {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip undefined values entirely
    if (value === undefined) {
      continue;
    }

    // Get expected type from schema, default to 'string'
    const expectedType = schema[key] || 'string';

    // Normalize the value
    const normalizedValue = normalizeValue(value, expectedType);

    // Only include if not undefined (or if it's explicitly allowed)
    if (normalizedValue !== undefined) {
      normalized[key] = normalizedValue;
    }
  }

  return normalized;
};

/**
 * Normalizes task payload for API
 * @param {Object} task - Task object from form
 * @returns {Object} Normalized task payload
 */
export const normalizeTaskPayload = (task) => {
  const schema = {
    title: 'string',
    description: 'string',
    project_id: 'uuid',
    assignee_id: 'uuid', // Can be undefined if not assigned
    status: 'string',
    priority: 'string',
    due_date: 'string', // ISO date string
    tags: 'array',
  };

  const normalized = normalizeObject(task, schema);

  // Ensure required fields
  if (!normalized.title) {
    throw new Error('Task title is required');
  }
  if (!normalized.project_id) {
    throw new Error('Project ID is required');
  }

  // Set defaults
  if (!normalized.status) {
    normalized.status = 'todo';
  }
  if (!normalized.priority) {
    normalized.priority = 'medium';
  }
  if (!normalized.tags) {
    normalized.tags = [];
  }

  return normalized;
};

/**
 * Normalizes project payload for API
 * @param {Object} project - Project object from form
 * @returns {Object} Normalized project payload
 */
export const normalizeProjectPayload = (project) => {
  const schema = {
    name: 'string',
    description: 'string',
    team_id: 'uuid', // Can be undefined
    status: 'string',
    start_date: 'string', // ISO date string
    end_date: 'string', // ISO date string
    visibility: 'string',
  };

  const normalized = normalizeObject(project, schema);

  // Ensure required fields
  if (!normalized.name) {
    throw new Error('Project name is required');
  }

  // Set defaults
  if (!normalized.status) {
    normalized.status = 'active';
  }
  if (!normalized.visibility) {
    normalized.visibility = 'private';
  }

  return normalized;
};

/**
 * Normalizes handoff payload for API
 * @param {Object} handoff - Handoff object from form
 * @returns {Object} Normalized handoff payload
 */
export const normalizeHandoffPayload = (handoff) => {
  const schema = {
    title: 'string',
    description: 'string',
    from_user_id: 'uuid',
    to_user_id: 'uuid',
    project_id: 'uuid',
    priority: 'string',
    due_date: 'string', // ISO date string
  };

  return normalizeObject(handoff, schema);
};

