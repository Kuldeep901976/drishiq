const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addCurrentUserAsAdmin() {
  try {
    console.log('Adding current user as admin...');

    // First, let's see what users exist
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, created_at')
      .limit(10);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log('Existing users:', users);

    if (users && users.length > 0) {
      // Use the first user as admin
      const adminUser = users[0];
      
      // Check if admin_users table exists and add the user
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .upsert({
          user_id: adminUser.id,
          email: adminUser.email,
          role: 'admin',
          permissions: ['manage_invitations', 'manage_stories', 'manage_users', 'view_analytics'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (adminError) {
        console.error('Error adding admin user:', adminError);
        
        // If admin_users table doesn't exist, let's create it
        console.log('Creating admin_users table...');
        const { error: createError } = await supabase.rpc('create_admin_users_table');
        
        if (createError) {
          console.error('Error creating admin_users table:', createError);
          return;
        }
        
        // Try again
        const { data: retryData, error: retryError } = await supabase
          .from('admin_users')
          .upsert({
            user_id: adminUser.id,
            email: adminUser.email,
            role: 'admin',
            permissions: ['manage_invitations', 'manage_stories', 'manage_users', 'view_analytics'],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (retryError) {
          console.error('Error on retry:', retryError);
          return;
        }

        console.log('Successfully added admin user:', retryData);
      } else {
        console.log('Successfully added admin user:', adminData);
      }
    } else {
      console.log('No users found. Please create a user first.');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

addCurrentUserAsAdmin(); 