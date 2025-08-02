const { execSync } = require('child_process');

// Check environment variables setup
try {
  console.log('Checking environment variables...');
  
  // Use environment variables from .env.local or process.env
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required environment variables. Please check your .env.local file.');
  }

  console.log('✅ Environment variables are properly configured');
  console.log('📝 Make sure to set these variables in your deployment platform:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY (if needed)');
} catch (error) {
  console.error('❌ Error checking environment variables:', error.message);
  process.exit(1);
} 