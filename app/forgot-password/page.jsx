'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import Logo from '../../components/Logo';
import './forgot-password.css';

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setEmailSent(true);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-logo">
            <div className="logo-icon"></div>
            <span className="logo-text">Zyndrx</span>
          </div>

          <div className="email-sent-icon">
            <Mail size={48} />
          </div>

          <div className="forgot-password-header">
            <h1>Check Your Email</h1>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <p style={{ marginTop: '12px' }}>Click the link in the email to reset your password.</p>
          </div>

          <button
            className="forgot-password-btn"
            onClick={() => router.push('/login')}
          >
            Back to sign in
          </button>

          <div className="resend-section">
            <p>Didn't receive the email?</p>
            <button
              className="resend-link"
              onClick={() => setEmailSent(false)}
            >
              Resend email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-logo">
          <Logo width={40} height={40} showText={true} priority={true} />
        </div>

        <div className="forgot-password-header">
          <h1>Forgot Password?</h1>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="email-input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="forgot-password-btn"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Send Reset Link'}
          </button>

          <button
            type="button"
            className="back-to-login"
            onClick={() => router.push('/login')}
          >
            <ArrowLeft size={16} />
            Back to sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

