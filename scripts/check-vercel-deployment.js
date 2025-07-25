const fs = require('fs');
const path = require('path');

console.log('🔍 Vercel Deployment Diagnostic Script');
console.log('=====================================\n');

// Check if package.json exists and has Next.js
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json found');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies.next) {
    console.log(`✅ Next.js found: ${packageJson.dependencies.next}`);
  } else if (packageJson.devDependencies && packageJson.devDependencies.next) {
    console.log(`✅ Next.js found in devDependencies: ${packageJson.devDependencies.next}`);
  } else {
    console.log('❌ Next.js not found in dependencies');
  }
  
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log(`✅ Build script found: ${packageJson.scripts.build}`);
  } else {
    console.log('❌ Build script not found');
  }
} else {
  console.log('❌ package.json not found');
}

// Check if next.config.js exists
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('✅ next.config.js found');
} else {
  console.log('❌ next.config.js not found');
}

// Check if vercel.json exists
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  console.log('✅ vercel.json found');
  const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  console.log('📄 vercel.json content:', JSON.stringify(vercelJson, null, 2));
} else {
  console.log('❌ vercel.json not found');
}

// Check if .vercel directory exists
const vercelDirPath = path.join(process.cwd(), '.vercel');
if (fs.existsSync(vercelDirPath)) {
  console.log('✅ .vercel directory found');
  const projectJsonPath = path.join(vercelDirPath, 'project.json');
  if (fs.existsSync(projectJsonPath)) {
    const projectJson = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
    console.log('📄 Project ID:', projectJson.projectId);
    console.log('📄 Org ID:', projectJson.orgId);
  }
} else {
  console.log('❌ .vercel directory not found');
}

console.log('\n🔧 Recommendations:');
console.log('1. Check Vercel dashboard project settings');
console.log('2. Verify Root Directory setting matches package.json location');
console.log('3. Try redeploying from Vercel dashboard');
console.log('4. Check if there are any environment variables missing'); 