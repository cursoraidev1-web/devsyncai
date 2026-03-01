'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { useApp } from '../../context/AppContext';
import Layout from '../../components/Layout';
import AppPreloader from '../../components/AppPreloader';

const MIN_LOADER_MS = 500;

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { loading: companyLoading } = useCompany();
  const { initialDataLoading } = useApp();
  const [loaderVisible, setLoaderVisible] = useState(true);
  const loaderShownAt = useRef(null);

  const isLoading = authLoading || companyLoading || initialDataLoading;

  useEffect(() => {
    if (isLoading) {
      loaderShownAt.current = Date.now();
      setLoaderVisible(true);
    } else {
      const elapsed = loaderShownAt.current ? Date.now() - loaderShownAt.current : MIN_LOADER_MS;
      const remaining = Math.max(0, MIN_LOADER_MS - elapsed);
      const t = setTimeout(() => setLoaderVisible(false), remaining);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (isLoading || loaderVisible) {
    return <AppPreloader message="Loading your workspace..." showProgress />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Layout>{children}</Layout>;
}
