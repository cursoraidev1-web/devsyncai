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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
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
        localStorage.setItem(USER_KEY, JSON.stringify(apiUser));
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
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      // Fetch fresh user data from API
      const fetchUser = async () => {
        const response = await authApi.getCurrentUser();
        // Handle spec format: { success, data: { user }, message }
        const apiUser = response?.data || response;
        if (apiUser) {
          setUser(apiUser);
          localStorage.setItem(USER_KEY, JSON.stringify(apiUser));
        }
      };
      fetchUser().catch(() => {
        // Silently fail on initial load
      });
    }
    setLoading(false);
  }, []);

  const persistSession = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_KEY, nextToken);
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
        localStorage.setItem('zyndrx_companies', JSON.stringify(companies));
      }
      if (currentCompany) {
        localStorage.setItem('zyndrx_company', currentCompany.id);
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
      const updatedUser = await authApi.updateProfile(updates);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }
      return updatedUser;
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
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    login,
    register,
    googleLogin,
    googleLoginWithCode,
    githubLogin,
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
