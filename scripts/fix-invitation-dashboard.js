const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixInvitationDashboard() {
  try {
    console.log('🔧 Fixing Invitation Dashboard...');

    // 1. Check if admin_users table exists and create admin user
    console.log('📋 Checking admin_users table...');
    
    // First, let's see if we have any users in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('Error fetching auth users:', authError);
    } else {
      console.log(`Found ${authUsers.users.length} users in auth.users`);
      
      if (authUsers.users.length > 0) {
        const firstUser = authUsers.users[0];
        console.log(`Using first user: ${firstUser.email} (${firstUser.id})`);
        
        // Check if admin_users table exists
        const { data: adminTable, error: tableError } = await supabase
          .from('admin_users')
          .select('*')
          .limit(1);
        
        if (tableError) {
          console.log('admin_users table does not exist, creating it...');
          
          // Create admin_users table
          const { error: createError } = await supabase.rpc('exec_sql', {
            sql: `
              CREATE TABLE IF NOT EXISTS admin_users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL UNIQUE,
                email TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'admin',
                permissions TEXT[] DEFAULT ARRAY['manage_invitations', 'manage_stories', 'manage_users', 'view_analytics'],
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
              );
              
              CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
              CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
            `
          });
          
          if (createError) {
            console.error('Error creating admin_users table:', createError);
          } else {
            console.log('✅ admin_users table created');
          }
        }
        
        // Add user as admin
        const { error: insertError } = await supabase
          .from('admin_users')
          .upsert({
            user_id: firstUser.id,
            email: firstUser.email,
            role: 'admin',
            permissions: ['manage_invitations', 'manage_stories', 'manage_users', 'view_analytics'],
            is_active: true
          }, { onConflict: 'user_id' });
        
        if (insertError) {
          console.error('Error adding admin user:', insertError);
        } else {
          console.log('✅ Admin user added/updated');
        }
      }
    }

    // 2. Check Invitations table and add test data if needed
    console.log('📋 Checking Invitations table...');
    
    const { data: invitations, error: inviteError } = await supabase
      .from('Invitations')
      .select('*')
      .limit(5);
    
    if (inviteError) {
      console.error('Error checking Invitations table:', inviteError);
    } else {
      console.log(`Found ${invitations?.length || 0} invitations`);
      
      if (!invitations || invitations.length === 0) {
        console.log('Adding test invitation data...');
        
        const testInvitations = [
          {
            name: 'John Doe',
            email: 'john.trial@example.com',
            phone: '+1234567890',
            language: 'en',
            challenge: 'Looking for trial access to evaluate platform',
            status: 'pending',
            invitation_type: 'trial'
          },
          {
            name: 'Jane Smith',
            email: 'jane.support@example.com',
            phone: '+1234567891',
            language: 'en',
            challenge: 'Need technical support with features',
            status: 'pending',
            invitation_type: 'need_support'
          },
          {
            name: 'Bob Wilson',
            email: 'bob.testimonial@example.com',
            phone: '+1234567892',
            language: 'en',
            challenge: 'Want to share success story',
            status: 'approved',
            invitation_type: 'testimonials'
          },
          {
            name: 'Alice Brown',
            email: 'alice.bulk@example.com',
            phone: '+1234567893',
            language: 'en',
            challenge: 'Bulk upload for enterprise team',
            status: 'pending',
            invitation_type: 'bulk_uploaded'
          },
          {
            name: 'Charlie Davis',
            email: 'charlie.trial2@example.com',
            phone: '+1234567894',
            language: 'en',
            challenge: 'Trial access for research project',
            status: 'used',
            invitation_type: 'trial'
          }
        ];
        
        const { error: insertError } = await supabase
          .from('Invitations')
          .insert(testInvitations);
        
        if (insertError) {
          console.error('Error inserting test invitations:', insertError);
        } else {
          console.log('✅ Test invitation data added');
        }
      }
    }

    // 3. Test the API endpoints
    console.log('🧪 Testing API endpoints...');
    
    // Test stats endpoint
    const statsResponse = await fetch('http://localhost:3000/api/admin/invitations/stats');
    console.log('Stats API Status:', statsResponse.status);
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('Stats API Response:', stats);
    } else {
      const errorText = await statsResponse.text();
      console.log('Stats API Error:', errorText);
    }

    console.log('✅ Invitation Dashboard fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing invitation dashboard:', error);
  }
}

fixInvitationDashboard(); 