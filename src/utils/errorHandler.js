/**
 * Error Handler Utility
 * Handles API errors with appropriate user-friendly messages
 */

/**
 * Handle API error and return user-friendly message
 * @param {Error} error - Error object from API call
 * @returns {Object} { message: string, type: string, retryAfter?: number, lockoutTime?: number }
 */
export const handleApiError = (error) => {
  const status = error?.status || error?.response?.status;
  const errorData = error?.data || error?.response?.data;
  const errorMessage = errorData?.error || errorData?.message || error?.message;

  switch (status) {
    case 423:
      // Account locked
      const lockoutMatch = errorMessage?.match(/try again in (\d+) minutes?/i) || 
                          errorMessage?.match(/locked for (\d+) minutes?/i);
      const lockoutTime = lockoutMatch ? parseInt(lockoutMatch[1], 10) : null;
      
      return {
        message: errorMessage || 'Account is locked due to too many failed login attempts',
        type: 'LOCKED',
        lockoutTime,
      };
    
    case 429:
      // Rate limit exceeded
      const retryAfter = errorData?.retryAfter || errorData?.retry_after;
      
      return {
        message: errorMessage || 'Too many requests. Please try again later.',
        type: 'RATE_LIMIT',
        retryAfter,
      };
    
    case 409:
      // Conflict (duplicate email, company name, etc.)
      return {
        message: errorMessage || 'This resource already exists',
        type: 'CONFLICT',
      };
    
    case 400:
      // Bad request (validation errors)
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        return {
          message: errorData.errors.join(', ') || 'Invalid request',
          type: 'VALIDATION',
          errors: errorData.errors,
        };
      }
      return {
        message: errorMessage || 'Invalid request',
        type: 'VALIDATION',
      };
    
    case 401:
      // Unauthorized
      return {
        message: errorMessage || 'Authentication required. Please log in.',
        type: 'UNAUTHORIZED',
      };
    
    case 403:
      // Forbidden
      if (errorMessage?.toLowerCase().includes('email') || 
          errorMessage?.toLowerCase().includes('verify')) {
        return {
          message: errorMessage || 'Please verify your email address before logging in',
          type: 'EMAIL_NOT_VERIFIED',
        };
      }
      return {
        message: errorMessage || 'Access denied. You do not have permission to perform this action.',
        type: 'FORBIDDEN',
      };
    
    case 404:
      // Not found
      return {
        message: errorMessage || 'Resource not found',
        type: 'NOT_FOUND',
      };
    
    case 500:
    case 502:
    case 503:
      // Server errors
      return {
        message: 'Server error. Please try again later.',
        type: 'SERVER_ERROR',
      };
    
    default:
      return {
        message: errorMessage || 'An unexpected error occurred',
        type: 'UNKNOWN',
      };
  }
};

/**
 * Format retry after time for display
 * @param {number} seconds - Seconds to wait
 * @returns {string} Formatted time string
 */
export const formatRetryAfter = (seconds) => {
  if (!seconds) return 'a moment';
  
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

/**
 * Format lockout time for display
 * @param {number} minutes - Minutes remaining
 * @returns {string} Formatted time string
 */
export const formatLockoutTime = (minutes) => {
  if (!minutes) return '30 minutes';
  
  if (minutes === 1) {
    return '1 minute';
  }
  
  return `${minutes} minutes`;
};

