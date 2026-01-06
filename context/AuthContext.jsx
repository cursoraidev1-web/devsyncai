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

  const getCurrentUser = useCallback(async () => {
    if (!token) return null;
    try {
      const response = await authApi.getCurrentUser();
      const apiUser = response?.data || response;
      
      if (apiUser && apiUser.id) {
        setUser(apiUser);
        safeLocalStorage.setItem(USER_KEY, JSON.stringify(apiUser));
        return apiUser;
      }
      
      return null;
    } catch (error) {
      if (error.status === 401 || error?.response?.status === 401) {
        clearSession();
      }
      return null;
    }
  }, [token, clearSession]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = safeLocalStorage.getItem(TOKEN_KEY);
        const savedUser = safeLocalStorage.getItem(USER_KEY);
        
        if (savedToken && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setToken(savedToken);
            setUser(parsedUser);
            
            const fetchUser = async () => {
              try {
                const response = await authApi.getCurrentUser();
                const apiUser = response?.data || response;
                
                if (!apiUser || !apiUser.id) {
                  throw new Error('Invalid user data from API');
                }
                
                setUser(apiUser);
                safeLocalStorage.setItem(USER_KEY, JSON.stringify(apiUser));
              } catch (fetchError) {
                if (fetchError?.status === 401 || fetchError?.response?.status === 401) {
                  clearSession();
                  if (typeof window !== 'undefined') {
                    // Suppress any errors during redirect (telemetry, extensions, etc.)
                    try {
                      window.location.href = '/login';
                    } catch (redirectError) {
                      // Silently ignore redirect errors (telemetry, extensions, etc.)
                      // Force redirect using replace to avoid history issues
                      window.location.replace('/login');
                    }
                  }
                }
              }
            };
            
            const timeoutId = setTimeout(() => {
              if (loading) {
                setLoading(false);
              }
            }, 5000);
            
            await fetchUser();
            clearTimeout(timeoutId);
          } catch (parseError) {
            clearSession();
          }
        }
      } catch (error) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const persistSession = useCallback((userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    safeLocalStorage.setItem(USER_KEY, JSON.stringify(userData));
    safeLocalStorage.setItem(TOKEN_KEY, tokenData);
    
    // Also set cookie
    if (typeof document !== 'undefined') {
      document.cookie = `auth-token=${tokenData}; path=/; max-age=${7 * 24 * 60 * 60}`;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      const data = response?.data || response;

      // 2FA required: do not persist session yet
      if (data?.require2fa) {
        return { require2fa: true, email: data.email || email };
      }

      const apiUser = data?.user || data;
      const apiToken = data?.token || data?.accessToken;
      
      if (apiUser && apiToken) {
        persistSession(apiUser, apiToken);
        return apiUser;
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      throw error;
    }
  }, [persistSession]);

  const verify2FA = useCallback(async (email, token) => {
    try {
      const response = await authApi.verify2FA(email, token);
      const data = response?.data || response;
      const apiUser = data?.user || data;
      const apiToken = data?.token || data?.accessToken;

      if (apiUser && apiToken) {
        persistSession(apiUser, apiToken);
        return data;
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      throw error;
    }
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    try {
      const response = await authApi.register(payload);
      const data = response?.data || response;
      return data;
    } catch (error) {
      throw error;
    }
  }, []);

  const googleLogin = useCallback(async (accessToken) => {
    try {
      const response = await authApi.googleLogin(accessToken);
      const data = response?.data || response;
      const apiUser = data?.user || data;
      const apiToken = data?.token || data?.accessToken;
      
      if (apiUser && apiToken) {
        persistSession(apiUser, apiToken);
        return apiUser;
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      throw error;
    }
  }, [persistSession]);

  const githubLogin = useCallback(async (payload) => {
    try {
      const response = await authApi.githubLogin(payload);
      const data = response?.data || response;
      const apiUser = data?.user || data;
      const apiToken = data?.token || data?.accessToken;
      
      if (apiUser && apiToken) {
        persistSession(apiUser, apiToken);
        return apiUser;
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      throw error;
    }
  }, [persistSession]);

  const syncSupabaseSession = useCallback(async (session, companyName = null) => {
    try {
      const response = await authApi.syncSupabaseSession(session, companyName);
      const data = response?.data || response;
      
      // Check if 2FA is required (response format: { require2fa: true, email: string })
      if (data?.require2fa) {
        return { require2fa: true, email: data.email };
      }
      
      // Normal response with user and token
      const apiUser = data?.user || data;
      const apiToken = data?.token || data?.accessToken;
      
      if (apiUser && apiToken) {
        persistSession(apiUser, apiToken);
        return { user: apiUser, token: apiToken };
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      throw error;
    }
  }, [persistSession]);

  const logout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearSession();
      setLogoutLoading(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [clearSession]);

  const updateUser = useCallback((updates) => {
    const updatedUser = { ...user, ...updates };
    if (updates.is2FAEnabled !== undefined) {
      updatedUser.is2FAEnabled = updates.is2FAEnabled;
    }
    if (updates.themePreference !== undefined) {
      updatedUser.themePreference = updates.themePreference;
    }
    setUser(updatedUser);
    safeLocalStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, [user]);

  const updateProfile = useCallback(async (updates) => {
    try {
      const response = await authApi.updateProfile(updates);
      const updatedUser = response?.data?.user || response?.data || response;
      if (updatedUser) {
        updateUser(updatedUser);
      }
      return response;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }, [updateUser]);

  const changePassword = useCallback(async (currentPassword, newPassword, confirmPassword) => {
    try {
      return await authApi.changePassword({ currentPassword, newPassword, confirmPassword });
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }, []);

  const getActiveSessions = useCallback(async () => {
    try {
      return await authApi.getActiveSessions();
    } catch (error) {
      console.error('Failed to fetch active sessions:', error);
      throw error;
    }
  }, []);

  const setup2FA = useCallback(async () => {
    try {
      return await authApi.setup2FA();
    } catch (error) {
      console.error('Failed to setup 2FA:', error);
      throw error;
    }
  }, []);

  const enable2FA = useCallback(async (token) => {
    try {
      return await authApi.enable2FA(token);
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
      throw error;
    }
  }, []);

  const disable2FA = useCallback(async (token) => {
    try {
      return await authApi.disable2FA(token);
    } catch (error) {
      console.error('Failed to disable 2FA:', error);
      throw error;
    }
  }, []);

  const regenerateRecoveryCodes = useCallback(async (token) => {
    try {
      return await authApi.regenerateRecoveryCodes(token);
    } catch (error) {
      console.error('Failed to regenerate recovery codes:', error);
      throw error;
    }
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
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
    updateUser,
    updateProfile,
    changePassword,
    getActiveSessions,
    setup2FA,
    enable2FA,
    verify2FA,
    disable2FA,
    regenerateRecoveryCodes,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
