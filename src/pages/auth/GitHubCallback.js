import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { exchangeGitHubCode } from '../../utils/oauth';
import './OAuthCallback.css';

const GitHubCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { githubLogin } = useAuth();
  const [status, setStatus] = useState('processing'); // processing | success | error
  const [message, setMessage] = useState('Completing GitHub login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');
        const storedState = sessionStorage.getItem('github_oauth_state');

        if (error) {
          setStatus('error');
          const errorMsg = `GitHub login failed: ${error}`;
          setMessage(errorMsg);
          toast.error(errorMsg);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Verify state to prevent CSRF attacks
        if (state !== storedState) {
          setStatus('error');
          const errorMsg = 'Invalid state parameter. Please try again.';
          setMessage(errorMsg);
          toast.error(errorMsg);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Clear stored state
        sessionStorage.removeItem('github_oauth_state');

        if (!code) {
          setStatus('error');
          const errorMsg = 'No authorization code received. Please try again.';
          setMessage(errorMsg);
          toast.error(errorMsg);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Exchange code for access token
        const accessToken = await exchangeGitHubCode(code);
        
        // Send access token to backend
        const result = await githubLogin(accessToken);
        
        if (result?.require2fa) {
          toast.info('Please enter your 2FA code');
          navigate('/verify-2fa', { state: { email: result.email } });
          return;
        }
        
        setStatus('success');
        setMessage('Login successful! Redirecting...');
        toast.success('Successfully logged in with GitHub!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        setStatus('error');
        const errorMsg = err?.message || 'Failed to complete GitHub login';
        setMessage(errorMsg);
        toast.error(errorMsg);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [navigate, searchParams, githubLogin]);

  return (
    <div className="oauth-callback">
      <div className="oauth-callback-card">
        <div className={`oauth-callback-status oauth-callback-status--${status}`}>
          {status === 'processing' && <div className="spinner" />}
          {status === 'success' && '✅'}
          {status === 'error' && '⚠️'}
        </div>
        <h1 className="oauth-callback-title">GitHub Authentication</h1>
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

export default GitHubCallback;

