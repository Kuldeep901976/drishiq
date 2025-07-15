const fs = require('fs');
const path = require('path');

// Clean webpack cache to prevent .pack.gz corruption
function cleanWebpackCache() {
  const cachePath = path.join(process.cwd(), '.next', 'cache', 'webpack');
  
  if (fs.existsSync(cachePath)) {
    console.log('🧹 Cleaning webpack cache...');
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log('✅ Webpack cache cleaned');
  } else {
    console.log('ℹ️  No webpack cache found');
  }
}

// Clean all Next.js cache
function cleanAllCache() {
  const cachePath = path.join(process.cwd(), '.next', 'cache');
  
  if (fs.existsSync(cachePath)) {
    console.log('🧹 Cleaning all Next.js cache...');
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log('✅ All cache cleaned');
  } else {
    console.log('ℹ️  No cache found');
  }
}

// Export functions for use in package.json scripts
module.exports = {
  cleanWebpackCache,
  cleanAllCache
};

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'webpack':
      cleanWebpackCache();
      break;
    case 'all':
      cleanAllCache();
      break;
    default:
      console.log('Usage: node scripts/clean-cache.js [webpack|all]');
      console.log('  webpack - Clean only webpack cache');
      console.log('  all     - Clean all Next.js cache');
  }
} 