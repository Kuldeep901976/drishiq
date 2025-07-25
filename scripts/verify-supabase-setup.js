const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

console.log('=== Supabase Connection Verification ===');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Environment Variables:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ Set' : '✗ Missing');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Missing required environment variables');
  console.log('\nPlease check your .env.local file and ensure:');
  console.log('1. NEXT_PUBLIC_SUPABASE_URL is set');
  console.log('2. SUPABASE_SERVICE_ROLE_KEY is set');
  console.log('3. NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
  process.exit(1);
}

console.log('\n✅ Environment variables are configured');

// Test connection
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  try {
    console.log('\n=== Testing Supabase Connection ===');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('Invitations')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.log('\nPossible issues:');
      console.log('1. Supabase URL is incorrect');
      console.log('2. Service role key is invalid');
      console.log('3. Invitations table does not exist');
      console.log('4. RLS policies are blocking access');
      return;
    }

    console.log('✅ Successfully connected to Supabase');
    console.log('✅ Invitations table is accessible');

    // Check table structure
    console.log('\n=== Checking Table Structure ===');
    const { data: structure, error: structureError } = await supabase
      .from('Invitations')
      .select('*')
      .limit(0);

    if (structureError) {
      console.error('❌ Table structure error:', structureError.message);
    } else {
      console.log('✅ Table structure is valid');
    }

    // Count total records
    console.log('\n=== Counting Records ===');
    const { count, error: countError } = await supabase
      .from('Invitations')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count error:', countError.message);
    } else {
      console.log(`📊 Total invitations in table: ${count || 0}`);
      
      if (count === 0) {
        console.log('\n💡 The table is empty. You can add test data by running:');
        console.log('   node scripts/add-test-invitations.js');
      }
    }

    // Check for sample data
    if (count > 0) {
      console.log('\n=== Sample Data ===');
      const { data: sample, error: sampleError } = await supabase
        .from('Invitations')
        .select('*')
        .limit(3);

      if (sampleError) {
        console.error('❌ Sample data error:', sampleError.message);
      } else {
        console.log('Sample invitations:');
        sample.forEach((inv, index) => {
          console.log(`${index + 1}. ${inv.name} (${inv.email}) - ${inv.status} - ${inv.invitation_type}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection(); 