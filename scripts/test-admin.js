const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAdmin() {
  try {
    console.log('Testing admin system...');

    // Check if admin_users table exists and has data
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*');

    if (adminError) {
      console.error('Error accessing admin_users table:', adminError);
    } else {
      console.log('Admin users found:', adminUsers?.length || 0);
      if (adminUsers && adminUsers.length > 0) {
        adminUsers.forEach(user => {
          console.log(`- ${user.email} (${user.role})`);
        });
      }
    }

    // Check if Invitations table exists and has data
    const { data: invitations, error: invError } = await supabase
      .from('Invitations')
      .select('*');

    if (invError) {
      console.error('Error accessing Invitations table:', invError);
    } else {
      console.log('Invitations found:', invitations?.length || 0);
      if (invitations && invitations.length > 0) {
        invitations.forEach(inv => {
          console.log(`- ${inv.email} (${inv.status})`);
        });
      }
    }

    // Check if User table exists and has data (capital U)
    const { data: users, error: usersError } = await supabase
      .from('User')
      .select('*');

    if (usersError) {
      console.error('Error accessing User table:', usersError);
    } else {
      console.log('Users found:', users?.length || 0);
      if (users && users.length > 0) {
        users.slice(0, 5).forEach(user => {
          console.log(`- ${user.email} (${user.id})`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testAdmin(); 