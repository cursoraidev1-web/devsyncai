'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../context/AuthContext';
import { CompanyProvider } from '../context/CompanyContext';
import { PlanProvider } from '../context/PlanContext';
import { AppProvider, useApp } from '../context/AppContext';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import ErrorBoundary from '../components/ErrorBoundary';
import UpgradeModal from '../components/UpgradeModal';
import OfflineIndicator from '../components/OfflineIndicator';
import '../design-system/global.css';
import '../styles/index.css';

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

function RootLayoutContent({ children }) {
  return (
    <>
      <GlobalUI />
      {children}
      <OfflineIndicator />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <meta
          name="description"
          content="Zyndrx - Project Management & Development Coordination Platform"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Zyndrx" />
        <title>Zyndrx Platform</title>
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <CompanyProvider>
              <PlanProvider>
                <AppProvider>
                  <RootLayoutContent>{children}</RootLayoutContent>
                </AppProvider>
              </PlanProvider>
            </CompanyProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
