import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { switchCompany as apiSwitchCompany, getUserCompanies as apiGetUserCompanies, createCompany as apiCreateCompany } from '../api/auth';
import logger from '../utils/logger';

const CompanyContext = createContext(null);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

const COMPANY_KEY = 'zyndrx_company';
const COMPANIES_KEY = 'zyndrx_companies';

// Safe localStorage access (handles SSR and Edge Runtime)
const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.error('safeLocalStorage.getItem error:', error);
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
      logger.error('safeLocalStorage.setItem error:', error);
    }
  }
};

export const CompanyProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [currentCompany, setCurrentCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);
  const lastLoadTimeRef = useRef(0);

  // Fetch user's companies with rate limiting and deduplication
  const loadCompanies = useCallback(async () => {
    if (!token) {
      setCompanies([]);
      setCurrentCompany(null);
      setLoading(false);
      loadingRef.current = false;
      return;
    }

    // Prevent multiple simultaneous requests
    if (loadingRef.current) {
      return;
    }

    // Rate limiting: Don't load more than once per 5 seconds
    const now = Date.now();
    if (now - lastLoadTimeRef.current < 5000) {
      logger.warn('Rate limit: Skipping loadCompanies call (too soon)');
      return;
    }

    loadingRef.current = true;
    lastLoadTimeRef.current = now;
    setLoading(true);

    try {
      const response = await apiGetUserCompanies();
      const data = response?.data || response;
      const companiesList = Array.isArray(data) ? data : [];
      setCompanies(companiesList);

      // Load saved company preference or use first company
      const savedCompanyId = safeLocalStorage.getItem(COMPANY_KEY);
      if (savedCompanyId) {
        const savedCompany = companiesList.find(c => c.id === savedCompanyId);
        if (savedCompany) {
          setCurrentCompany(savedCompany);
          setLoading(false);
          loadingRef.current = false;
          return;
        }
      }

      // Use first company if available
      if (companiesList.length > 0) {
        setCurrentCompany(companiesList[0]);
        safeLocalStorage.setItem(COMPANY_KEY, companiesList[0].id);
      } else {
        setCurrentCompany(null);
      }
    } catch (error) {
      logger.error('Failed to load companies:', error);
      
      // Handle rate limiting error gracefully
      if (error?.status === 429 || error?.message?.toLowerCase().includes('too many requests')) {
        const retryAfter = error?.retryAfter || 5;
        logger.warn(`Rate limit reached, will retry after ${retryAfter} seconds`);
        // Don't clear companies on rate limit - keep existing data
        // Update lastLoadTimeRef to prevent immediate retry
        lastLoadTimeRef.current = Date.now() + (retryAfter * 1000);
      } else {
        setCurrentCompany(null);
        setCompanies([]);
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [token]);

  useEffect(() => {
    loadCompanies();
  }, [token, loadCompanies]); // Include loadCompanies to ensure it's stable

  const switchCompany = useCallback(async (companyId) => {
    try {
      const response = await apiSwitchCompany(companyId);
      const data = response?.data || response;
      const company = data?.company || data;
      
      if (company) {
        setCurrentCompany(company);
        safeLocalStorage.setItem(COMPANY_KEY, company.id);
      }
      return company;
    } catch (error) {
      logger.error('Failed to switch company:', error);
      throw error;
    }
  }, []);

  const createCompany = useCallback(async (companyData) => {
    if (!token) {
      throw new Error('You must be logged in to create a workspace');
    }

    try {
      logger.debug('Creating company with payload:', companyData);
      const response = await apiCreateCompany(companyData);
      logger.debug('Create company API response:', response);
      
      // Response format from backend: { success: true, data: <company>, message: "..." }
      const data = response?.data || response;
      const newCompany = data?.company || data;
      
      if (!newCompany || !newCompany.id) {
        logger.error('Invalid company response:', { response, data, newCompany });
        throw new Error('Failed to create workspace: Invalid response from server');
      }
      
      logger.info('Company created successfully:', newCompany);
      
      setCompanies(prev => [...prev, newCompany]);
      await switchCompany(newCompany.id);
      
      return newCompany;
    } catch (error) {
      logger.error('Failed to create company:', error);
      logger.error('Error details:', {
        message: error?.message,
        status: error?.status,
        response: error?.response,
        data: error?.data
      });
      
      // Extract more specific error message
      let errorMessage = error?.message || 'Failed to create workspace. Please try again.';
      
      // Check if error.data contains the backend error response
      if (error?.data) {
        if (error.data.error) {
          errorMessage = error.data.error;
        } else if (error.data.message) {
          errorMessage = error.data.message;
        }
      }
      
      // Create a new error with the extracted message to ensure it's properly formatted
      const formattedError = new Error(errorMessage);
      formattedError.status = error?.status;
      formattedError.data = error?.data;
      throw formattedError;
    }
  }, [token, switchCompany]);

  const value = {
    currentCompany,
    companies,
    loading,
    switchCompany,
    createCompany,
    loadCompanies,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};
