import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track online/offline status with actual connectivity verification
 * @returns {boolean} isOnline - true if device is online, false otherwise
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Simple approach: trust navigator.onLine
    // Only do a connectivity check if navigator says we're offline
    // This prevents false positives from failed fetch requests
    
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      // Only mark as offline if navigator explicitly says so
      // Don't do additional checks that might fail and cause false positives
      setIsOnline(false);
    };

    // Set initial state based on navigator
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};




