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

async function addTestInvitations() {
  try {
    console.log('Adding test invitations to Supabase...');
    
    const testInvitations = [
      {
        name: 'John Doe',
        email: 'john.trial@example.com',
        phone: '+1234567890',
        language: 'en',
        challenge: 'Looking for trial access to evaluate platform features',
        status: 'pending',
        invitation_type: 'trial',
        created_at: new Date().toISOString()
      },
      {
        name: 'Jane Smith',
        email: 'jane.support@example.com',
        phone: '+1234567891',
        language: 'en',
        challenge: 'Need technical support with advanced features',
        status: 'approved',
        invitation_type: 'need_support',
        credits_allocated: 1,
        supporter_id: 'test-admin-id',
        credit_allocation_date: new Date().toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        name: 'Mike Johnson',
        email: 'mike.testimonial@example.com',
        phone: '+1234567892',
        language: 'en',
        challenge: 'Want to share success story about transformation',
        status: 'approved',
        invitation_type: 'testimonials',
        testimonial_rating: 5,
        testimonial_content: 'DrishiQ completely transformed how I approach problem-solving. The AI insights are incredible!',
        testimonial_category: 'transformation',
        is_featured_testimonial: true,
        featured_position: 1,
        created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.bulk@example.com',
        phone: '+1234567893',
        language: 'en',
        challenge: 'Bulk upload for enterprise team evaluation',
        status: 'pending',
        invitation_type: 'bulk_uploaded',
        bulk_upload_id: 'test-upload-id',
        upload_row_number: 1,
        created_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      },
      {
        name: 'David Brown',
        email: 'david.used@example.com',
        phone: '+1234567894',
        language: 'en',
        challenge: 'Trial access for research project',
        status: 'used',
        invitation_type: 'trial',
        credits_allocated: 1,
        credits_used: 1,
        credit_allocation_date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        credit_usage_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        created_at: new Date(Date.now() - 345600000).toISOString() // 4 days ago
      },
      {
        name: 'Lisa Garcia',
        email: 'lisa.expired@example.com',
        phone: '+1234567895',
        language: 'es',
        challenge: 'Support request for integration',
        status: 'expired',
        invitation_type: 'need_support',
        created_at: new Date(Date.now() - 432000000).toISOString() // 5 days ago
      }
    ];

    console.log(`Inserting ${testInvitations.length} test invitations...`);
    
    const { data, error } = await supabase
      .from('Invitations')
      .insert(testInvitations)
      .select();

    if (error) {
      console.error('Error inserting test invitations:', error);
      return;
    }

    console.log(`Successfully inserted ${data?.length || 0} test invitations`);
    
    // Verify the data was inserted
    const { data: verifyData, error: verifyError } = await supabase
      .from('Invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (verifyError) {
      console.error('Error verifying data:', verifyError);
      return;
    }

    console.log(`Total invitations in table: ${verifyData?.length || 0}`);
    
    // Show stats
    const stats = {
      total: verifyData?.length || 0,
      pending: verifyData?.filter(i => i.status === 'pending').length || 0,
      approved: verifyData?.filter(i => i.status === 'approved').length || 0,
      used: verifyData?.filter(i => i.status === 'used').length || 0,
      expired: verifyData?.filter(i => i.status === 'expired').length || 0,
      trial: verifyData?.filter(i => i.invitation_type === 'trial').length || 0,
      needSupport: verifyData?.filter(i => i.invitation_type === 'need_support').length || 0,
      testimonials: verifyData?.filter(i => i.invitation_type === 'testimonials').length || 0,
      bulkUploaded: verifyData?.filter(i => i.invitation_type === 'bulk_uploaded').length || 0
    };

    console.log('Current stats:', stats);

  } catch (error) {
    console.error('Failed to add test invitations:', error);
  }
}

addTestInvitations(); 