const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDashboardAPI() {
  try {
    console.log('🔧 Testing dashboard API functionality...');

    // Test the same queries that the dashboard API uses
    console.log('\n1. Testing invitation statistics...');
    
    const { data: invitations, error: invError } = await supabase
      .from('Invitations')
      .select('status, created_at');

    if (invError) {
      console.error('Error accessing Invitations:', invError);
    } else {
      console.log('✅ Invitations found:', invitations?.length || 0);
      
      const invitationCounts = invitations?.reduce((acc, inv) => {
        acc[inv.status] = (acc[inv.status] || 0) + 1;
        return acc;
      }, {}) || {};

      console.log('📊 Invitation counts:');
      console.log('- Total:', invitations?.length || 0);
      console.log('- Pending:', invitationCounts.pending || 0);
      console.log('- Approved:', invitationCounts.approved || 0);
      console.log('- Used:', invitationCounts.used || 0);
      console.log('- Expired:', invitationCounts.expired || 0);
    }

    // Test invitation type data
    console.log('\n2. Testing invitation type data...');
    
    const types = ['investment_management', 'story', 'testimonial'];
    for (const type of types) {
      const { data } = await supabase
        .from('Invitations')
        .select('status, created_at')
        .eq('invitation_type', type);

      const counts = data?.reduce((acc, inv) => {
        acc[inv.status] = (acc[inv.status] || 0) + 1;
        return acc;
      }, {}) || {};

      console.log(`📊 ${type}:`, {
        total: data?.length || 0,
        pending: counts.pending || 0,
        approved: counts.approved || 0,
        used: counts.used || 0,
        expired: counts.expired || 0
      });
    }

    // Test monthly trends
    console.log('\n3. Testing monthly trends...');
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const { data: recentInvitations } = await supabase
      .from('Invitations')
      .select('created_at, invitation_type')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    console.log('📈 Recent invitations (last 30 days):', recentInvitations?.length || 0);

    // Test recent activity
    console.log('\n4. Testing recent activity...');
    
    const { data: recentActivity } = await supabase
      .from('Invitations')
      .select('id, name, email, status, created_at, invitation_type')
      .order('created_at', { ascending: false })
      .limit(10);

    console.log('📋 Recent activity:');
    if (recentActivity && recentActivity.length > 0) {
      recentActivity.forEach((inv, index) => {
        console.log(`${index + 1}. ${inv.name || inv.email} (${inv.status}) - ${new Date(inv.created_at).toLocaleDateString()}`);
      });
    } else {
      console.log('No recent activity found');
    }

    console.log('\n✅ Dashboard API test completed successfully!');
    console.log('🎉 The dashboard should now show the correct invitation data');

  } catch (error) {
    console.error('❌ Error testing dashboard API:', error);
  }
}

testDashboardAPI(); 