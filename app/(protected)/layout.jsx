'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppPreloader from '../../components/AppPreloader';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { loading: companyLoading } = useCompany();
  const { initialDataLoading } = useApp();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show preloader during auth, company, or initial data loading
  const isLoading = authLoading || companyLoading || initialDataLoading;

  if (isLoading) {
    return <AppPreloader message="Loading your workspace..." showProgress />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Layout>{children}</Layout>;
}
