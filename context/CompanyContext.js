import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { switchCompany as apiSwitchCompany, getUserCompanies as apiGetUserCompanies, createCompany as apiCreateCompany } from '../api/auth';

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

export const CompanyProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [currentCompany, setCurrentCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's companies
  const loadCompanies = useCallback(async () => {
    if (!token) {
      setCompanies([]);
      setCurrentCompany(null);
      setLoading(false);
      return;
    }

    try {
      const response = await apiGetUserCompanies();
      const data = response?.data || response;
      const companiesList = Array.isArray(data) ? data : [];
      setCompanies(companiesList);

      // Load saved company preference or use first company
      const savedCompanyId = localStorage.getItem(COMPANY_KEY);
      if (savedCompanyId && companiesList.find(c => c.id === savedCompanyId)) {
        const savedCompany = companiesList.find(c => c.id === savedCompanyId);
        setCurrentCompany(savedCompany);
      } else if (companiesList.length > 0) {
        // Use first company as default
        setCurrentCompany(companiesList[0]);
        localStorage.setItem(COMPANY_KEY, companiesList[0].id);
      } else {
        setCurrentCompany(null);
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
      setCompanies([]);
      setCurrentCompany(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Switch to a different company
  const switchCompany = useCallback(async (companyId) => {
    if (!token) return;

    try {
      const response = await apiSwitchCompany(companyId);
      const data = response?.data || response;
      
      const company = data?.company || companies.find(c => c.id === companyId);
      if (company) {
        setCurrentCompany(company);
        localStorage.setItem(COMPANY_KEY, company.id);
        
        // If token is refreshed, update it
        if (data?.token) {
          localStorage.setItem('zyndrx_token', data.token);
        }

        // Reload window to refresh all data with new company context
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to switch company:', error);
      throw error;
    }
  }, [token, companies]);

  // Create a new company/workspace
  const createCompany = useCallback(async (companyData) => {
    if (!token) {
      throw new Error('You must be logged in to create a workspace');
    }

    try {
      console.log('Creating company with payload:', companyData);
      const response = await apiCreateCompany(companyData);
      console.log('Create company API response:', response);
      
      // Handle response format: { success: true, data: { company: {...} } } or { success: true, data: {...} } or direct company object
      const data = response?.data || response;
      
      // Extract company from various response formats
      const newCompany = data?.company || data;
      
      if (!newCompany || !newCompany.id) {
        console.error('Invalid company response:', { response, data, newCompany });
        throw new Error('Failed to create workspace: Invalid response from server');
      }
      
      console.log('Company created successfully:', newCompany);
      
      // Add to companies list
      setCompanies(prev => [...prev, newCompany]);
      
      // Switch to the new company (this will reload the page)
      await switchCompany(newCompany.id);
      
      return newCompany;
    } catch (error) {
      console.error('Failed to create company:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        response: error?.response,
        data: error?.data
      });
      // Re-throw to let component handle it
      throw error;
    }
  }, [token, switchCompany]);

  // Load companies when token changes
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const value = {
    currentCompany,
    companies,
    loading,
    switchCompany,
    createCompany,
    reloadCompanies: loadCompanies,
  };

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};



