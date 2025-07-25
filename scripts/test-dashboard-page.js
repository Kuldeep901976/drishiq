const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDashboardPage() {
  try {
    console.log('🔧 Testing dashboard page API calls...');

    // First, let's check if we can access the dashboard API directly
    console.log('\n1. Testing dashboard API overview endpoint...');
    
    // Simulate what the dashboard page does
    const overviewResponse = await fetch('http://localhost:3009/api/admin/dashboard?action=overview', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Response status:', overviewResponse.status);
    console.log('Response ok:', overviewResponse.ok);

    if (overviewResponse.ok) {
      const overviewData = await overviewResponse.json();
      console.log('✅ Overview data:', overviewData);
    } else {
      const errorText = await overviewResponse.text();
      console.log('❌ Error response:', errorText);
    }

    // Test invitation types endpoint
    console.log('\n2. Testing invitation types endpoint...');
    
    const typeResponse = await fetch('http://localhost:3009/api/admin/dashboard?action=invitation-types', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Response status:', typeResponse.status);
    console.log('Response ok:', typeResponse.ok);

    if (typeResponse.ok) {
      const typeData = await typeResponse.json();
      console.log('✅ Type data:', typeData);
    } else {
      const errorText = await typeResponse.text();
      console.log('❌ Error response:', errorText);
    }

    // Test recent activity endpoint
    console.log('\n3. Testing recent activity endpoint...');
    
    const activityResponse = await fetch('http://localhost:3009/api/admin/dashboard?action=recent-activity', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Response status:', activityResponse.status);
    console.log('Response ok:', activityResponse.ok);

    if (activityResponse.ok) {
      const activityData = await activityResponse.json();
      console.log('✅ Activity data:', activityData);
    } else {
      const errorText = await activityResponse.text();
      console.log('❌ Error response:', errorText);
    }

    console.log('\n✅ Dashboard page API test completed!');

  } catch (error) {
    console.error('❌ Error testing dashboard page:', error);
  }
}

testDashboardPage(); 