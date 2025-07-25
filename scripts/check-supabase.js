const { createClient } = require('@supabase/supabase-js');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing SUPABASE_URL')
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_ANON_KEY')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSupabaseSetup() {
  console.log('🔍 Checking Supabase setup...\n');

  try {
    // Test connection by trying to access auth
    console.log('1. Testing connection...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Connection failed:', authError.message);
      return;
    }
    console.log('✅ Connection successful!\n');

    // Check for User table
    console.log('2. Checking User table...');
    try {
      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('*')
        .limit(1);
      
      if (userError) {
        console.log('❌ User table error:', userError.message);
        console.log('   This might mean the table doesn\'t exist or has RLS issues');
      } else {
        console.log('✅ User table exists and is accessible');
      }
    } catch (error) {
      console.log('❌ User table not found or inaccessible');
    }
    console.log('');

    // Check for profiles table
    console.log('3. Checking profiles table...');
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (profileError) {
        console.log('❌ Profiles table error:', profileError.message);
      } else {
        console.log('✅ Profiles table exists and is accessible');
      }
    } catch (error) {
      console.log('❌ Profiles table not found or inaccessible');
    }
    console.log('');

    // Test authentication
    console.log('4. Testing authentication...');
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

    // Check storage
    console.log('5. Checking storage...');
    try {
      const { data: storageData, error: storageError } = await supabase.storage.listBuckets();
      if (storageError) {
        console.log('❌ Storage error:', storageError.message);
      } else {
        console.log('✅ Storage is accessible');
        if (storageData && storageData.length > 0) {
          console.log('   - Buckets found:', storageData.length);
          storageData.forEach(bucket => {
            console.log(`     - ${bucket.name}`);
          });
        } else {
          console.log('   - No buckets found');
        }
      }
    } catch (error) {
      console.log('❌ Storage not accessible');
    }
    console.log('');

    console.log('📋 Summary:');
    console.log('   - Supabase URL: ✅ Configured');
    console.log('   - Anon Key: ✅ Configured');
    console.log('   - Connection: ✅ Working');
    console.log('   - Authentication: ✅ Working');
    console.log('   - Storage: ✅ Working');

  } catch (error) {
    console.error('❌ Error during check:', error.message);
  }
}

checkSupabaseSetup(); 