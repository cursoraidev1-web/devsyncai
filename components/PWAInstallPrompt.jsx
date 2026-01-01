import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Smartphone, Zap, Shield } from 'lucide-react';
import './PWAInstallPrompt.css';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const promptFiredRef = useRef(false);

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      // Check if running as standalone (installed)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }

      // Check if running in standalone mode (iOS)
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return true;
      }

      return false;
    };

    if (checkInstalled()) {
      console.log('[PWA] App is already installed');
      return; // Already installed, don't show prompt
    }

    // Check if already dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const now = Date.now();
    const daysSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60 * 24);

    // Don't show if dismissed less than 7 days ago
    if (dismissed && daysSinceDismissed < 7) {
      console.log('[PWA] Install prompt was dismissed recently');
      return;
    }

    // Debug: Check PWA criteria
    const checkPWACriteria = () => {
      const checks = {
        https: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
        manifest: document.querySelector('link[rel="manifest"]') !== null,
        serviceWorker: 'serviceWorker' in navigator,
      };
      
      console.log('[PWA] Criteria check:', checks);
      setDebugInfo(JSON.stringify(checks, null, 2));
      
      return Object.values(checks).every(v => v === true);
    };

    checkPWACriteria();

    // Listen for beforeinstallprompt event (Chrome/Edge/Firefox)
    // This is the ONLY way to show install prompt - no fallbacks
    let timeoutId = null;
    
    const handler = (e) => {
      console.log('[PWA] beforeinstallprompt event fired!');
      e.preventDefault();
      promptFiredRef.current = true;
      setDeferredPrompt(e);
      
      // Check if already dismissed
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const now = Date.now();
      const daysSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Only show if not dismissed or dismissed more than 7 days ago
      if (!dismissed || daysSinceDismissed >= 7) {
        // Show after a short delay to let page load
        timeoutId = setTimeout(() => {
          setShowPrompt(true);
        }, 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Debug: Log if event doesn't fire after 5 seconds
    const debugTimeout = setTimeout(() => {
      if (!promptFiredRef.current) {
        console.warn('[PWA] beforeinstallprompt event did not fire after 5 seconds');
        console.warn('[PWA] This usually means the PWA does not meet install criteria:');
        console.warn('[PWA] 1. Must have HTTPS (or localhost)');
        console.warn('[PWA] 2. Must have a valid manifest.json');
        console.warn('[PWA] 3. Must have a service worker registered');
        console.warn('[PWA] 4. Must have at least one icon (192x192 or larger PNG)');
        console.warn('[PWA] Check browser console for service worker registration status');
      }
    }, 5000);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      clearTimeout(debugTimeout);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []); // Empty dependency array - only run once on mount

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If no deferred prompt, don't show anything - just dismiss
      console.warn('[PWA] No deferred prompt available');
      handleDismiss();
      return;
    }

    try {
      // Show the native browser install prompt
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        // Hide prompt after successful installation
        setShowPrompt(false);
        setIsInstalled(true);
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      
      // Clear the deferred prompt
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('[PWA] Error showing install prompt:', error);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <button className="pwa-install-close" onClick={handleDismiss} aria-label="Close">
          <X size={18} />
        </button>
        
        <div className="pwa-install-icon">
          <Smartphone size={32} />
        </div>
        
        <div className="pwa-install-text">
          <h3>Install Zyndrx</h3>
          <p>Get the full app experience with offline access and faster loading</p>
        </div>

        <div className="pwa-install-features">
          <div className="pwa-feature">
            <Zap size={16} />
            <span>Faster loading</span>
          </div>
          <div className="pwa-feature">
            <Shield size={16} />
            <span>Offline access</span>
          </div>
        </div>

        <div className="pwa-install-actions">
          <button className="btn btn-primary btn-install" onClick={handleInstall}>
            <Download size={18} />
            Install App
          </button>
          <button className="btn btn-ghost btn-later" onClick={handleDismiss}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
