const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupVercelEnv() {
  console.log('🚀 Setting up Vercel environment variables for DrishiQ...\n');

  try {
    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'pipe' });
    } catch (error) {
      console.error('❌ Vercel CLI not found. Please install it first:');
      console.error('   npm i -g vercel');
      process.exit(1);
    }

    // Get environment variables from user
    console.log('📝 Please provide your environment variables:\n');

    const supabaseUrl = await question('Supabase URL: ');
    const supabaseAnonKey = await question('Supabase Anon Key: ');
    const supabaseServiceKey = await question('Supabase Service Role Key: ');
    
    const firebaseApiKey = await question('Firebase API Key: ');
    const firebaseAuthDomain = await question('Firebase Auth Domain: ');
    const firebaseProjectId = await question('Firebase Project ID: ');
    const firebaseStorageBucket = await question('Firebase Storage Bucket: ');
    const firebaseMessagingSenderId = await question('Firebase Messaging Sender ID: ');
    const firebaseAppId = await question('Firebase App ID: ');
    
    const blobToken = await question('Vercel Blob Token (optional, press Enter to skip): ');

    console.log('\n🔧 Setting up environment variables in Vercel...\n');

    // Set Supabase variables
    execSync(`vercel env add NEXT_PUBLIC_SUPABASE_URL production`, { 
      stdio: 'inherit',
      input: supabaseUrl + '\n'
    });
    
    execSync(`vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production`, { 
      stdio: 'inherit',
      input: supabaseAnonKey + '\n'
    });

    execSync(`vercel env add SUPABASE_SERVICE_ROLE_KEY production`, { 
      stdio: 'inherit',
      input: supabaseServiceKey + '\n'
    });

    // Set Firebase variables
    execSync(`vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production`, { 
      stdio: 'inherit',
      input: firebaseApiKey + '\n'
    });

    execSync(`vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production`, { 
      stdio: 'inherit',
      input: firebaseAuthDomain + '\n'
    });

    execSync(`vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production`, { 
      stdio: 'inherit',
      input: firebaseProjectId + '\n'
    });

    execSync(`vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production`, { 
      stdio: 'inherit',
      input: firebaseStorageBucket + '\n'
    });

    execSync(`vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production`, { 
      stdio: 'inherit',
      input: firebaseMessagingSenderId + '\n'
    });

    execSync(`vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production`, { 
      stdio: 'inherit',
      input: firebaseAppId + '\n'
    });

    // Set optional Blob token if provided
    if (blobToken.trim()) {
      execSync(`vercel env add BLOB_READ_WRITE_TOKEN production`, { 
        stdio: 'inherit',
        input: blobToken + '\n'
      });
    }

    console.log('\n✅ Environment variables set successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Deploy your project: vercel --prod');
    console.log('2. Set up custom domain in Vercel dashboard');
    console.log('3. Test all authentication flows');
    console.log('4. Verify Supabase and Firebase connections');

  } catch (error) {
    console.error('❌ Error setting up environment variables:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupVercelEnv(); 