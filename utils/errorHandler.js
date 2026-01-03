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
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0]?.toString() || '';
    
    // Block requests to localhost telemetry services
    if (
      (url.includes('127.0.0.1') || url.includes('localhost')) &&
      (url.includes('/ingest/') || url.includes(':7245'))
    ) {
      // Silently reject - don't make the request at all
      return Promise.reject(new Error('Telemetry service blocked'));
    }
    
    // For other requests, catch and suppress telemetry errors
    return originalFetch.apply(this, args).catch((error) => {
      const errorMessage = error?.message || error?.toString() || '';
      
      // Suppress connection refused errors for telemetry
      if (
        (errorMessage.includes('ERR_CONNECTION_REFUSED') ||
         errorMessage.includes('Failed to fetch')) &&
        (url.includes('127.0.0.1') || url.includes('localhost') || url.includes('/ingest/'))
      ) {
        // Return a rejected promise that won't trigger error handlers
        return Promise.reject(new Error('Telemetry service unavailable'));
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
