'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import AppPreloader from '../components/AppPreloader';

const MIN_LOADER_MS = 500;

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [loaderVisible, setLoaderVisible] = useState(true);
  const loaderShownAt = useRef(null);

  useEffect(() => {
    if (loading) {
      loaderShownAt.current = Date.now();
      setLoaderVisible(true);
    } else {
      const elapsed = loaderShownAt.current ? Date.now() - loaderShownAt.current : MIN_LOADER_MS;
      const remaining = Math.max(0, MIN_LOADER_MS - elapsed);
      const t = setTimeout(() => setLoaderVisible(false), remaining);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && !loaderVisible) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/landing');
      }
    }
  }, [isAuthenticated, loading, loaderVisible, router]);

  if (loading || loaderVisible) {
    return <AppPreloader message="Loading Zyndrx..." />;
  }

  return null;
}
