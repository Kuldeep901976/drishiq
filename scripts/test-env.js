require('dotenv').config({ path: '.env.local' });

console.log('🔧 Testing environment variables...');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
  }
});

console.log('\n🔧 Testing service client creation...');

try {
  const { createServiceClient } = require('./lib/supabase');
  const client = createServiceClient();
  
  if (client) {
    console.log('✅ Service client created successfully');
  } else {
    console.log('❌ Service client is null');
  }
} catch (error) {
  console.error('❌ Error creating service client:', error.message);
} 