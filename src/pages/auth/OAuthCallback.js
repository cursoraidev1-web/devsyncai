/**
 * Unified OAuth Callback Handler for Supabase Auth
 * 
 * This component handles OAuth callbacks from both Google and GitHub.
 * Supabase automatically processes the callback and creates a session.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSupabaseAuthClient } from '../../utils/supabaseAuth';
import { useAuth } from '../../context/AuthContext';
import './OAuthCallback.css';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { syncSupabaseSession } = useAuth();
  const [status, setStatus] = useState('processing'); // processing | success | error
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabaseAuthClient();
        
        // Check for error in URL
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          setStatus('error');
          const errorMsg = errorDescription || error || 'Authentication failed';
          setMessage(`Authentication failed: ${errorMsg}`);
          toast.error(`Authentication failed: ${errorMsg}`);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Supabase automatically handles the code exchange
        // We just need to get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }

        if (!session) {
          setStatus('error');
          setMessage('No session found. Please try again.');
          toast.error('No session found. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Sync Supabase session with backend
        // This will create/update the user in your backend database
        const result = await syncSupabaseSession(session);
        
        if (result?.require2fa) {
          toast.info('Please enter your 2FA code');
          navigate('/verify-2fa', { state: { email: result.email } });
          return;
        }
        
        setStatus('success');
        setMessage('Login successful! Redirecting...');
        toast.success('Successfully authenticated!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        setStatus('error');
        const errorMsg = err?.message || 'Failed to complete authentication';
        setMessage(errorMsg);
        toast.error(errorMsg);
        console.error('OAuth callback error:', err);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate, searchParams, syncSupabaseSession]);

  return (
    <div className="oauth-callback">
      <div className="oauth-callback-card">
        <div className={`oauth-callback-status oauth-callback-status--${status}`}>
          {status === 'processing' && <div className="spinner" />}
          {status === 'success' && '✅'}
          {status === 'error' && '⚠️'}
        </div>
        <h1 className="oauth-callback-title">Authentication</h1>
        <p className="oauth-callback-message">{message}</p>
        {status === 'error' && (
          <button 
            className="oauth-callback-button"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;

