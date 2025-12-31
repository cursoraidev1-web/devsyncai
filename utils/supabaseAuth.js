/**
 * Supabase Auth Client Utility
 * 
 * This utility initializes and exports the Supabase client for authentication.
 * The client is configured to work with frontend on Vercel and backend on Render.
 */

import { createClient } from '@supabase/supabase-js';

let supabaseAuthClient = null;

/**
 * Get or create Supabase Auth client
 * @returns {Object} Supabase client instance
 */
export const getSupabaseAuthClient = () => {
  if (supabaseAuthClient) {
    return supabaseAuthClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
  }

  supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Redirect to frontend after OAuth callback
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return supabaseAuthClient;
};

export default getSupabaseAuthClient;


