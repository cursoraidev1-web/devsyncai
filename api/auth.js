import { api } from './client';

export const login = (credentials) => api.post('/auth/login', credentials, { auth: false });

export const register = (payload) => {
  // Ensure fullName is sent (combine firstName + lastName if needed)
  const registerPayload = { ...payload };
  if (payload.firstName && payload.lastName && !payload.fullName) {
    registerPayload.fullName = `${payload.firstName} ${payload.lastName}`;
    delete registerPayload.firstName;
    delete registerPayload.lastName;
  }
  // If name is provided instead of fullName, rename it
  if (payload.name && !payload.fullName) {
    registerPayload.fullName = payload.name;
    delete registerPayload.name;
  }
  // Send workspaceName as companyName to backend (only if no invitation token)
  if (payload.workspaceName && !payload.invitationToken) {
    registerPayload.companyName = payload.workspaceName;
    delete registerPayload.workspaceName;
  }
  // If invitationToken is provided, don't send companyName
  if (payload.invitationToken) {
    registerPayload.invitationToken = payload.invitationToken;
    delete registerPayload.companyName;
    delete registerPayload.workspaceName;
  }
  return api.post('/auth/register', registerPayload, { auth: false });
};

/**
 * Resend email verification
 * @param {string} email - User email
 */
export const resendVerificationEmail = (email) => {
  return api.post('/auth/resend-verification', { email }, { auth: false });
};

export const googleLogin = (accessToken) => api.post('/auth/google', { accessToken }, { auth: false });

export const googleLoginWithCode = (code, redirectUri) => api.post('/auth/google', { code, redirect_uri: redirectUri }, { auth: false });

export const githubLogin = (payload) => api.post('/auth/github', payload, { auth: false });

export const forgotPassword = (payload) => api.post('/auth/forgot-password', payload, { auth: false });

export const resetPassword = (payload) => {
  // API expects accessToken, not token
  const resetPayload = {
    password: payload.password,
    accessToken: payload.accessToken || payload.token
  };
  return api.post('/auth/reset-password', resetPayload, { auth: false });
};

export const getCurrentUser = () => api.get('/auth/me');

export const updateProfile = (updates) => api.put('/auth/profile', updates);

export const logout = () => api.post('/auth/logout');

export const setup2FA = () => api.post('/auth/2fa/setup');

export const enable2FA = (token) => api.post('/auth/2fa/enable', { token });

export const verify2FA = (email, token) => api.post('/auth/2fa/verify', { email, token }, { auth: false });

// Company/Workspace Management
export const getUserCompanies = () => api.get('/auth/companies');
export const switchCompany = (companyId) => api.post('/auth/switch-company', { companyId });
export const createCompany = (payload) => api.post('/companies', payload);
export const getCompany = (id) => api.get(`/companies/${id}`);

/**
 * Exchange Supabase OAuth session token for backend JWT token
 * This sends the Supabase access token to the backend to create/update user
 * @param {Object} session - Supabase session object
 * @param {string} companyName - Optional company name for new user signups
 * @returns {Promise} Backend response with user and token
 */
export const syncSupabaseSession = (session, companyName = null) => {
  if (!session?.access_token) {
    throw new Error('Invalid Supabase session: missing access_token');
  }
  
  // Send Supabase access token to backend
  // Backend will verify with Supabase and create/update user in database
  // Using the endpoint specified in the OAuth guide: /auth/oauth/session
  const payload = {
    accessToken: session.access_token, // Use camelCase as per guide
  };
  
  // Add companyName if provided (for new signups)
  if (companyName) {
    payload.companyName = companyName;
  }
  
  return api.post('/auth/oauth/session', payload, { auth: false });
};


