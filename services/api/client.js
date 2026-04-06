// Base URL from environment variable (NEXT_PUBLIC_API_URL should include /api/v1)
// If not set in development, use relative URL to leverage proxy in next.config.js
// In production, set NEXT_PUBLIC_API_URL to your backend URL
const ENV_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
let BASE_URL;

if (ENV_BASE_URL) {
  // If API URL is set, use it (production or custom dev setup)
  BASE_URL = ENV_BASE_URL.includes('/api/v1') ? ENV_BASE_URL : `${ENV_BASE_URL}/api/v1`;
} else {
  // If no API URL set, use relative URL (will use proxy in package.json for development)
  BASE_URL = '/api/v1';
}

let upgradeHandler = null;

export const setUpgradeHandler = (handler) => {
  upgradeHandler = handler;
};

const shouldTriggerUpgrade = (message) => {
  if (!message) return false;
  const lower = message.toLowerCase();
  return lower.includes('plan limit reached') || lower.includes('upgrade');
};

const handle401 = () => {
  // Redirect to login if we're in the browser
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    const nextUrl = `/login?returnTo=${encodeURIComponent(currentUrl)}`;
    window.location.href = nextUrl;
  }
};

const handleResponse = async (res, { redirectOn401 = true } = {}) => {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  
  // Check if response has success: false even with 200 status
  if (data && typeof data === 'object' && data.success === false) {
    const errorMessage = data.error || data.message || 'Request failed';
    
    const error = new Error(errorMessage);
    error.status = res.status || 400;
    error.data = data;
    throw error;
  }
  
  if (!res.ok) {
    // Handle 401 Unauthorized - redirect to login
    if (res.status === 401 && redirectOn401) {
      handle401();
    }
    
    // Handle 429 Too Many Requests - special handling
    if (res.status === 429) {
      const error = new Error('Too many requests, please try again later');
      error.status = 429;
      error.data = data;
      error.retryAfter = res.headers.get('Retry-After') || 5; // Default 5 seconds
      throw error;
    }
    
    // Extract error message from various response formats
    let message = 'Request failed';
    if (typeof data === 'string') {
      message = data;
    } else if (data && typeof data === 'object') {
      // Try different error message fields
      message = data.error || data.message || data.errorMessage || data.msg || message;
      // If it's an array of errors, join them
      if (Array.isArray(data.errors)) {
        message = data.errors.join(', ');
      }
    }
    
    if (upgradeHandler && shouldTriggerUpgrade(message)) {
      upgradeHandler(message);
    }
    
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const apiRequest = async (path, { method = 'GET', body, headers = {}, auth = true, redirectOn401 = true } = {}) => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${BASE_URL}${normalizedPath}`;
  
  const init = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    }
  };

  if (body !== undefined) {
    // Handle FormData for file uploads
    if (body instanceof FormData) {
      // Remove Content-Type header to let browser set it with boundary
      delete init.headers['Content-Type'];
      init.body = body;
    } else if (typeof body === 'string') {
      init.body = body;
    } else {
      init.body = JSON.stringify(body);
    }
  }

  try {
    const res = await fetch(url, init);
    return handleResponse(res, { redirectOn401 });
  } catch (error) {
    if (error?.status || error?.data) {
      throw error;
    }

    const networkError = new Error('Network error. Please check your connection and try again.');
    networkError.cause = error;
    throw networkError;
  }
};

export const api = {
  get: (path, options = {}) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body }),
  patch: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PATCH', body }),
  put: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PUT', body }),
  delete: (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' }),
};

