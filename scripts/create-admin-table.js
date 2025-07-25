const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminTable() {
  try {
    console.log('🔧 Creating admin_users table...');

    // Create the admin_users table using RPC
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL UNIQUE,
          email TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'admin',
          permissions TEXT[] DEFAULT ARRAY['manage_invitations', 'manage_stories', 'manage_users', 'view_analytics'],
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
        CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
      `
    });

    if (createError) {
      console.error('❌ Error creating table:', createError);
      
      // Try alternative approach - create table directly
      console.log('🔄 Trying alternative approach...');
      
      // First, let's get a user from auth.users
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('id, email')
        .limit(1);

      if (authError || !authUsers || authUsers.length === 0) {
        console.log('⚠️  No users found in auth.users table');
        console.log('💡 Please sign up first, then run this script again');
        return;
      }

      const user = authUsers[0];
      console.log(`👤 Found user: ${user.email} (ID: ${user.id})`);

      // Create a simple admin entry
      const { data: adminData, error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: user.id,
          email: user.email,
          role: 'admin',
          permissions: ['manage_invitations', 'manage_stories', 'manage_users', 'view_analytics'],
          is_active: true
        })
        .select();

      if (insertError) {
        console.error('❌ Error inserting admin user:', insertError);
        console.log('💡 You may need to create the admin_users table manually in Supabase dashboard');
        return;
      }

      console.log('✅ Successfully created admin user:', adminData);
      console.log('🎉 You can now access the admin dashboard!');
      console.log('🔗 Try visiting: http://localhost:3003/admin/invitations');
    } else {
      console.log('✅ Admin users table created successfully');
      
      // Now add a test admin user
      const { data: authUsers, error: authError } = await supabase
        .from('auth.users')
        .select('id, email')
        .limit(1);

      if (authError || !authUsers || authUsers.length === 0) {
        console.log('⚠️  No users found in auth.users table');
        console.log('💡 Please sign up first, then run this script again');
        return;
      }

      const user = authUsers[0];
      console.log(`👤 Found user: ${user.email} (ID: ${user.id})`);

      const { data: adminData, error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: user.id,
          email: user.email,
          role: 'admin',
          permissions: ['manage_invitations', 'manage_stories', 'manage_users', 'view_analytics'],
          is_active: true
        })
        .select();

      if (insertError) {
        console.error('❌ Error inserting admin user:', insertError);
        return;
      }

      console.log('✅ Successfully created admin user:', adminData);
      console.log('🎉 You can now access the admin dashboard!');
      console.log('🔗 Try visiting: http://localhost:3003/admin/invitations');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAdminTable(); 