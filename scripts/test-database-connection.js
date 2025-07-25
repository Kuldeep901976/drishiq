const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Service Key exists:', !!supabaseServiceKey);

    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('Invitations')
      .select('*', { count: 'exact', head: true });

    if (testError) {
      console.error('❌ Database connection error:', testError);
      return;
    }

    console.log('✅ Database connection successful');

    // Check if Invitations table exists and has data
    const { data: invitations, error: invitationsError } = await supabase
      .from('Invitations')
      .select('*')
      .limit(10);

    if (invitationsError) {
      console.error('❌ Error fetching invitations:', invitationsError);
      return;
    }

    console.log(`📊 Found ${invitations?.length || 0} invitations in database`);

    if (invitations && invitations.length > 0) {
      console.log('📋 Sample invitation data:');
      invitations.forEach((inv, index) => {
        console.log(`${index + 1}. ${inv.name} (${inv.email}) - Type: ${inv.invitation_type} - Status: ${inv.status}`);
      });

      // Calculate stats
      const stats = {
        total: invitations.length,
        pending: invitations.filter(i => i.status === 'pending').length,
        approved: invitations.filter(i => i.status === 'approved').length,
        used: invitations.filter(i => i.status === 'used').length,
        expired: invitations.filter(i => i.status === 'expired').length,
        trial: invitations.filter(i => i.invitation_type === 'trial').length,
        needSupport: invitations.filter(i => i.invitation_type === 'need_support').length,
        testimonials: invitations.filter(i => i.invitation_type === 'testimonials').length,
        bulkUploaded: invitations.filter(i => i.invitation_type === 'bulk_uploaded').length
      };

      console.log('📈 Calculated stats:', stats);
    } else {
      console.log('⚠️  No invitations found in database');
      console.log('💡 You may need to run the SQL commands in Supabase dashboard');
    }

    // Check admin_users table
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(5);

    if (adminError) {
      console.error('❌ Error fetching admin users:', adminError);
      console.log('💡 Admin users table may not exist');
    } else {
      console.log(`👥 Found ${adminUsers?.length || 0} admin users`);
      if (adminUsers && adminUsers.length > 0) {
        adminUsers.forEach(admin => {
          console.log(`- ${admin.email} (${admin.role})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testDatabaseConnection(); 