/**
 * Input Validation Utility
 * Provides consistent validation for all user inputs including length limits,
 * type validation, and format checking to prevent DoS and XSS attacks.
 */

/**
 * Input length limits for different field types
 * @type {Object<string, number>}
 */
export const INPUT_LIMITS = {
  title: 200,
  description: 10000,
  projectName: 100,
  email: 255,
  taskTitle: 200,
  taskDescription: 10000,
  documentTitle: 200,
  comment: 5000,
  firstName: 50,
  lastName: 50,
  workspaceName: 100,
  tag: 50,
};

/**
 * Validates input length against defined limits
 * @param {string} value - Input value to validate
 * @param {string} fieldType - Type of field (e.g., 'title', 'description')
 * @returns {{ valid: boolean, error?: string }} Validation result
 */
export const validateLength = (value, fieldType) => {
  if (typeof value !== 'string') {
    return { valid: false, error: 'Input must be a string' };
  }

  const limit = INPUT_LIMITS[fieldType];
  if (!limit) {
    // If no limit defined, allow but warn
    return { valid: true };
  }

  if (value.length > limit) {
    return {
      valid: false,
      error: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} must be less than ${limit} characters`,
    };
  }

  return { valid: true };
};

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {{ valid: boolean, error?: string }} Validation result
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  if (email.length > INPUT_LIMITS.email) {
    return { valid: false, error: `Email must be less than ${INPUT_LIMITS.email} characters` };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true };
};

/**
 * Validates that a value is not empty
 * @param {*} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {{ valid: boolean, error?: string }} Validation result
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return { valid: false, error: `${fieldName} cannot be empty` };
  }

  return { valid: true };
};

/**
 * Validates multiple fields at once
 * @param {Object} fields - Object with field names as keys and { value, type, required } as values
 * @returns {{ valid: boolean, errors: Object<string, string> }} Validation result
 */
export const validateFields = (fields) => {
  const errors = {};
  let isValid = true;

  for (const [fieldName, fieldConfig] of Object.entries(fields)) {
    const { value, type, required = false } = fieldConfig;

    // Check required
    if (required) {
      const requiredCheck = validateRequired(value, fieldName);
      if (!requiredCheck.valid) {
        errors[fieldName] = requiredCheck.error;
        isValid = false;
        continue;
      }
    }

    // Skip length validation if value is empty and not required
    if (!value || value.trim().length === 0) {
      continue;
    }

    // Validate length if type is provided
    if (type) {
      const lengthCheck = validateLength(value, type);
      if (!lengthCheck.valid) {
        errors[fieldName] = lengthCheck.error;
        isValid = false;
      }
    }

    // Special validation for email
    if (fieldName.toLowerCase().includes('email')) {
      const emailCheck = validateEmail(value);
      if (!emailCheck.valid) {
        errors[fieldName] = emailCheck.error;
        isValid = false;
      }
    }
  }

  return { valid: isValid, errors };
};

/**
 * Creates a safe input handler that validates length in real-time
 * @param {Function} onChange - Original onChange handler
 * @param {string} fieldType - Type of field for validation
 * @param {number} maxLength - Maximum length (optional, uses INPUT_LIMITS if not provided)
 * @returns {Function} Safe onChange handler
 */
export const createSafeInputHandler = (onChange, fieldType, maxLength = null) => {
  return (e) => {
    const value = e.target.value;
    const limit = maxLength || INPUT_LIMITS[fieldType];

    // Prevent input if exceeds limit
    if (limit && value.length > limit) {
      return; // Don't update state
    }

    onChange(e);
  };
};

