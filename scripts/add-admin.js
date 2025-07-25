const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addAdmin() {
  try {
    // Get the current user's email from command line argument
    const userEmail = process.argv[2];
    
    if (!userEmail) {
      console.error('Please provide a user email as an argument');
      console.log('Usage: node add-admin.js <user-email>');
      process.exit(1);
    }

    // First, get the user ID from auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(userEmail);
    
    if (authError || !authUser.user) {
      console.error('User not found:', authError?.message || 'User does not exist');
      process.exit(1);
    }

    const userId = authUser.user.id;
    console.log(`Found user: ${userEmail} (ID: ${userId})`);

    // Check if user is already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingAdmin) {
      console.log('User is already an admin with role:', existingAdmin.role);
      return;
    }

    // Add user as admin
    const { data: adminUser, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        user_id: userId,
        email: userEmail,
        role: 'admin',
        permissions: ['read', 'write', 'delete'],
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to add admin:', insertError);
      process.exit(1);
    }

    console.log('Successfully added user as admin:', adminUser);
    console.log('You can now access the admin dashboard at /admin/dashboard');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addAdmin(); 