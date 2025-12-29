import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, X } from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import './TrialBanner.css';

const TrialBanner = () => {
  const navigate = useNavigate();
  const { isTrial, isTrialExpired, getTrialDaysRemaining, isActive } = usePlan();
  const [dismissed, setDismissed] = React.useState(false);

  // Don't show if not trial, expired, or dismissed
  if (!isTrial() || isTrialExpired() || !isActive() || dismissed) {
    return null;
  }

  const daysRemaining = getTrialDaysRemaining();

  if (daysRemaining === null || daysRemaining <= 0) {
    return null;
  }

  const isUrgent = daysRemaining <= 7;

  return (
    <div className={`trial-banner ${isUrgent ? 'urgent' : ''}`}>
      <div className="trial-banner-content">
        <AlertCircle size={20} />
        <div className="trial-banner-text">
          {isUrgent ? (
            <>
              <strong>Your trial ends in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}!</strong>
              <span>Upgrade now to keep your data and continue using all features.</span>
            </>
          ) : (
            <>
              <strong>{daysRemaining} days left</strong> in your free trial. Upgrade to Pro to unlock unlimited features.
            </>
          )}
        </div>
        <div className="trial-banner-actions">
          <button
            className="trial-banner-btn"
            onClick={() => navigate('/pricing')}
          >
            Upgrade Now
          </button>
          <button
            className="trial-banner-dismiss"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;








