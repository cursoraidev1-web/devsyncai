// Base URL from environment variable (REACT_APP_API_URL should include /api/v1)
// If not set, assume it's just the base URL and we'll add /api/v1 prefix
const ENV_BASE_URL = process.env.REACT_APP_API_URL || '';
// If ENV_BASE_URL already includes /api/v1, use it as-is, otherwise add the prefix
const BASE_URL = ENV_BASE_URL.includes('/api/v1') ? ENV_BASE_URL : `${ENV_BASE_URL}/api/v1`;

let upgradeHandler = null;

export const setUpgradeHandler = (handler) => {
  upgradeHandler = handler;
};

const shouldTriggerUpgrade = (message) => {
  if (!message) return false;
  const lower = message.toLowerCase();
  return lower.includes('plan limit reached') || lower.includes('upgrade');
};

const getAuthHeader = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('zyndrx_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handle401 = () => {
  // Clear token and user data
  localStorage.removeItem('zyndrx_token');
  localStorage.removeItem('zyndrx_user');
  // Redirect to login if we're in the browser
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  
  // Check if response has success: false even with 200 status
  if (data && typeof data === 'object' && data.success === false) {
    const errorMessage = data.error || data.message || 'Request failed';
    console.error('API Error (success: false):', {
      status: res.status,
      message: errorMessage,
      path: res.url,
      data
    });
    
    const error = new Error(errorMessage);
    error.status = res.status || 400;
    error.data = data;
    throw error;
  }
  
  if (!res.ok) {
    // Handle 401 Unauthorized - redirect to login
    if (res.status === 401) {
      handle401();
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
    
    // Log error for debugging
    console.error('API Error:', {
      status: res.status,
      message,
      path: res.url,
      data
    });
    
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

export const apiRequest = async (path, { method = 'GET', body, headers = {}, auth = true } = {}) => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${BASE_URL}${normalizedPath}`;
  
  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(auth ? getAuthHeader() : {})
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
    return handleResponse(res);
  } catch (error) {
    // Handle network errors
    console.error('Network Error:', error);
    throw new Error('Network error. Please check your connection and try again.');
  }
};

export const api = {
  get: (path, options = {}) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body }),
  patch: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PATCH', body }),
  put: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PUT', body }),
  delete: (path, options = {}) => apiRequest(path, { ...options, method: 'DELETE' }),
};


