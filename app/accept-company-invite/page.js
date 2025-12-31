'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Mail, User, Building2, ArrowRight } from 'lucide-react';
import PasswordInput from '../../components/PasswordInput';
import { validatePassword } from '../../utils/passwordValidation';
import { sanitizeInput } from '../../utils/inputSanitization';
import { handleApiError } from '../../utils/errorHandler';
import EmailVerificationMessage from '../../components/EmailVerificationMessage';
import { resendVerificationEmail } from '../../api/auth';
import '../../styles/pages/AcceptCompanyInvite.css';

/**
 * Accept Company Invitation Page
 * Users register with an invitation token to join a company
 */
function AcceptCompanyInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const invitationToken = searchParams.get('token');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  // Redirect to register if no token
  if (!invitationToken) {
    return (
      <div className="accept-company-invite">
        <div className="accept-company-invite-card">
          <div className="accept-company-invite-error">
            <h1>Invalid Invitation</h1>
            <p>This invitation link is missing or invalid.</p>
            <Link href="/register" className="btn-go-to-register">
              Go to Registration
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
      password: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      const errorMsg = 'Please fill in all fields';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      const errorMsg = passwordValidation.errors[0] || 'Password does not meet requirements';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        email: formData.email.trim(),
        password: formData.password,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        invitationToken: invitationToken,
      });

      // Show email verification message
      setShowVerificationMessage(true);
      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (err) {
      console.error('Registration error:', err);
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      toast.error(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail(formData.email);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      const errorInfo = handleApiError(error);
      toast.error(errorInfo.message);
    }
  };

  // Show email verification message after successful registration
  if (showVerificationMessage) {
    return (
      <div className="accept-company-invite">
        <div className="accept-company-invite-card">
          <EmailVerificationMessage
            email={formData.email}
            onResend={handleResendVerification}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="accept-company-invite">
      <div className="accept-company-invite-card">
        <div className="accept-company-invite-header">
          <div className="invite-icon">
            <Building2 size={32} />
          </div>
          <h1>Accept Company Invitation</h1>
          <p className="invite-description">
            Create your account to join the company. You'll be automatically added to the team.
          </p>
        </div>

        {error && (
          <div className="accept-company-invite-error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="accept-company-invite-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <PasswordInput
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              showRequirements={true}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <PasswordInput
              value={formData.confirmPassword}
              onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
              placeholder="Confirm your password"
              showRequirements={false}
              required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="password-error" style={{ marginTop: '8px', color: '#dc2626', fontSize: '13px' }}>
                Passwords do not match
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                Create Account & Join
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="accept-company-invite-footer">
          <p>
            Already have an account?{' '}
            <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AcceptCompanyInvite() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
      <AcceptCompanyInviteContent />
    </Suspense>
  );
}



