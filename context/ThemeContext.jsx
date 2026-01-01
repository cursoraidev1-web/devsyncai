'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { updateProfile } from '../api/auth';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // Get effective theme (handles 'auto' mode)
  const getEffectiveTheme = useCallback((preference) => {
    if (preference === 'auto') {
      // Check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'light';
    }
    return preference || 'light';
  }, []);

  const effectiveTheme = getEffectiveTheme(theme);

  // Load theme from user preference or localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadTheme = () => {
      try {
        // First check user preference from backend
        const userTheme = user?.themePreference;
        if (userTheme) {
          setTheme(userTheme);
          setLoading(false);
          return;
        }

        // Fallback to localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        setLoading(false);
      } catch (error) {
        console.error('Error loading theme:', error);
        setTheme('light');
        setLoading(false);
      }
    };

    loadTheme();
  }, [user?.themePreference]);

  // Apply theme class to HTML element
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const htmlElement = document.documentElement;
    htmlElement.classList.remove('light', 'dark');
    htmlElement.classList.add(effectiveTheme);
    htmlElement.setAttribute('data-theme', effectiveTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#0B1020' : '#4f46e5');
    }
  }, [effectiveTheme]);

  // Listen to system theme changes when in 'auto' mode
  useEffect(() => {
    if (theme !== 'auto' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force re-render by updating state
      setTheme((prev) => prev); // Trigger re-evaluation
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Update theme preference
  const updateTheme = useCallback(async (newTheme) => {
    if (!['light', 'dark', 'auto'].includes(newTheme)) {
      console.error('Invalid theme:', newTheme);
      return;
    }

    setTheme(newTheme);

    // Save to localStorage immediately for instant feedback
    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }

    // Save to backend if user is authenticated
    if (user?.id) {
      try {
        await updateProfile({ themePreference: newTheme });
        // Update user context
        updateUser({ themePreference: newTheme });
      } catch (error) {
        console.error('Error saving theme preference to backend:', error);
        // Don't revert on error - localStorage is already saved
      }
    }
  }, [user?.id, updateUser]);

  const value = {
    theme,
    effectiveTheme,
    updateTheme,
    loading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

