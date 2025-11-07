/**
 * Authentication Context
 * Manages user authentication state and role-based access
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'product-owner' | 'product-manager' | 'developer' | 'qa-engineer' | 'designer' | 'devops' | 'security';
  department: string;
  avatar: string;
  mfaEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresMFA?: boolean; error?: string }>;
  logout: () => void;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  verifyMFA: (code: string) => Promise<{ success: boolean; error?: string }>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  department: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const MOCK_USERS: Record<string, { password: string; user: User; mfaCode?: string }> = {
  // Admin
  'admin@devsync.ai': {
    password: 'admin123',
    mfaCode: '123456',
    user: {
      id: '1',
      email: 'admin@devsync.ai',
      name: 'Admin User',
      role: 'admin',
      department: 'Management',
      avatar: 'AU',
      mfaEnabled: true,
    },
  },
  // Product Owner
  'po@devsync.ai': {
    password: 'po123',
    mfaCode: '123456',
    user: {
      id: '2',
      email: 'po@devsync.ai',
      name: 'John Doe',
      role: 'product-owner',
      department: 'Product',
      avatar: 'JD',
      mfaEnabled: true,
    },
  },
  // Product Manager
  'pm@devsync.ai': {
    password: 'pm123',
    user: {
      id: '3',
      email: 'pm@devsync.ai',
      name: 'Mike Johnson',
      role: 'product-manager',
      department: 'Product',
      avatar: 'MJ',
      mfaEnabled: false,
    },
  },
  // Frontend Developer
  'frontend@devsync.ai': {
    password: 'dev123',
    user: {
      id: '4',
      email: 'frontend@devsync.ai',
      name: 'Sarah Chen',
      role: 'developer',
      department: 'Engineering',
      avatar: 'SC',
      mfaEnabled: false,
    },
  },
  // Backend Developer
  'backend@devsync.ai': {
    password: 'dev123',
    user: {
      id: '5',
      email: 'backend@devsync.ai',
      name: 'Alex Kumar',
      role: 'developer',
      department: 'Engineering',
      avatar: 'AK',
      mfaEnabled: false,
    },
  },
  // QA Engineer
  'qa@devsync.ai': {
    password: 'qa123',
    user: {
      id: '6',
      email: 'qa@devsync.ai',
      name: 'Lisa Wang',
      role: 'qa-engineer',
      department: 'Quality',
      avatar: 'LW',
      mfaEnabled: false,
    },
  },
  // Designer
  'designer@devsync.ai': {
    password: 'design123',
    user: {
      id: '7',
      email: 'designer@devsync.ai',
      name: 'Emma Wilson',
      role: 'designer',
      department: 'Design',
      avatar: 'EW',
      mfaEnabled: false,
    },
  },
  // DevOps Engineer
  'devops@devsync.ai': {
    password: 'devops123',
    user: {
      id: '8',
      email: 'devops@devsync.ai',
      name: 'David Park',
      role: 'devops',
      department: 'Infrastructure',
      avatar: 'DP',
      mfaEnabled: false,
    },
  },
  // Security Engineer
  'security@devsync.ai': {
    password: 'security123',
    mfaCode: '123456',
    user: {
      id: '9',
      email: 'security@devsync.ai',
      name: 'Emily Davis',
      role: 'security',
      department: 'Security',
      avatar: 'ED',
      mfaEnabled: true,
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingMFAUser, setPendingMFAUser] = useState<User | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('devsync_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('devsync_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const userRecord = MOCK_USERS[email.toLowerCase()];

    if (!userRecord) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (userRecord.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Check if MFA is required
    if (userRecord.user.mfaEnabled) {
      setPendingMFAUser(userRecord.user);
      return { success: true, requiresMFA: true };
    }

    // Login successful without MFA
    setUser(userRecord.user);
    localStorage.setItem('devsync_user', JSON.stringify(userRecord.user));
    return { success: true };
  };

  const verifyMFA = async (code: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (!pendingMFAUser) {
      return { success: false, error: 'No pending MFA verification' };
    }

    const userRecord = MOCK_USERS[pendingMFAUser.email];

    if (code !== userRecord.mfaCode) {
      return { success: false, error: 'Invalid verification code' };
    }

    // MFA successful
    setUser(pendingMFAUser);
    localStorage.setItem('devsync_user', JSON.stringify(pendingMFAUser));
    setPendingMFAUser(null);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setPendingMFAUser(null);
    localStorage.removeItem('devsync_user');
  };

  const signup = async (data: SignupData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email already exists
    if (MOCK_USERS[data.email.toLowerCase()]) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      department: data.department,
      avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      mfaEnabled: false,
    };

    // In a real app, this would save to database
    // For demo, we'll just add to mock database
    MOCK_USERS[data.email.toLowerCase()] = {
      password: data.password,
      user: newUser,
    };

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
        verifyMFA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
