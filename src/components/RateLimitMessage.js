import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { formatRetryAfter } from '../utils/errorHandler';
import './RateLimitMessage.css';

/**
 * Rate Limit Message Component
 * Displays rate limit information with countdown
 */
const RateLimitMessage = ({ retryAfter, onDismiss }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(retryAfter || 0);

  useEffect(() => {
    if (!retryAfter) return;

    setRemainingSeconds(retryAfter);

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onDismiss) {
            setTimeout(onDismiss, 1000);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [retryAfter, onDismiss]);

  if (!retryAfter && remainingSeconds === 0) {
    return null;
  }

  return (
    <div className="rate-limit-message">
      <div className="rate-limit-header">
        <AlertTriangle size={20} className="rate-limit-icon" />
        <h3 className="rate-limit-title">Rate Limit Exceeded</h3>
      </div>
      <p className="rate-limit-description">
        Too many requests from your IP address. Please wait before trying again.
      </p>
      <div className="rate-limit-timer">
        <Clock size={16} />
        <span>
          Please wait <strong>{formatRetryAfter(remainingSeconds)}</strong> before trying again
        </span>
      </div>
    </div>
  );
};

export default RateLimitMessage;

