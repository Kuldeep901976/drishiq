const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInvitationsConnection() {
  try {
    console.log('Testing connection to Supabase Invitations table...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('Invitations')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Error querying Invitations table:', error);
      return;
    }

    console.log(`Found ${data?.length || 0} invitations in the table`);
    
    if (data && data.length > 0) {
      console.log('Sample invitation data:');
      console.log(JSON.stringify(data[0], null, 2));
      
      // Check invitation types
      const types = [...new Set(data.map(i => i.invitation_type))];
      console.log('Invitation types found:', types);
      
      // Check statuses
      const statuses = [...new Set(data.map(i => i.status))];
      console.log('Statuses found:', statuses);
    } else {
      console.log('No invitations found in the table');
      
      // Let's check if the table exists and has the right structure
      console.log('\nChecking table structure...');
      const { data: tableInfo, error: tableError } = await supabase
        .from('Invitations')
        .select('*')
        .limit(0);
        
      if (tableError) {
        console.error('Table structure error:', tableError);
      } else {
        console.log('Table exists and is accessible');
      }
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testInvitationsConnection(); 