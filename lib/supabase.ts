import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../supabase.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Ensure environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

// Create client - will never be null
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Hook for client components
export const useSupabase = () => {
  const supabase = createClientComponentClient<Database>();
  return { supabase };
};

// Helper types for better TypeScript support
export type Tables = Database['public']['Tables'];
export type UserRow = Tables['users']['Row'];
export type UserFlowProgressRow = Tables['user_flow_progress']['Row'];

// Export a function for compatibility with existing imports
export function createServiceClient() {
  return supabase;
}
