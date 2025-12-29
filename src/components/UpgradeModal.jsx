import React from 'react';
import { AlertTriangle, Zap, Building2, Crown } from 'lucide-react';
import { Modal } from './ui';
import { usePlan } from '../context/PlanContext';

const UpgradeModal = ({ isOpen, onClose, message }) => {
  const { getPlanType } = usePlan();
  const currentPlan = getPlanType();

  const handleViewPlans = () => {
    onClose();
    window.location.href = '/pricing';
  };

  const getRecommendedPlan = () => {
    if (currentPlan === 'free') return 'pro';
    if (currentPlan === 'pro') return 'enterprise';
    return 'pro';
  };

  const recommendedPlan = getRecommendedPlan();

  const planInfo = {
    pro: {
      name: 'Pro Plan',
      price: '$29/month',
      icon: <Building2 size={20} />,
      benefits: ['Unlimited projects', '25 team members', 'Advanced analytics', 'Priority support'],
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: '$99/month',
      icon: <Crown size={20} />,
      benefits: ['Unlimited everything', 'Dedicated support', 'SSO', 'Custom SLA'],
    },
  };

  const recommended = planInfo[recommendedPlan];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade Required"
      subtitle="You have reached the limit of your current plan."
      size="md"
      className="upgrade-modal"
      footer={
        <div className="upgrade-modal__actions">
          <button className="modal-btn-cancel" onClick={onClose}>
            Maybe Later
          </button>
          <button className="modal-btn-primary" onClick={handleViewPlans}>
            View Plans
          </button>
        </div>
      }
    >
      <div className="upgrade-modal__content">
        <div className="upgrade-modal__icon">
          <AlertTriangle size={24} />
        </div>
        <p className="upgrade-modal__message">
          {message || 'Upgrade your plan to continue creating new items and inviting teammates.'}
        </p>

        {recommended && (
          <div className="upgrade-modal__recommendation">
            <div className="recommendation-header">
              {recommended.icon}
              <div>
                <h4>Recommended: {recommended.name}</h4>
                <p className="recommendation-price">{recommended.price}</p>
              </div>
            </div>
            <ul className="recommendation-benefits">
              {recommended.benefits.map((benefit, index) => (
                <li key={index}>✓ {benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UpgradeModal;





