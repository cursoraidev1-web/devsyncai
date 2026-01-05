/**
 * Global error handler to suppress harmless telemetry/analytics errors
 * These errors are typically from browser extensions or dev tools trying to
 * connect to local telemetry services that aren't running
 * 
 * This handler intercepts fetch requests and prevents them from being made
 * to known telemetry endpoints to avoid spam errors
 */

if (typeof window !== 'undefined') {
  // Intercept fetch requests to prevent telemetry calls
  // Do this IMMEDIATELY before anything else can use fetch
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0]?.toString() || '';
    
    // Block requests to localhost telemetry services - be very aggressive
    if (
      url.includes('127.0.0.1:7245') ||
      url.includes('localhost:7245') ||
      (url.includes('127.0.0.1') && url.includes('/ingest/')) ||
      (url.includes('localhost') && url.includes('/ingest/')) ||
      url.includes(':7245/ingest/')
    ) {
      // Silently reject - don't make the request at all
      // Return a promise that resolves to nothing to prevent errors
      return Promise.resolve(new Response(null, { status: 200, statusText: 'OK' }));
    }
    
    // For other requests, catch and suppress telemetry errors
    return originalFetch.apply(this, args).catch((error) => {
      const errorMessage = error?.message || error?.toString() || '';
      
      // Suppress connection refused errors for telemetry
      if (
        (errorMessage.includes('ERR_CONNECTION_REFUSED') ||
         errorMessage.includes('Failed to fetch') ||
         errorMessage.includes('NetworkError')) &&
        (url.includes('127.0.0.1') || url.includes('localhost') || url.includes('/ingest/') || url.includes(':7245'))
      ) {
        // Return a successful response to prevent error propagation
        return Promise.resolve(new Response(null, { status: 200, statusText: 'OK' }));
      }
      
      // Re-throw other errors
      throw error;
    });
  };

  // Suppress unhandled promise rejections from telemetry services
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const errorMessage = error?.message || error?.toString() || '';
    const errorStack = error?.stack || '';

    // Check if it's a telemetry/analytics connection error
    if (
      (errorMessage.includes('ERR_CONNECTION_REFUSED') ||
       errorMessage.includes('Failed to fetch') ||
       errorMessage.includes('NetworkError') ||
       errorMessage.includes('Telemetry')) &&
      (errorStack.includes('127.0.0.1') ||
       errorStack.includes('localhost') ||
       errorStack.includes('/ingest/') ||
       errorMessage.includes('/ingest/') ||
       errorMessage.includes(':7245'))
    ) {
      // Suppress the error - prevent it from showing in console
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }, true); // Use capture phase to catch early

  // Suppress console errors for these specific cases
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Suppress telemetry connection errors in console
    if (
      (message.includes('ERR_CONNECTION_REFUSED') ||
       message.includes('Failed to fetch')) &&
      (message.includes('127.0.0.1') || 
       message.includes('/ingest/') ||
       message.includes(':7245'))
    ) {
      // Suppress - don't log
      return;
    }
    
    // Call original console.error for other errors
    originalConsoleError.apply(console, args);
  };

  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Suppress telemetry warnings too
    if (
      message.includes('127.0.0.1') &&
      (message.includes('/ingest/') || message.includes(':7245'))
    ) {
      return;
    }
    
    originalConsoleWarn.apply(console, args);
  };
}

/**
 * Handles API errors and returns a standardized error info object
 * @param {Error|any} error - The error object from API calls
 * @returns {Object} Error info with message, type, and additional metadata
 */
export const handleApiError = (error) => {
  // Default error info
  const errorInfo = {
    message: 'An unexpected error occurred. Please try again.',
    type: 'UNKNOWN',
  };

  // Extract status code from various error formats
  const status = error?.status || 
                 error?.statusCode || 
                 error?.response?.status || 
                 error?.data?.statusCode ||
                 (error?.data?.error?.statusCode);

  // Extract error data from various formats
  const errorData = error?.data || 
                    error?.response?.data || 
                    error?.error?.data ||
                    {};

  // Extract error message from various formats
  let message = error?.message || 
                errorData?.error || 
                errorData?.message || 
                error?.errorMessage ||
                error?.error?.message ||
                errorInfo.message;

  // Ensure message is a string
  if (Array.isArray(message)) {
    message = message.join(', ');
  }
  message = String(message || '');

  // Determine error type based on status code and message
  const messageLower = message.toLowerCase();
  if (status === 423 || messageLower.includes('locked') || messageLower.includes('lockout')) {
    errorInfo.type = 'LOCKED';
    errorInfo.lockoutTime = errorData?.lockoutTime || 
                           errorData?.lockout_time || 
                           errorData?.retryAfter ||
                           30; // Default 30 seconds
    errorInfo.message = message || 'Your account has been temporarily locked due to too many failed login attempts. Please try again later.';
  } else if (status === 429 || messageLower.includes('rate limit') || messageLower.includes('too many requests')) {
    errorInfo.type = 'RATE_LIMIT';
    errorInfo.retryAfter = errorData?.retryAfter || 
                          errorData?.retry_after || 
                          errorData?.retryAfterSeconds ||
                          60; // Default 60 seconds
    errorInfo.message = message || 'Too many requests. Please try again later.';
  } else if (status === 403) {
    // Check if it's email verification issue
    if (messageLower.includes('email') && (messageLower.includes('verify') || messageLower.includes('verification') || messageLower.includes('not verified'))) {
      errorInfo.type = 'EMAIL_NOT_VERIFIED';
      errorInfo.message = message || 'Please verify your email address before logging in.';
    } else {
      errorInfo.type = 'FORBIDDEN';
      errorInfo.message = message || 'You do not have permission to perform this action.';
    }
  } else if (status === 401) {
    errorInfo.type = 'UNAUTHORIZED';
    errorInfo.message = message || 'Authentication failed. Please check your credentials.';
  } else if (status === 404) {
    errorInfo.type = 'NOT_FOUND';
    errorInfo.message = message || 'The requested resource was not found.';
  } else if (status === 409) {
    errorInfo.type = 'CONFLICT';
    errorInfo.message = message || 'A resource with this information already exists.';
  } else if (status === 400) {
    errorInfo.type = 'BAD_REQUEST';
    errorInfo.message = message || 'Invalid request. Please check your input.';
  } else if (status === 500 || status === 502 || status === 503) {
    errorInfo.type = 'SERVER_ERROR';
    errorInfo.message = message || 'Server error. Please try again later.';
  } else if (messageLower.includes('network') || messageLower.includes('fetch')) {
    errorInfo.type = 'NETWORK_ERROR';
    errorInfo.message = 'Network error. Please check your connection and try again.';
  } else {
    // Use the extracted message or default
    errorInfo.message = message || errorInfo.message;
  }

  return errorInfo;
};
