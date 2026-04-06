import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../services/api/auth';
import logger from '../utils/logger';

const AuthContext = createContext(null);
const COOKIE_SESSION_TOKEN = 'cookie-session';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const persistSession = useCallback((userData, tokenData = COOKIE_SESSION_TOKEN) => {
    setUser(userData);
    setToken(tokenData || COOKIE_SESSION_TOKEN);
  }, []);

  const replaceSession = useCallback((userData, tokenData = COOKIE_SESSION_TOKEN) => {
    persistSession(userData, tokenData);
  }, [persistSession]);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await authApi.getCurrentUser();
      const apiUser = response?.data || response;

      if (!apiUser?.id) {
        clearSession();
        return null;
      }

      persistSession(apiUser);
      return apiUser;
    } catch (error) {
      if (error?.status === 401 || error?.response?.status === 401) {
        clearSession();
        return null;
      }
      throw error;
    }
  }, [clearSession, persistSession]);

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!cancelled && !currentUser) {
          clearSession();
        }
      } catch (error) {
        logger.error('Failed to initialize auth session:', error);
        if (!cancelled) {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, [clearSession, getCurrentUser]);

  const login = useCallback(async (email, password) => {
    const response = await authApi.login({ email, password });
    const data = response?.data || response;

    if (data?.require2fa) {
      return { require2fa: true, email: data.email || email };
    }

    const apiUser = data?.user || data;
    const apiToken = data?.token || data?.accessToken || COOKIE_SESSION_TOKEN;

    if (!apiUser?.id) {
      throw new Error('Invalid response from server');
    }

    persistSession(apiUser, apiToken);
    return data;
  }, [persistSession]);

  const verify2FA = useCallback(async (email, tokenValue) => {
    const response = await authApi.verify2FA(email, tokenValue);
    const data = response?.data || response;
    const apiUser = data?.user || data;
    const apiToken = data?.token || data?.accessToken || COOKIE_SESSION_TOKEN;

    if (!apiUser?.id) {
      throw new Error('Invalid response from server');
    }

    persistSession(apiUser, apiToken);
    return data;
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    const response = await authApi.register(payload);
    return response?.data || response;
  }, []);

  const googleLogin = useCallback(async (accessToken) => {
    const response = await authApi.googleLogin(accessToken);
    const data = response?.data || response;
    const apiUser = data?.user || data;

    if (!apiUser?.id) {
      throw new Error('Invalid response from server');
    }

    persistSession(apiUser, data?.token || data?.accessToken || COOKIE_SESSION_TOKEN);
    return data;
  }, [persistSession]);

  const githubLogin = useCallback(async (payload) => {
    const response = await authApi.githubLogin(payload);
    const data = response?.data || response;
    const apiUser = data?.user || data;

    if (!apiUser?.id) {
      throw new Error('Invalid response from server');
    }

    persistSession(apiUser, data?.token || data?.accessToken || COOKIE_SESSION_TOKEN);
    return data;
  }, [persistSession]);

  const syncSupabaseSession = useCallback(async (session, companyName = null) => {
    const response = await authApi.syncSupabaseSession(session, companyName);
    const data = response?.data || response;

    if (data?.require2fa) {
      return { require2fa: true, email: data.email };
    }

    const apiUser = data?.user || data;
    const apiToken = data?.token || data?.accessToken || COOKIE_SESSION_TOKEN;

    if (!apiUser?.id) {
      throw new Error('Invalid response from server');
    }

    persistSession(apiUser, apiToken);
    return { user: apiUser, token: apiToken };
  }, [persistSession]);

  const logout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      logger.error('Logout error:', error);
    } finally {
      clearSession();
      setLogoutLoading(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [clearSession]);

  const updateUser = useCallback((updates) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const updatedUser = { ...currentUser, ...updates };
      if (updates.is2FAEnabled !== undefined) {
        updatedUser.is2FAEnabled = updates.is2FAEnabled;
      }
      if (updates.themePreference !== undefined) {
        updatedUser.themePreference = updates.themePreference;
      }
      return updatedUser;
    });
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      const response = await authApi.updateProfile(updates);
      const updatedUser = response?.data?.user || response?.data || response;
      if (updatedUser) {
        updateUser(updatedUser);
      }
      return response;
    } catch (error) {
      logger.error('Failed to update profile:', error);
      throw error;
    }
  }, [updateUser]);

  const changePassword = useCallback(async (currentPassword, newPassword, confirmPassword) => {
    try {
      return await authApi.changePassword({ currentPassword, newPassword, confirmPassword });
    } catch (error) {
      logger.error('Failed to change password:', error);
      throw error;
    }
  }, []);

  const getActiveSessions = useCallback(async () => {
    try {
      return await authApi.getActiveSessions();
    } catch (error) {
      logger.error('Failed to fetch active sessions:', error);
      throw error;
    }
  }, []);

  const setup2FA = useCallback(async () => {
    try {
      return await authApi.setup2FA();
    } catch (error) {
      logger.error('Failed to setup 2FA:', error);
      throw error;
    }
  }, []);

  const enable2FA = useCallback(async (tokenValue) => {
    try {
      return await authApi.enable2FA(tokenValue);
    } catch (error) {
      logger.error('Failed to enable 2FA:', error);
      throw error;
    }
  }, []);

  const disable2FA = useCallback(async (tokenValue) => {
    try {
      return await authApi.disable2FA(tokenValue);
    } catch (error) {
      logger.error('Failed to disable 2FA:', error);
      throw error;
    }
  }, []);

  const regenerateRecoveryCodes = useCallback(async (tokenValue) => {
    try {
      return await authApi.regenerateRecoveryCodes(tokenValue);
    } catch (error) {
      logger.error('Failed to regenerate recovery codes:', error);
      throw error;
    }
  }, []);

  const isAuthenticated = !!user;

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated,
    logout,
    logoutLoading,
    login,
    register,
    googleLogin,
    githubLogin,
    syncSupabaseSession,
    replaceSession,
    updateUser,
    updateProfile,
    changePassword,
    getActiveSessions,
    setup2FA,
    enable2FA,
    verify2FA,
    disable2FA,
    regenerateRecoveryCodes,
    refreshUser: getCurrentUser,
    clearSession,
  }), [
    user,
    token,
    loading,
    isAuthenticated,
    logout,
    logoutLoading,
    login,
    register,
    googleLogin,
    githubLogin,
    syncSupabaseSession,
    replaceSession,
    updateUser,
    updateProfile,
    changePassword,
    getActiveSessions,
    setup2FA,
    enable2FA,
    verify2FA,
    disable2FA,
    regenerateRecoveryCodes,
    getCurrentUser,
    clearSession,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
