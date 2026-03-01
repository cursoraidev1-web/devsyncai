import { useState, useEffect, useRef, useCallback } from 'react';

const OFFLINE_DEBOUNCE_MS = 800;
const RECHECK_INTERVAL_MS = 4000;

/**
 * Check real connectivity with a lightweight request (avoids relying only on navigator.onLine).
 * @returns {Promise<boolean>}
 */
function checkConnectivity() {
  if (typeof window === 'undefined') return Promise.resolve(true);
  const url = `${window.location.origin}/?nocache=${Date.now()}`;
  return fetch(url, { method: 'HEAD', cache: 'no-store', mode: 'same-origin' })
    .then(() => true)
    .catch(() => false);
}

/**
 * Custom hook to track online/offline status with debouncing and periodic recheck when offline.
 * @returns {{ isOnline: boolean, recheck: () => void }}
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const offlineTimeoutRef = useRef(null);
  const recheckIntervalRef = useRef(null);

  const performRecheck = useCallback(() => {
    checkConnectivity().then((ok) => {
      if (ok) setIsOnline(true);
    });
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      if (offlineTimeoutRef.current) {
        clearTimeout(offlineTimeoutRef.current);
        offlineTimeoutRef.current = null;
      }
      setIsOnline(true);
    };

    const handleOffline = () => {
      if (offlineTimeoutRef.current) return;
      offlineTimeoutRef.current = setTimeout(() => {
        offlineTimeoutRef.current = null;
        setIsOnline(false);
      }, OFFLINE_DEBOUNCE_MS);
    };

    // Sync initial state with navigator
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (offlineTimeoutRef.current) {
        clearTimeout(offlineTimeoutRef.current);
        offlineTimeoutRef.current = null;
      }
    };
  }, []);

  // When we're offline, periodically recheck so we recover as soon as connection is back
  useEffect(() => {
    if (isOnline) {
      if (recheckIntervalRef.current) {
        clearInterval(recheckIntervalRef.current);
        recheckIntervalRef.current = null;
      }
      return;
    }
    recheckIntervalRef.current = setInterval(performRecheck, RECHECK_INTERVAL_MS);
    return () => {
      if (recheckIntervalRef.current) {
        clearInterval(recheckIntervalRef.current);
        recheckIntervalRef.current = null;
      }
    };
  }, [isOnline, performRecheck]);

  return { isOnline, recheck: performRecheck };
};
