'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import AppPreloader from '../components/AppPreloader';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/landing');
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <AppPreloader message="Loading Zyndrx..." />;
  }

  return null;
}
