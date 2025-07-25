const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupAdminAccess() {
  try {
    console.log('🔧 Setting up admin access...');
    
    // Get the user email from command line argument
    const userEmail = process.argv[2];
    
    if (!userEmail) {
      console.error('Please provide your email address as an argument');
      console.log('Usage: node setup-admin-access.js <your-email>');
      console.log('Example: node setup-admin-access.js admin@drishiq.com');
      process.exit(1);
    }

    console.log(`Looking for user: ${userEmail}`);

    // First, get the user ID from auth.users using direct SQL
    const { data: authUser, error: authError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', userEmail)
      .single();
    
    if (authError || !authUser) {
      console.error('❌ User not found:', authError?.message || 'User does not exist');
      console.log('Make sure you have signed up with this email address first');
      process.exit(1);
    }

    const userId = authUser.id;
    console.log(`✅ Found user: ${userEmail} (ID: ${userId})`);

    // Check if admin_users table exists, if not create it
    const { error: tableCheck } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);

    if (tableCheck && tableCheck.code === '42P01') {
      console.log('Creating admin_users table...');
      
      // Create the admin_users table
      const { error: createTableError } = await supabase.rpc('exec_sql', {
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

      if (createTableError) {
        console.error('❌ Failed to create admin_users table:', createTableError);
        process.exit(1);
      }
      
      console.log('✅ Created admin_users table');
    }

    // Check if user is already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingAdmin) {
      console.log('✅ User is already an admin with role:', existingAdmin.role);
      console.log('🎉 You can now access the admin dashboard at /admin/dashboard');
      return;
    }

    // Add user as admin
    const { data: adminUser, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        user_id: userId,
        email: userEmail,
        role: 'admin',
        permissions: ['manage_invitations', 'manage_stories', 'manage_users', 'view_analytics'],
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Failed to add admin:', insertError);
      process.exit(1);
    }

    console.log('✅ Successfully added user as admin:', adminUser);
    console.log('🎉 You can now access the admin dashboard at /admin/dashboard');
    console.log('🔗 Try visiting: http://localhost:3003/admin/invitations');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupAdminAccess(); 