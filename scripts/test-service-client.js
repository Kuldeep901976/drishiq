const { createServiceClient } = require('../lib/supabase');

async function testServiceClient() {
  try {
    console.log('🔧 Testing Supabase service client...');
    
    const supabase = createServiceClient();
    console.log('✅ Service client created successfully');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('Invitations')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Error accessing Invitations table:', error);
      return;
    }
    
    console.log('✅ Successfully connected to Invitations table');
    console.log('Count:', data);
    
    // Test fetching actual invitations
    const { data: invitations, error: fetchError } = await supabase
      .from('Invitations')
      .select('*')
      .limit(5);
    
    if (fetchError) {
      console.error('❌ Error fetching invitations:', fetchError);
      return;
    }
    
    console.log('✅ Successfully fetched invitations');
    console.log(`Found ${invitations.length} invitations`);
    if (invitations.length > 0) {
      console.log('Sample invitation:', invitations[0]);
    }
    
  } catch (error) {
    console.error('❌ Error in test:', error);
  }
}

testServiceClient(); 