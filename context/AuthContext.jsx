import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const TOKEN_KEY = 'zyndrx_token';
const USER_KEY = 'zyndrx_user';

// Safe localStorage access (handles SSR and Edge Runtime)
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('safeLocalStorage.getItem error:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('safeLocalStorage.setItem error:', error);
    }
  },
  removeItem: (key) => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('safeLocalStorage.removeItem error:', error);
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    safeLocalStorage.removeItem(USER_KEY);
    safeLocalStorage.removeItem(TOKEN_KEY);
    
    // Also clear cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'auth-token=; path=/; max-age=0';
    }
  }, []);

  /**
   * Fetches current user data from API
   * Used to refresh user data or validate session
   * @returns {Promise<Object|null>} User object or null if fetch fails
   */
  const getCurrentUser = useCallback(async () => {
    if (!token) return null;
    try {
      const response = await authApi.getCurrentUser();
      const apiUser = response?.data || response;
      
      // EDGE-002 FIX: Validate user data
      if (apiUser && apiUser.id) {
        setUser(apiUser);
        safeLocalStorage.setItem(USER_KEY, JSON.stringify(apiUser));
        return apiUser;
      }
      
      return null;
    } catch (error) {
      // If 401, clear session (token is invalid)
      if (error.status === 401 || error?.response?.status === 401) {
        clearSession();
      }
      return null;
    }
  }, [token, clearSession]);

  useEffect(() => {
    /**
     * Initialize authentication state from localStorage
     * EDGE-002 FIX: Handles null users and invalid tokens gracefully
     * JOURNEY-001 FIX: Validates token and clears invalid sessions
     */
    const initializeAuth = async () => {
      try {
        const storedUser = safeLocalStorage.getItem(USER_KEY);
        const storedToken = safeLocalStorage.getItem(TOKEN_KEY);
        
        if (storedUser && storedUser !== 'undefined' && storedToken) {
          try {
            const parsedUser = JSON.parse(storedUser);
            
            // EDGE-002 FIX: Validate parsed user object
            if (!parsedUser || typeof parsedUser !== 'object' || !parsedUser.id) {
              throw new Error('Invalid user data structure');
            }
            
            setUser(parsedUser);
            setToken(storedToken);
            
            // Fetch fresh user data from API to validate token
            const fetchUser = async () => {
              try {
                const response = await authApi.getCurrentUser();
                const apiUser = response?.data || response;
                
                // EDGE-002 FIX: Validate API response
                if (!apiUser || !apiUser.id) {
                  throw new Error('Invalid user data from API');
                }
                
                setUser(apiUser);
                safeLocalStorage.setItem(USER_KEY, JSON.stringify(apiUser));
              } catch (fetchError) {
                // JOURNEY-001 FIX: If token is invalid (401), clear session
                if (fetchError?.status === 401 || fetchError?.response?.status === 401) {
                  clearSession();
                  if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                  }
                }
                // For other errors, keep existing user data but log silently
              }
            };
            
            // Set timeout to prevent indefinite loading
            const timeoutId = setTimeout(() => {
              if (loading) {
                setLoading(false);
              }
            }, 5000);
            
            await fetchUser();
            clearTimeout(timeoutId);
          } catch (parseError) {
            // Clear invalid data
            clearSession();
          }
        }
      } catch (error) {
        // Clear any corrupted data
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Persists user session to state and storage
   * @param {Object} nextUser - User object to persist
   * @param {string} nextToken - Auth token to persist
   * @throws {Error} If user or token is invalid
   */
  const persistSession = (nextUser, nextToken) => {
    // EDGE-002 FIX: Validate user and token before persisting
    if (!nextUser || typeof nextUser !== 'object' || !nextUser.id) {
      throw new Error('Invalid user data: user object is required with an id');
    }
    
    if (!nextToken || typeof nextToken !== 'string' || nextToken.trim().length === 0) {
      throw new Error('Invalid token: token must be a non-empty string');
    }
    
    setUser(nextUser);
    setToken(nextToken);
    safeLocalStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    safeLocalStorage.setItem(TOKEN_KEY, nextToken);
    
    // Also set cookie for middleware to detect authentication
    if (typeof document !== 'undefined') {
      document.cookie = `auth-token=${nextToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
  };

  /**
   * Authenticates user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object|{require2fa: boolean, email: string}>} User object or 2FA requirement
   * @throws {Error} If login fails or response is invalid
   */
  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    
    // Handle spec format: { success, data: { user, token }, message }
    const data = response?.data || response;
    const { token: apiToken, user: apiUser, require2fa, companies, currentCompany } = data || {};
    
    if (require2fa) {
      return { require2fa: true, email };
    }
    
    // EDGE-002 FIX: Validate response before persisting
    if (!apiToken || !apiUser) {
      throw new Error('Invalid login response: missing token or user data');
    }
    
    // Additional validation: ensure user has required fields
    if (!apiUser.id || !apiUser.email) {
      throw new Error('Invalid user data: missing required fields');
    }
    
    persistSession(apiUser, apiToken);
    
    // Store company info if provided
    if (companies && companies.length > 0) {
      safeLocalStorage.setItem('zyndrx_companies', JSON.stringify(companies));
    }
    if (currentCompany) {
      safeLocalStorage.setItem('zyndrx_company', currentCompany.id);
    }
    
    return apiUser;
  };

  /**
   * Registers a new user
   * @param {Object} payload - Registration data
   * @returns {Promise<Object|null>} User object if auto-login succeeds, null otherwise
   * @throws {Error} If registration fails
   */
  const register = async (payload) => {
    try {
      const response = await authApi.register(payload);
      
      // Handle spec format: { success, data: { user, token, companies, currentCompany }, message }
      const data = response?.data || response;
      const { token: apiToken, user: apiUser, companies, currentCompany } = data || {};
      
      // EDGE-002 FIX: Validate response
      if (!apiUser || !apiToken) {
        // Registration might have succeeded but auto-login failed
        // Return null to allow manual login
        return null;
      }
      
      // Validate user object
      if (!apiUser.id || !apiUser.email) {
        throw new Error('Invalid user data received from registration');
      }
      
      // Store companies and current company if provided
      if (companies) {
        safeLocalStorage.setItem('zyndrx_companies', JSON.stringify(companies));
      }
      if (currentCompany) {
        safeLocalStorage.setItem('zyndrx_company', currentCompany.id);
      }
      
      persistSession(apiUser, apiToken);
      return apiUser;
    } catch (error) {
      // Re-throw the error so the component can handle it
      throw error;
    }
  };

  const googleLogin = async (accessToken) => {
    const response = await authApi.googleLogin(accessToken);
    // Handle spec format: { success, data: { user, token }, message }
    const data = response?.data || response;
    const { token: apiToken, user: apiUser, require2fa } = data || {};
    if (require2fa) {
      return { require2fa: true, email: apiUser?.email };
    }
    if (apiUser && apiToken) {
      persistSession(apiUser, apiToken);
    }
    return apiUser;
  };

  const googleLoginWithCode = async (code, redirectUri) => {
    const response = await authApi.googleLoginWithCode(code, redirectUri);
    // Handle spec format: { success, data: { user, token }, message }
    const data = response?.data || response;
    const { token: apiToken, user: apiUser, require2fa } = data || {};
    if (require2fa) {
      return { require2fa: true, email: apiUser?.email };
    }
    if (apiUser && apiToken) {
      persistSession(apiUser, apiToken);
    }
    return apiUser;
  };

  const githubLogin = async (accessToken) => {
    const data = await authApi.githubLogin({ accessToken });
    const { token: apiToken, user: apiUser, require2fa } = data || {};
    if (require2fa) {
      return { require2fa: true, email: apiUser?.email };
    }
    if (apiUser && apiToken) {
      persistSession(apiUser, apiToken);
    }
    return apiUser;
  };

  /**
   * Sync Supabase session with backend
   * This is called after Supabase OAuth completes
   * Exchanges Supabase access token for backend JWT token
   * @param {Object} session - Supabase session object
   * @param {string} companyName - Optional company name for new signups
   * @returns {Promise} User object or { require2fa: true, email: string } if 2FA required
   */
  const syncSupabaseSession = async (session, companyName = null) => {
    try {
      const response = await authApi.syncSupabaseSession(session, companyName);
      // Handle spec format: { success, data: { user, token, companies, currentCompany }, message }
      // Or 2FA format: { success, data: { require2fa: true, email: string } }
      const data = response?.data || response;
      
      // Check if 2FA is required
      if (data?.require2fa) {
        return { require2fa: true, email: data.email };
      }
      
      const { token: apiToken, user: apiUser, companies, currentCompany, companyId } = data || {};
      
      if (apiUser && apiToken) {
        // Store companies and current company if provided
        if (companies) {
          safeLocalStorage.setItem('zyndrx_companies', JSON.stringify(companies));
        }
        if (currentCompany) {
          safeLocalStorage.setItem('zyndrx_company', currentCompany.id);
        } else if (companyId) {
          safeLocalStorage.setItem('zyndrx_company', companyId);
        }
        
        persistSession(apiUser, apiToken);
      }
      
      return apiUser;
    } catch (error) {
      console.error('Failed to sync Supabase session:', error);
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    return authApi.forgotPassword({ email });
  };

  const resetPassword = async ({ token: resetToken, password, accessToken }) => {
    return authApi.resetPassword({ 
      accessToken: accessToken || resetToken, 
      password 
    });
  };

  const updateProfile = async (updates) => {
    try {
      const response = await authApi.updateProfile(updates);
      // Handle response format: { success: true, data: { user } } or direct user object
      const updatedUser = response?.data?.user || response?.data || response;
      if (updatedUser) {
        setUser(updatedUser);
        safeLocalStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }
      return response; // Return full response so component can handle it
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authApi.changePassword({ currentPassword, newPassword });
      return response;
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  };

  const getActiveSessions = async () => {
    try {
      const response = await authApi.getActiveSessions();
      const sessionsData = response?.data || (Array.isArray(response) ? response : []);
      return Array.isArray(sessionsData) ? sessionsData : [];
    } catch (error) {
      console.error('Failed to fetch active sessions:', error);
      throw error;
    }
  };

  const setup2FA = async () => {
    try {
      return await authApi.setup2FA();
    } catch (error) {
      console.error('Failed to setup 2FA:', error);
      throw error;
    }
  };

  const enable2FA = async (token) => {
    try {
      return await authApi.enable2FA(token);
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
      throw error;
    }
  };

  const verify2FA = async (email, token) => {
    try {
      const data = await authApi.verify2FA(email, token);
      const { token: apiToken, user: apiUser } = data || {};
      if (apiUser && apiToken) {
        persistSession(apiUser, apiToken);
      }
      return apiUser;
    } catch (error) {
      console.error('Failed to verify 2FA:', error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      // Call logout API before clearing session
      if (token) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    } finally {
      clearSession();
      setLogoutLoading(false);
    }
  }, [token, clearSession]);

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    safeLocalStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    login,
    register,
    googleLogin,
    googleLoginWithCode,
    githubLogin,
    syncSupabaseSession,
    requestPasswordReset,
    resetPassword,
    logout,
    updateUser,
    updateProfile,
    changePassword,
    getActiveSessions,
    getCurrentUser,
    setup2FA,
    enable2FA,
    verify2FA,
    loading,
    logoutLoading,
    isAuthenticated: !!user && !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
