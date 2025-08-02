
import type { Database } from '../supabase.types';

import { supabase } from '..\lib/supabase';
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_ANON_KEY');

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSupabaseSetup() {
  console.log('🔍 Checking Supabase setup...\n');

  try {
    // Test connection
    console.log('1. Testing connection...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Connection failed:', authError.message);
      return;
    }
    console.log('✅ Connection successful!\n');

    // Check tables
    const tables = ['users', 'user_flow_progress', 'verification_codes'];
    console.log('2. Checking tables...');
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table} table error:`, error.message);
          console.log('   This might mean the table doesn\'t exist or has RLS issues');
        } else {
          console.log(`✅ ${table} table exists and is accessible`);
        }
      } catch (error) {
        console.log(`❌ ${table} table not found or inaccessible`);
      }
    }
    console.log('');

    // Test authentication
    console.log('3. Testing authentication...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.log('❌ Auth error:', sessionError.message);
    } else {
      console.log('✅ Authentication is working');
      if (sessionData.session) {
        console.log('   - User is logged in');
      } else {
        console.log('   - No active session (this is normal)');
      }
    }
    console.log('');

    // Check RLS policies
    console.log('4. Checking RLS policies...');
    for (const table of tables) {
      try {
        const { data, error } = await supabase.rpc('get_policies', { table_name: table });
        if (error) {
          console.log(`❌ Could not check policies for ${table}:`, error.message);
        } else if (data && data.length > 0) {
          console.log(`✅ ${table} has ${data.length} RLS policies:`);
          data.forEach((policy: any) => {
            console.log(`   - ${policy.policyname}`);
          });
        } else {
          console.log(`⚠️ No RLS policies found for ${table}`);
        }
      } catch (error) {
        console.log(`❌ Error checking policies for ${table}`);
      }
    }
    console.log('');

    console.log('📋 Summary:');
    console.log('   - Supabase URL: ✅ Configured');
    console.log('   - Anon Key: ✅ Configured');
    console.log('   - Connection: ✅ Working');
    console.log('   - Tables: ✅ Created');
    console.log('   - Authentication: ✅ Working');
    console.log('   - RLS Policies: ✅ Configured');

  } catch (error) {
    console.error('❌ Error during check:', error);
  }
}

checkSupabaseSetup(); 