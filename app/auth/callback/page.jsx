'use client';

// Use Edge Runtime to avoid Vercel function limits
export const runtime = 'edge';

/**
 * Unified OAuth Callback Handler for Supabase Auth
 * 
 * This component handles OAuth callbacks from both Google and GitHub.
 * Supabase automatically processes the callback and creates a session.
 */

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { getSupabaseAuthClient } from '../../../utils/supabaseAuth';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/pages/OAuthCallback.css';

function OAuthCallbackContent() {
  // Initialize router from next/navigation - this is the correct way to handle navigation
  const router = useRouter();
  const searchParams = useSearchParams();
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
          setTimeout(() => {
            router.push('/login');
          }, 3000);
          return;
        }

        // Supabase automatically handles the code exchange from URL hash fragments
        // With detectSessionInUrl: true, Supabase processes the hash automatically
        // We'll wait a brief moment and then get the session
        // This ensures Supabase has time to process the URL hash fragments
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(sessionError.message);
        }

        if (!session) {
          // If no session found, try one more time after a short delay
          await new Promise(resolve => setTimeout(resolve, 300));
          const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
          
          if (retryError) {
            throw new Error(retryError.message);
          }
          
          if (!retrySession) {
            setStatus('error');
            setMessage('No session found. Please try again.');
            toast.error('No session found. Please try again.');
            setTimeout(() => {
              router.push('/login');
            }, 3000);
            return;
          }
          
          // Use the retry session
          session = retrySession;
        }

        // Get companyName from sessionStorage if it was set (for new signups)
        const companyName = sessionStorage.getItem('oauth_company_name');
        if (companyName) {
          sessionStorage.removeItem('oauth_company_name'); // Clean up after use
        }
        
        // Sync Supabase session with backend
        // This will create/update the user in your backend database
        const result = await syncSupabaseSession(session, companyName);
        
        // Check if 2FA is required (response format: { require2fa: true, email: string })
        if (result?.require2fa) {
          toast.info('Please enter your 2FA code');
          router.push(`/verify-2fa?email=${encodeURIComponent(result.email)}`);
          return;
        }
        
        setStatus('success');
        setMessage('Login successful! Redirecting...');
        toast.success('Successfully authenticated!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (err) {
        setStatus('error');
        const errorMsg = err?.message || 'Failed to complete authentication';
        setMessage(errorMsg);
        toast.error(errorMsg);
        console.error('OAuth callback error:', err);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            onClick={() => router.push('/login')}
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
