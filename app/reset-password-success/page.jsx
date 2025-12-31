'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
;
import { CheckCircle } from 'lucide-react';
import '../../styles/pages/Auth.css';

const ResetPasswordSuccess = () => {
  const router = useRouter();

  return (
    <div className="reset-password-success-container">
      <div className="reset-password-success-card">
        <div className="reset-password-success-icon">
          <CheckCircle size={48} />
        </div>
        <h1 className="reset-password-success-title">Password Reset Successfully</h1>
        <p className="reset-password-success-description">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <button 
          className="reset-password-success-btn"
          onClick={() => router.push('/login')}
        >
          Continue to Sign In
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;


