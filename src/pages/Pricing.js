import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Zap, Building2, Crown } from 'lucide-react';
import { getPlans, upgradeSubscription } from '../api/subscription';
import { usePlan } from '../context/PlanContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Pricing.css';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { subscription, getPlanType } = usePlan();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load plans:', error);
      toast.error('Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planType) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    setUpgrading(planType);
    try {
      const response = await upgradeSubscription(planType);
      
      if (response?.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = response.checkoutUrl;
      } else {
        toast.success(`Successfully upgraded to ${planType} plan!`);
        // Reload subscription data
        window.location.reload();
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      toast.error(error.message || 'Failed to upgrade plan');
    } finally {
      setUpgrading(null);
    }
  };

  const currentPlanType = getPlanType();

  const getPlanIcon = (type) => {
    switch (type) {
      case 'free':
        return <Zap size={24} />;
      case 'pro':
        return <Building2 size={24} />;
      case 'enterprise':
        return <Crown size={24} />;
      default:
        return null;
    }
  };

  const formatLimit = (limit) => {
    if (limit === -1) return 'Unlimited';
    return limit?.toLocaleString() || '0';
  };

  if (loading) {
    return (
      <div className="pricing-page">
        <div className="pricing-loading">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        <div className="pricing-header">
          <h1>Choose Your Plan</h1>
          <p className="pricing-subtitle">
            Start with a 30-day free trial. No credit card required.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => {
            const isCurrentPlan = plan.type === currentPlanType;
            const isUpgrading = upgrading === plan.type;

            return (
              <div
                key={plan.type}
                className={`pricing-card ${plan.type === 'pro' ? 'featured' : ''} ${isCurrentPlan ? 'current' : ''}`}
              >
                {plan.type === 'pro' && (
                  <div className="pricing-badge">Most Popular</div>
                )}
                {isCurrentPlan && (
                  <div className="pricing-badge current-badge">Current Plan</div>
                )}

                <div className="pricing-card-header">
                  <div className="pricing-icon">{getPlanIcon(plan.type)}</div>
                  <h2 className="pricing-plan-name">{plan.name}</h2>
                  <div className="pricing-price">
                    {plan.price === 0 ? (
                      <span className="price-free">Free</span>
                    ) : (
                      <>
                        <span className="price-amount">${plan.price}</span>
                        <span className="price-period">/{plan.billingPeriod}</span>
                      </>
                    )}
                  </div>
                  {plan.trialDays && (
                    <p className="pricing-trial">{plan.trialDays}-day free trial</p>
                  )}
                </div>

                <div className="pricing-features">
                  <div className="pricing-limits">
                    <div className="limit-item">
                      <span className="limit-label">Projects:</span>
                      <span className="limit-value">{formatLimit(plan.limits?.maxProjects)}</span>
                    </div>
                    <div className="limit-item">
                      <span className="limit-label">Tasks:</span>
                      <span className="limit-value">{formatLimit(plan.limits?.maxTasks)}</span>
                    </div>
                    <div className="limit-item">
                      <span className="limit-label">Team Members:</span>
                      <span className="limit-value">{formatLimit(plan.limits?.maxTeamMembers)}</span>
                    </div>
                    <div className="limit-item">
                      <span className="limit-label">Storage:</span>
                      <span className="limit-value">{formatLimit(plan.limits?.maxStorageGB)} GB</span>
                    </div>
                  </div>

                  <div className="pricing-features-list">
                    {plan.features?.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <Check size={18} className="feature-check" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pricing-actions">
                  {isCurrentPlan ? (
                    <button className="pricing-btn current-btn" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <button
                      className={`pricing-btn ${plan.type === 'pro' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleUpgrade(plan.type)}
                      disabled={isUpgrading || plan.type === 'free'}
                    >
                      {isUpgrading
                        ? 'Processing...'
                        : plan.type === 'free'
                        ? 'Current Plan'
                        : plan.type === 'enterprise'
                        ? 'Contact Sales'
                        : 'Upgrade Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pricing-footer">
          <p>
            All plans include a 30-day free trial. Cancel anytime.
            <br />
            Need help choosing? <a href="/support">Contact our team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;








