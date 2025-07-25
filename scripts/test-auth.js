const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  try {
    console.log('🔍 Testing authentication and data storage...');
    
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('ℹ️ No active session found');
      console.log('📝 Please sign in through the web interface first');
      return;
    }
    
    console.log('✅ Active session found for user:', session.user.email);
    
    // Check if user exists in User table
    const { data: userProfile, error: profileError } = await supabase
      .from('User')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Error fetching user profile:', profileError);
      return;
    }
    
    if (userProfile) {
      console.log('✅ User profile found in database:');
      console.log('   ID:', userProfile.id);
      console.log('   Email:', userProfile.email);
      console.log('   Full Name:', userProfile.full_name);
      console.log('   Preferred Language:', userProfile.preferred_language);
    } else {
      console.log('❌ User profile not found in database');
    }
    
    // Test inserting a test record
    console.log('\n🧪 Testing data insertion...');
    const testData = {
      id: session.user.id,
      email: session.user.email,
      full_name: 'Test User Updated',
      preferred_language: 'en'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('User')
      .upsert(testData)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error inserting test data:', insertError);
      return;
    }
    
    console.log('✅ Test data inserted successfully:');
    console.log('   Updated Full Name:', insertData.full_name);
    
    // Check all users in the table
    console.log('\n📊 All users in User table:');
    const { data: allUsers, error: allUsersError } = await supabase
      .from('User')
      .select('*');
    
    if (allUsersError) {
      console.error('❌ Error fetching all users:', allUsersError);
      return;
    }
    
    console.log(`   Total users: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.full_name} (${user.email})`);
    });
    
    console.log('\n🎉 Authentication and data storage test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuth(); 