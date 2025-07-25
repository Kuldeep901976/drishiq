const { createClient } = require('@supabase/supabase-js');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createUserProfile() {
  try {
    console.log('🔍 Finding authenticated users...');
    
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }
    
    console.log(`Found ${authUsers.users.length} users in auth.users`);
    
    // Check which users don't have profiles in public.users
    for (const authUser of authUsers.users) {
      console.log(`\n👤 Checking user: ${authUser.email} (${authUser.id})`);
      
      // Check if user profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .single();
      
      if (profileError && profileError.code === 'PGRST116') {
        // User profile doesn't exist, create it
        console.log('📝 Creating user profile...');
        
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User',
            avatar_url: authUser.user_metadata?.avatar_url,
            auth_provider: authUser.user_metadata?.provider ? 'social' : 'email',
            language: 'en',
            is_profile_complete: false,
            created_at: authUser.created_at
          })
          .select()
          .single();
        
        if (createError) {
          console.error('❌ Failed to create profile:', createError);
        } else {
          console.log('✅ User profile created successfully!');
        }
      } else if (profileError) {
        console.error('❌ Error checking profile:', profileError);
      } else {
        console.log('✅ User profile already exists');
      }
    }
    
    console.log('\n🎉 User profile creation process completed!');
    
  } catch (error) {
    console.error('❌ Error in createUserProfile:', error);
  }
}

createUserProfile(); 