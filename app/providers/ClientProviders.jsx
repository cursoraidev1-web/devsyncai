'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { CompanyProvider } from '../../context/CompanyContext';
import { PlanProvider } from '../../context/PlanContext';
import { AppProvider, useApp } from '../../context/AppContext';
import { ThemeProvider } from '../../context/ThemeContext';
import ThemeAwareToast from '../../components/ThemeAwareToast';
import PWAInstallPrompt from '../../components/PWAInstallPrompt';
import ServiceWorkerRegistration from '../../components/ServiceWorkerRegistration';
import ErrorBoundary from '../../components/ErrorBoundary';
import UpgradeModal from '../../components/UpgradeModal';
import OfflineIndicator from '../../components/OfflineIndicator';

function GlobalUI() {
  const { upgradeModalOpen, upgradeMessage, closeUpgradeModal } = useApp();
  return (
    <>
      <PWAInstallPrompt />
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={closeUpgradeModal}
        message={upgradeMessage}
      />
    </>
  );
}

function ProvidersContent({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompanyProvider>
          <PlanProvider>
            <AppProvider>
              <ServiceWorkerRegistration />
              <GlobalUI />
              {children}
              <OfflineIndicator />
              <ThemeAwareToast />
            </AppProvider>
          </PlanProvider>
        </CompanyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function ClientProviders({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR/prerender, render children without providers
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary>
      <ProvidersContent>{children}</ProvidersContent>
    </ErrorBoundary>
  );
}

