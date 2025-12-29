import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import './AccountLockoutMessage.css';

/**
 * Account Lockout Message Component
 * Displays lockout information with countdown timer
 */
const AccountLockoutMessage = ({ lockoutTime, onDismiss }) => {
  const [remainingTime, setRemainingTime] = useState(lockoutTime || 30);

  useEffect(() => {
    if (!lockoutTime) return;

    setRemainingTime(lockoutTime);

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onDismiss) {
            setTimeout(onDismiss, 1000);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lockoutTime, onDismiss]);

  if (!lockoutTime && remainingTime === 0) {
    return null;
  }

  const progress = ((lockoutTime - remainingTime) / lockoutTime) * 100;

  return (
    <div className="account-lockout-message">
      <div className="lockout-header">
        <AlertCircle size={20} className="lockout-icon" />
        <h3 className="lockout-title">Account Locked</h3>
      </div>
      <p className="lockout-description">
        Too many failed login attempts. Your account has been temporarily locked for security.
      </p>
      <div className="lockout-timer">
        <Clock size={16} />
        <span>
          Please try again in <strong>{remainingTime} minute{remainingTime !== 1 ? 's' : ''}</strong>
        </span>
      </div>
      <div className="lockout-progress">
        <div className="lockout-progress-bar">
          <div
            className="lockout-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="lockout-note">
        For security reasons, accounts are locked after 5 failed login attempts.
      </p>
    </div>
  );
};

export default AccountLockoutMessage;

