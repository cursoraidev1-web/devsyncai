'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import AppPreloader from '../../../components/AppPreloader';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Route to correct dashboard based on role
      const dashboardRoutes = {
        'pm': '/dashboard/pm',
        'product-owner': '/dashboard/pm',
        'developer': '/dashboard/developer',
        'qa': '/dashboard/qa',
        'devops': '/dashboard/devops',
        'admin': '/dashboard/pm'
      };

      const route = dashboardRoutes[user?.role] || '/dashboard/developer';
      router.push(route);
    }
  }, [user, isAuthenticated, loading, router]);

  if (loading) {
    return <AppPreloader message="Loading dashboard..." />;
  }

  return null;
}
