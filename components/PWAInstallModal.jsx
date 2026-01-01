import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Share2, Plus } from 'lucide-react';
import Modal from './ui/Modal';
import './PWAInstallModal.css';

const PWAInstallModal = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [platform, setPlatform] = useState('unknown');
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect platform
    const detectPlatform = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      
      // Check if iOS
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'ios';
      }
      
      // Check if Android
      if (/android/i.test(userAgent)) {
        // Check if Samsung Internet
        if (/SamsungBrowser/i.test(userAgent)) {
          return 'samsung';
        }
        return 'android';
      }
      
      // Check if desktop Chrome/Edge/Firefox
      if (/Chrome|Edg|Firefox/.test(userAgent)) {
        return 'desktop';
      }
      
      return 'unknown';
    };

    setPlatform(detectPlatform());

    // Check if already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
      }
      if (window.navigator.standalone === true) {
        return true;
      }
      return false;
    };

    setIsInstalled(checkInstalled());

    // Listen for beforeinstallprompt (Chrome/Edge/Firefox/Android)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          onClose();
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Install error:', error);
      }
    }
  };

  const renderInstructions = () => {
    if (isInstalled) {
      return (
        <div className="pwa-install-instructions">
          <div className="pwa-install-success">
            <Smartphone size={48} />
            <h3>App Already Installed!</h3>
            <p>Zyndrx is already installed on this device.</p>
          </div>
        </div>
      );
    }

    switch (platform) {
      case 'ios':
        return (
          <div className="pwa-install-instructions">
            <h3>Install on iPhone/iPad</h3>
            <ol className="pwa-install-steps">
              <li>
                <Share2 size={20} />
                <div>
                  <strong>Tap the Share button</strong>
                  <span>Located at the bottom of Safari</span>
                </div>
              </li>
              <li>
                <Plus size={20} />
                <div>
                  <strong>Select "Add to Home Screen"</strong>
                  <span>Scroll down if needed</span>
                </div>
              </li>
              <li>
                <Smartphone size={20} />
                <div>
                  <strong>Tap "Add"</strong>
                  <span>The app will appear on your home screen</span>
                </div>
              </li>
            </ol>
          </div>
        );

      case 'samsung':
      case 'android':
        return (
          <div className="pwa-install-instructions">
            <h3>Install on Android</h3>
            {deferredPrompt ? (
              <div className="pwa-install-auto">
                <p>Click the button below to install Zyndrx on your device.</p>
                <button className="btn btn-primary btn-install" onClick={handleInstall}>
                  <Download size={18} />
                  Install App
                </button>
              </div>
            ) : (
              <ol className="pwa-install-steps">
                <li>
                  <div>
                    <strong>Tap the menu button</strong>
                    <span>Three dots in the top right corner</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Select "Add to Home screen"</strong>
                    <span>Or "Install app"</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Tap "Add" or "Install"</strong>
                    <span>The app will appear on your home screen</span>
                  </div>
                </li>
              </ol>
            )}
          </div>
        );

      case 'desktop':
        return (
          <div className="pwa-install-instructions">
            <h3>Install on Desktop</h3>
            {deferredPrompt ? (
              <div className="pwa-install-auto">
                <p>Click the button below to install Zyndrx on your computer.</p>
                <button className="btn btn-primary btn-install" onClick={handleInstall}>
                  <Download size={18} />
                  Install App
                </button>
              </div>
            ) : (
              <ol className="pwa-install-steps">
                <li>
                  <div>
                    <strong>Look for the install icon</strong>
                    <span>In your browser's address bar (Chrome/Edge)</span>
                  </div>
                </li>
                <li>
                  <div>
                    <strong>Or use the menu</strong>
                    <span>Menu → Install Zyndrx</span>
                  </div>
                </li>
              </ol>
            )}
          </div>
        );

      default:
        return (
          <div className="pwa-install-instructions">
            <h3>Install Instructions</h3>
            <p>Please use a supported browser (Chrome, Edge, Firefox, Safari) to install the app.</p>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Install Zyndrx App" size="md">
      <div className="pwa-install-modal-content">
        <div className="pwa-install-icon">
          <Smartphone size={32} />
        </div>
        {renderInstructions()}
      </div>
    </Modal>
  );
};

export default PWAInstallModal;

