/**
 * OAuth utility functions for Google and GitHub authentication
 * Frontend handles OAuth flow and sends access token to backend
 */

import { api } from '../api/client';

/**
 * Get Google OAuth URL for authorization code flow
 * Note: This requires the backend to exchange the code for a token
 * OR we exchange it on frontend if we have client secret (not recommended)
 */
export const getGoogleOAuthUrl = () => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('REACT_APP_GOOGLE_CLIENT_ID is not set in environment variables');
  }
  
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = 'openid email profile';
  const responseType = 'code'; // Use authorization code flow instead of token
  const state = Math.random().toString(36).substring(7); // CSRF protection
  
  // Store state in sessionStorage for verification
  sessionStorage.setItem('google_oauth_state', state);
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope: scope,
    state: state,
    access_type: 'offline', // Request refresh token
    prompt: 'consent', // Force consent screen to get refresh token
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/**
 * Exchange Google authorization code via backend endpoint
 * The backend handles the code exchange with Google
 */
export const exchangeGoogleCode = async (code) => {
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  
  // Use the API client to send code to backend
  // Backend will exchange the code for an access token and handle login
  const { googleLoginWithCode } = await import('../api/auth');
  return googleLoginWithCode(code, redirectUri);
};

/**
 * Send Google access token to backend
 */
export const sendGoogleTokenToBackend = async (accessToken) => {
  return api.post('/auth/google', { accessToken }, { auth: false });
};

/**
 * Send GitHub access token to backend
 */
export const sendGitHubTokenToBackend = async (accessToken) => {
  return api.post('/auth/github', { accessToken }, { auth: false });
};

/**
 * Get GitHub OAuth URL for redirect flow
 */
export const getGitHubOAuthUrl = () => {
  const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  if (!clientId) {
    throw new Error('REACT_APP_GITHUB_CLIENT_ID is not set in environment variables');
  }
  
  const redirectUri = `${window.location.origin}/auth/github/callback`;
  const scope = 'user:email';
  const state = Math.random().toString(36).substring(7); // CSRF protection
  
  // Store state in sessionStorage for verification
  sessionStorage.setItem('github_oauth_state', state);
  
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
};

/**
 * Exchange GitHub code for access token
 * Note: This requires REACT_APP_GITHUB_CLIENT_ID and REACT_APP_GITHUB_CLIENT_SECRET
 * For production, this should be done on the backend to keep the client secret secure
 */
export const exchangeGitHubCode = async (code) => {
  const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
  
  if (!clientId) {
    throw new Error('REACT_APP_GITHUB_CLIENT_ID is not set in environment variables');
  }
  
  // Option 1: Try backend endpoint first (if available)
  const backendUrl = process.env.REACT_APP_API_URL || '';
  if (backendUrl) {
    const exchangeUrl = backendUrl.includes('/api/v1') 
      ? `${backendUrl.replace('/api/v1', '')}/api/v1/auth/github/callback`
      : `${backendUrl}/api/v1/auth/github/callback`;
    
    try {
      const response = await fetch(exchangeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          return data.access_token;
        }
      }
    } catch (error) {
      console.warn('Backend code exchange failed, trying direct exchange:', error);
    }
  }
  
  // Option 2: Exchange directly (requires client secret - not recommended for production)
  if (!clientSecret) {
    throw new Error(
      'GitHub client secret not found. Either set REACT_APP_GITHUB_CLIENT_SECRET ' +
      'or implement a backend endpoint at /api/v1/auth/github/callback to exchange the code.'
    );
  }
  
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });
    
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error_description || data.error);
    }
    
    if (data.access_token) {
      return data.access_token;
    }
    
    throw new Error('No access token received from GitHub');
  } catch (error) {
    console.error('Failed to exchange GitHub code:', error);
    throw error;
  }
};

