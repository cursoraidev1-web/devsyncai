import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './OAuthCallback.css';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLoginWithCode } = useAuth();
  const [status, setStatus] = useState('processing'); // processing | success | error
  const [message, setMessage] = useState('Completing Google login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Authorization code flow uses query parameters
        const search = location.search.substring(1); // Remove ? from search
        const params = new URLSearchParams(search);
        
        const code = params.get('code');
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        const state = params.get('state');
        const storedState = sessionStorage.getItem('google_oauth_state');

        if (error) {
          setStatus('error');
          const errorMsg = errorDescription || error;
          setMessage(`Google login failed: ${errorMsg}`);
          toast.error(`Google login failed: ${errorMsg}`);
          console.error('Google OAuth Error:', { error, errorDescription, search });
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Verify state to prevent CSRF attacks
        if (state && storedState && state !== storedState) {
          setStatus('error');
          const errorMsg = 'Invalid state parameter. Please try again.';
          setMessage(errorMsg);
          toast.error(errorMsg);
          console.error('State mismatch:', { received: state, stored: storedState });
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Clear stored state
        if (storedState) {
          sessionStorage.removeItem('google_oauth_state');
        }

        if (!code) {
          setStatus('error');
          const errorMsg = 'No authorization code received. Please try again.';
          setMessage(errorMsg);
          toast.error(errorMsg);
          console.error('No authorization code found in URL:', { search, location });
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Send code directly to backend - backend will exchange it for token and handle login
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const result = await googleLoginWithCode(code, redirectUri);
        
        if (result?.require2fa) {
          toast.info('Please enter your 2FA code');
          navigate('/verify-2fa', { state: { email: result.email } });
          return;
        }
        
        setStatus('success');
        setMessage('Login successful! Redirecting...');
        toast.success('Successfully logged in with Google!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        setStatus('error');
        const errorMsg = err?.message || 'Failed to complete Google login';
        setMessage(errorMsg);
        toast.error(errorMsg);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate, location, googleLoginWithCode]);

  return (
    <div className="oauth-callback">
      <div className="oauth-callback-card">
        <div className={`oauth-callback-status oauth-callback-status--${status}`}>
          {status === 'processing' && <div className="spinner" />}
          {status === 'success' && '✅'}
          {status === 'error' && '⚠️'}
        </div>
        <h1 className="oauth-callback-title">Google Authentication</h1>
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

export default GoogleCallback;

