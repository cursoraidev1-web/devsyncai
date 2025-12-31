import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getSubscription, checkLimits } from '../api/subscription';
import { useAuth } from './AuthContext';
import { useCompany } from './CompanyContext';

const PlanContext = createContext(null);

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

export const PlanProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const { currentCompany } = useCompany();
  const [subscription, setSubscription] = useState(null);
  const [limits, setLimits] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSubscription = useCallback(async () => {
    if (!isAuthenticated || !token || !currentCompany) {
      setSubscription(null);
      setLimits(null);
      setUsage(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const subscriptionData = await getSubscription();
      const limitsData = await checkLimits();

      if (subscriptionData?.plan) {
        setSubscription(subscriptionData.plan);
      }
      if (limitsData?.limits) {
        setLimits(limitsData.limits);
      }
      if (limitsData?.usage) {
        setUsage(limitsData.usage);
      }
    } catch (err) {
      console.error('Failed to load subscription:', err);
      setError(err.message || 'Failed to load subscription');
      // Don't set subscription to null on error - keep previous state
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, currentCompany]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  // Check if user can create a specific resource
  const canCreate = useCallback(
    (resourceType) => {
      if (!limits || !usage) return true; // Default to true if data not loaded

      const limitsMap = {
        project: limits.maxProjects,
        task: limits.maxTasks,
        teamMember: limits.maxTeamMembers,
        document: limits.maxDocuments,
        storage: limits.maxStorageGB,
      };

      const usageMap = {
        project: usage.projectsCount,
        task: usage.tasksCount,
        teamMember: usage.teamMembersCount,
        document: usage.documentsCount,
        storage: usage.storageUsedGB,
      };

      const maxLimit = limitsMap[resourceType];
      const currentUsage = usageMap[resourceType];

      // -1 means unlimited
      if (maxLimit === -1) return true;
      if (maxLimit === undefined || currentUsage === undefined) return true;

      return currentUsage < maxLimit;
    },
    [limits, usage]
  );

  // Get remaining count for a resource
  const getRemaining = useCallback(
    (resourceType) => {
      if (!limits || !usage) return null;

      const limitsMap = {
        project: limits.maxProjects,
        task: limits.maxTasks,
        teamMember: limits.maxTeamMembers,
        document: limits.maxDocuments,
        storage: limits.maxStorageGB,
      };

      const usageMap = {
        project: usage.projectsCount,
        task: usage.tasksCount,
        teamMember: usage.teamMembersCount,
        document: usage.documentsCount,
        storage: usage.storageUsedGB,
      };

      const maxLimit = limitsMap[resourceType];
      const currentUsage = usageMap[resourceType];

      if (maxLimit === -1) return 'unlimited';
      if (maxLimit === undefined || currentUsage === undefined) return null;

      return Math.max(0, maxLimit - currentUsage);
    },
    [limits, usage]
  );

  // Check if trial is active
  const isTrial = useCallback(() => {
    return subscription?.status === 'trial';
  }, [subscription]);

  // Check if trial is expired
  const isTrialExpired = useCallback(() => {
    if (!subscription || subscription.status !== 'trial') return false;
    if (!subscription.trialEndDate) return false;

    const trialEnd = new Date(subscription.trialEndDate);
    return trialEnd < new Date();
  }, [subscription]);

  // Get days remaining in trial
  const getTrialDaysRemaining = useCallback(() => {
    if (!subscription || subscription.status !== 'trial') return null;
    if (!subscription.trialEndDate) return null;

    const trialEnd = new Date(subscription.trialEndDate);
    const now = new Date();
    const diffTime = trialEnd - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }, [subscription]);

  // Check if subscription is active (not expired or cancelled)
  const isActive = useCallback(() => {
    return subscription?.status === 'active' || subscription?.status === 'trial';
  }, [subscription]);

  // Get plan type
  const getPlanType = useCallback(() => {
    return subscription?.type || 'free';
  }, [subscription]);

  const value = {
    subscription,
    limits,
    usage,
    loading,
    error,
    loadSubscription,
    canCreate,
    getRemaining,
    isTrial,
    isTrialExpired,
    getTrialDaysRemaining,
    isActive,
    getPlanType,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};










