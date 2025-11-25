import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('zyndrx_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // Mock login - in production, this would call your backend API
    const mockUser = {
      id: Date.now(),
      email,
      role: role || 'developer',
      name: email.split('@')[0],
      avatar: `https://ui-avatars.com/api/?name=${email}&background=4f46e5&color=fff`
    };
    
    setUser(mockUser);
    localStorage.setItem('zyndrx_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const register = (name, email, password, role) => {
    // Mock registration
    const mockUser = {
      id: Date.now(),
      name,
      email,
      role: role || 'developer',
      avatar: `https://ui-avatars.com/api/?name=${name}&background=4f46e5&color=fff`
    };
    
    setUser(mockUser);
    localStorage.setItem('zyndrx_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zyndrx_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('zyndrx_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
