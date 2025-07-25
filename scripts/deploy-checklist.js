const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkEnvironmentVariables() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.log('⚠️  Missing environment variables:');
    missing.forEach(key => console.log(`   - ${key}`));
    return false;
  }
  
  return true;
}

function checkBuild() {
  try {
    console.log('🔨 Testing build process...');
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ Build successful');
    return true;
  } catch (error) {
    console.log('❌ Build failed');
    return false;
  }
}

function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

async function runDeploymentChecklist() {
  console.log('🚀 DrishiQ Deployment Checklist\n');

  let allChecksPassed = true;

  // Check 1: Required files
  console.log('1. Checking required files...');
  const requiredFiles = [
    'package.json',
    'next.config.js',
    'vercel.json',
    'tsconfig.json',
    'tailwind.config.js'
  ];

  for (const file of requiredFiles) {
    if (checkFileExists(file)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - Missing`);
      allChecksPassed = false;
    }
  }

  // Check 2: Environment variables
  console.log('\n2. Checking environment variables...');
  if (checkEnvironmentVariables()) {
    console.log('   ✅ All required environment variables are set');
  } else {
    console.log('   ❌ Missing environment variables');
    allChecksPassed = false;
  }

  // Check 3: Build process
  console.log('\n3. Testing build process...');
  if (checkBuild()) {
    console.log('   ✅ Build process works');
  } else {
    console.log('   ❌ Build process failed');
    allChecksPassed = false;
  }

  // Check 4: Vercel CLI
  console.log('\n4. Checking Vercel CLI...');
  if (checkVercelCLI()) {
    console.log('   ✅ Vercel CLI installed');
  } else {
    console.log('   ❌ Vercel CLI not installed');
    console.log('   💡 Install with: npm i -g vercel');
    allChecksPassed = false;
  }

  // Check 5: TypeScript
  console.log('\n5. Checking TypeScript...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('   ✅ TypeScript compilation successful');
  } catch (error) {
    console.log('   ❌ TypeScript compilation failed');
    allChecksPassed = false;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allChecksPassed) {
    console.log('🎉 All checks passed! Ready for deployment.');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run setup:vercel-env');
    console.log('2. Run: vercel --prod');
    console.log('3. Set up custom domain in Vercel dashboard');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above before deploying.');
  }
  console.log('='.repeat(50));
}

runDeploymentChecklist(); 