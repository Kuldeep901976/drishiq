const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkInvitationTypes() {
  try {
    console.log('Checking invitation types in database...\n');
    
    const { data, error } = await supabase
      .from('Invitations')
      .select('*');

    if (error) {
      console.error('Database error:', error);
      return;
    }

    console.log(`Total invitations: ${data?.length || 0}\n`);

    if (data && data.length > 0) {
      // Check invitation types
      const types = [...new Set(data.map(i => i.invitation_type))];
      console.log('Invitation types found:', types);
      
      // Check statuses
      const statuses = [...new Set(data.map(i => i.status))];
      console.log('Statuses found:', statuses);
      
      // Show sample data
      console.log('\nSample invitations:');
      data.slice(0, 3).forEach((inv, index) => {
        console.log(`${index + 1}. ${inv.name} (${inv.email}) - Type: ${inv.invitation_type} - Status: ${inv.status}`);
      });
      
      // Count by type
      console.log('\nCount by invitation type:');
      const typeCounts = {};
      data.forEach(inv => {
        typeCounts[inv.invitation_type] = (typeCounts[inv.invitation_type] || 0) + 1;
      });
      Object.entries(typeCounts).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
      
      // Count by status
      console.log('\nCount by status:');
      const statusCounts = {};
      data.forEach(inv => {
        statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1;
      });
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count}`);
      });
    } else {
      console.log('No invitations found in database');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkInvitationTypes(); 