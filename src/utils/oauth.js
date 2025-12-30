/**
 * OAuth utility functions using Supabase Auth
 * 
 * This module uses Supabase's built-in OAuth flow which handles:
 * - Authorization URL generation
 * - Code exchange
 * - Token management
 * - Session persistence
 * 
 * The frontend handles the login and Supabase automatically syncs the user to the database.
 */

import { getSupabaseAuthClient } from './supabaseAuth';

/**
 * Sign in with Google OAuth using Supabase
 * @param {Object} options - Optional configuration
 * @param {string} options.redirectTo - Custom redirect URL (defaults to /auth/callback)
 * @returns {Promise<void>} Redirects to Google OAuth
 */
export const signInWithGoogle = async (options = {}) => {
  const supabase = getSupabaseAuthClient();
  
  const redirectTo = options.redirectTo || `${window.location.origin}/auth/callback`;
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    throw new Error(`Failed to initiate Google login: ${error.message}`);
  }
};

/**
 * Sign in with GitHub OAuth using Supabase
 * @param {Object} options - Optional configuration
 * @param {string} options.redirectTo - Custom redirect URL (defaults to /auth/callback)
 * @returns {Promise<void>} Redirects to GitHub OAuth
 */
export const signInWithGitHub = async (options = {}) => {
  const supabase = getSupabaseAuthClient();
  
  const redirectTo = options.redirectTo || `${window.location.origin}/auth/callback`;
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo,
      scopes: 'user:email',
    },
  });

  if (error) {
    throw new Error(`Failed to initiate GitHub login: ${error.message}`);
  }
};

/**
 * Get the current Supabase session
 * @returns {Promise<Object|null>} Current session or null
 */
export const getSupabaseSession = async () => {
  const supabase = getSupabaseAuthClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting Supabase session:', error);
    return null;
  }
  
  return session;
};

/**
 * Get the current Supabase user
 * @returns {Promise<Object|null>} Current user or null
 */
export const getSupabaseUser = async () => {
  const supabase = getSupabaseAuthClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting Supabase user:', error);
    return null;
  }
  
  return user;
};

/**
 * Sign out from Supabase
 * @returns {Promise<void>}
 */
export const signOutFromSupabase = async () => {
  const supabase = getSupabaseAuthClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(`Failed to sign out: ${error.message}`);
  }
};

/**
 * Legacy function names for backward compatibility
 * These redirect to the new Supabase OAuth flow
 */
export const getGoogleOAuthUrl = () => {
  // This function is kept for backward compatibility
  // It will trigger the OAuth flow directly
  return signInWithGoogle();
};

export const getGitHubOAuthUrl = () => {
  // This function is kept for backward compatibility
  // It will trigger the OAuth flow directly
  return signInWithGitHub();
};

/**
 * @deprecated These functions are no longer needed with Supabase Auth
 * Supabase handles code exchange automatically
 */
export const exchangeGoogleCode = async () => {
  throw new Error('exchangeGoogleCode is deprecated. Supabase handles code exchange automatically.');
};

export const exchangeGitHubCode = async () => {
  throw new Error('exchangeGitHubCode is deprecated. Supabase handles code exchange automatically.');
};

export const sendGoogleTokenToBackend = async () => {
  throw new Error('sendGoogleTokenToBackend is deprecated. Use Supabase session instead.');
};

export const sendGitHubTokenToBackend = async () => {
  throw new Error('sendGitHubTokenToBackend is deprecated. Use Supabase session instead.');
};
