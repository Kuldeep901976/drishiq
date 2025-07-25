const { execSync } = require('child_process');

// Add environment variables using Vercel CLI
try {
  console.log('Setting up environment variables...');
  
  // Use environment variables from .env.local or process.env
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required environment variables. Please check your .env.local file.');
  }

  execSync(`vercel env add NEXT_PUBLIC_SUPABASE_URL production`, { stdio: 'inherit' });
  execSync(`vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production`, { stdio: 'inherit' });

  console.log('✅ Environment variables set successfully');
} catch (error) {
  console.error('❌ Error setting up environment variables:', error.message);
  process.exit(1);
} 