import React from 'react';
import { usePathname } from 'next/navigation';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import './OfflineIndicator.css';

const OfflineIndicator = () => {
  const { isOnline, recheck } = useOnlineStatus();
  const pathname = usePathname();

  // Don't show offline indicator on test pages (they need to test connectivity)
  if (pathname?.startsWith('/test/')) {
    return null;
  }

  if (isOnline) return null;

  return (
    <div className="offline-overlay">
      <div className="offline-card">
        <div className="offline-icon">
          <WifiOff size={48} />
        </div>
        <h2 className="offline-title">You're offline</h2>
        <p className="offline-message">
          Connect to Wi‑Fi or mobile data to continue.
        </p>
        <div className="offline-spinner" />
        <button
          type="button"
          className="offline-retry"
          onClick={recheck}
          aria-label="Check connection again"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default OfflineIndicator;




