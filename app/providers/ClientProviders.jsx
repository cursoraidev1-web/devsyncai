'use client';

// Note: Removed 'edge' runtime and 'force-dynamic' to allow proper client-side rendering

import React from 'react';
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
    <AuthProvider>
      <ThemeProvider>
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
      </ThemeProvider>
    </AuthProvider>
  );
}

export default function ClientProviders({ children }) {
  // Always render providers - client components should maintain consistent structure
  // The providers themselves handle SSR safety internally
  return (
    <ErrorBoundary>
      <ProvidersContent>{children}</ProvidersContent>
    </ErrorBoundary>
  );
}
