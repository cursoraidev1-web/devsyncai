import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Create Supabase client for server-side operations
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Create Supabase client with anon key (for client-like operations)
export const supabaseAnon = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Database table names (for consistency)
export const TABLES = {
  USERS: 'users',
  PROJECTS: 'projects',
  PROJECT_MEMBERS: 'project_members',
  PRDS: 'prds',
  PRD_VERSIONS: 'prd_versions',
  PRD_SECTIONS: 'prd_sections',
  DOCUMENTS: 'documents',
  TASKS: 'tasks',
  TASK_COMMENTS: 'task_comments',
  NOTIFICATIONS: 'notifications',
  INTEGRATIONS: 'integrations',
  GITHUB_REPOS: 'github_repos',
  COMMITS: 'commits',
  DEPLOYMENTS: 'deployments',
  AUDIT_LOGS: 'audit_logs',
  ANALYTICS_EVENTS: 'analytics_events',
} as const;

// Storage bucket names
export const BUCKETS = {
  DOCUMENTS: 'documents',
  AVATARS: 'avatars',
  ATTACHMENTS: 'attachments',
} as const;

export default supabase;
