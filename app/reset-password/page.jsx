'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import Logo from '../../components/Logo';
import './reset-password.css';

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      toast.error('Invalid reset link');
      router.push('/login');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      // Success - redirect to success page
      router.push('/reset-password/success');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        {/* Logo */}
        <div className="reset-password-logo">
          <Logo width={40} height={40} showText={true} priority={true} />
        </div>

        {/* Header */}
        <div className="reset-password-header">
          <h1>Reset Your Password</h1>
          <p>Choose a new password for your account.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="reset-password-form">
          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label="Toggle password visibility"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle password visibility"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="reset-password-btn"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Update Password'}
          </button>

          {/* Back to Sign In */}
          <div className="back-to-signin">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="back-link"
            >
              Back to sign in
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="reset-password-footer">
          <a href="/terms" className="footer-link">Terms of Service</a>
          <span> and </span>
          <a href="/privacy" className="footer-link">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
