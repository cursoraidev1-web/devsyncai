'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';
import PasswordInput from '../../components/PasswordInput';
import { validatePassword } from '../../utils/passwordValidation';
import { sanitizeInput } from '../../utils/inputSanitization';
import '../../styles/pages/Auth.css';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, requestPasswordReset } = useAuth();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
    email: ''
  });
  const [error, setError] = useState('');
  const hasToken = searchParams.get('token');

  const handleChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: sanitizedValue
    });
    setError('');
  };

  const handlePasswordChange = (value) => {
    setFormData({
      ...formData,
      newPassword: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasToken) {
      if (!formData.email) {
        setError('Please enter your email');
        return;
      }
      try {
        await requestPasswordReset(formData.email);
        router.push('/reset-password-success');
      } catch (err) {
        setError(err?.message || 'Unable to send reset email. Please try again.');
      }
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.valid) {
      const errorMsg = passwordValidation.errors[0] || 'Password does not meet requirements';
      setError(errorMsg);
      return;
    }

    const token = new URLSearchParams(location.search).get('token');

    if (!token) {
      setError('Reset token missing. Please use the link from your email.');
      return;
    }

    try {
      await resetPassword({ token, password: formData.newPassword });
      router.push('/reset-password-success');
    } catch (err) {
      setError(err?.message || 'Unable to reset password. Please try again.');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <div className="reset-password-logo">ZynDrx</div>
          <h1 className="reset-password-title">Reset Your Password</h1>
          <p className="reset-password-description">
            Choose a new password for your account.
          </p>
        </div>

        {error && (
          <div className="reset-password-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset-password-form">
          {!hasToken && (
            <div className="reset-password-input-group">
              <label htmlFor="email">Email</label>
              <div className="reset-password-input-wrapper">
                <Lock size={18} className="reset-password-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {hasToken && (
            <>
              <div className="reset-password-input-group">
                <label htmlFor="newPassword">New Password</label>
                <PasswordInput
                  value={formData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  showRequirements={true}
                  required
                />
              </div>

              <div className="reset-password-input-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <PasswordInput
                  value={formData.confirmPassword}
                  onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                  placeholder="Confirm your new password"
                  showRequirements={false}
                  required
                />
                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                  <div className="password-error" style={{ marginTop: '8px', color: '#dc2626', fontSize: '13px' }}>
                    Passwords do not match
                  </div>
                )}
              </div>
            </>
          )}

          <button type="submit" className="reset-password-submit-btn">
            Update Password
          </button>
        </form>

        <div className="reset-password-footer">
          <Link href="/login" className="reset-password-link">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

