import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../supabase.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
}) : null;

// Hook for client components
export const useSupabase = () => {
  const supabase = createClientComponentClient<Database>();
  return { supabase };
};

// Helper types for better TypeScript support
export type Tables = Database['public']['Tables'];
export type UserRow = Tables['users']['Row'];
export type UserFlowProgressRow = Tables['user_flow_progress']['Row'];
