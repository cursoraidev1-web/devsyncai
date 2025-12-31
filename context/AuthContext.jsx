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
      return safeLocalStorage.getItem(key);
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
      safeLocalStorage.setItem(key, value);
    } catch (error) {
      console.error('safeLocalStorage.setItem error:', error);
    }
  },
  removeItem: (key) => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      safeLocalStorage.removeItem(key);
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
  }, []);

  // Fetch current user on mount if token exists
  const getCurrentUser = useCallback(async () => {
    if (!token) return null;
    try {
      const response = await authApi.getCurrentUser();
      // Handle spec format: { success, data: { user }, message }
      const apiUser = response?.data || response;
      if (apiUser) {
        setUser(apiUser);
        safeLocalStorage.setItem(USER_KEY, JSON.stringify(apiUser));
      }
      return apiUser;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // If 401, clear session
      if (error.status === 401) {
        clearSession();
      }
      return null;
    }
  }, [token, clearSession]);

  useEffect(() => {
    try {
      const storedUser = safeLocalStorage.getItem(USER_KEY);
      const storedToken = safeLocalStorage.getItem(TOKEN_KEY);
      
      if (storedUser && storedUser !== 'undefined' && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          
          // Fetch fresh user data from API
          const fetchUser = async () => {
            const response = await authApi.getCurrentUser();
            // Handle spec format: { success, data: { user }, message }
            const apiUser = response?.data || response;
            if (apiUser) {
              setUser(apiUser);
              safeLocalStorage.setItem(USER_KEY, JSON.stringify(apiUser));
            }
          };
          fetchUser().catch(() => {
            // Silently fail on initial load
          });
        } catch (parseError) {
          console.error('Failed to parse stored user data:', parseError);
          // Clear invalid data
          safeLocalStorage.removeItem(USER_KEY);
          safeLocalStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    
    setLoading(false);
  }, []);

  const persistSession = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    safeLocalStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    safeLocalStorage.setItem(TOKEN_KEY, nextToken);
  };

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    // Handle spec format: { success, data: { user, token }, message }
    const data = response?.data || response;
    const { token: apiToken, user: apiUser, require2fa } = data || {};
    if (require2fa) {
      return { require2fa: true, email };
    }
    persistSession(apiUser, apiToken);
    return apiUser;
  };

  const register = async (payload) => {
    try {
      console.log('Registering with payload:', { ...payload, password: '***' });
      const response = await authApi.register(payload);
      console.log('Registration API response:', response);
      
      // Handle spec format: { success, data: { user, token, companies, currentCompany }, message }
      // Or direct format: { user, token }
      const data = response?.data || response;
      console.log('Extracted data:', data);
      
      const { token: apiToken, user: apiUser, companies, currentCompany } = data || {};
      console.log('Extracted user and token:', { hasUser: !!apiUser, hasToken: !!apiToken });
      
      if (!apiUser || !apiToken) {
        console.error('Registration response missing user or token:', { response, data });
        // Don't throw error - registration might have succeeded, just can't auto-login
        // User can manually log in
        return null;
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
      console.error('Registration error:', error);
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
