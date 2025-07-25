const { execSync } = require('child_process');

console.log('🚀 DrishiQ Deployment Workflow Helper\n');

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'dev':
    console.log('📝 Development Workflow:');
    console.log('1. Make your changes locally');
    console.log('2. Test everything with: npm run dev');
    console.log('3. Commit your changes:');
    console.log('   git add .');
    console.log('   git commit -m "Your commit message"');
    console.log('4. Push to development branch:');
    console.log('   git push origin development');
    console.log('\n✅ Your changes are now on the development branch!');
    break;

  case 'deploy':
    console.log('🚀 Production Deployment Steps:');
    console.log('\n1. Go to GitHub: https://github.com/Kuldeep901976/drishiq');
    console.log('2. You should see a yellow banner: "Compare & pull request"');
    console.log('3. Click "Compare & pull request"');
    console.log('4. Review your changes');
    console.log('5. Click "Create pull request"');
    console.log('6. Once approved, click "Merge pull request"');
    console.log('7. Click "Confirm merge"');
    console.log('\n✅ Vercel will automatically deploy to production!');
    console.log('🌐 Check your live site in a few minutes');
    break;

  case 'status':
    console.log('📊 Current Status:');
    try {
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      console.log(`Current branch: ${currentBranch}`);
      
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status) {
        console.log('Uncommitted changes:');
        console.log(status);
      } else {
        console.log('✅ All changes committed');
      }
    } catch (error) {
      console.log('❌ Error checking status:', error.message);
    }
    break;

  case 'setup':
    console.log('⚙️ Setting up deployment workflow...');
    try {
      // Ensure we're on development branch
      execSync('git checkout development', { stdio: 'inherit' });
      console.log('✅ Switched to development branch');
      
      // Push development branch
      execSync('git push -u origin development', { stdio: 'inherit' });
      console.log('✅ Development branch pushed to GitHub');
      
      console.log('\n🎉 Setup complete!');
      console.log('\n📋 Your workflow:');
      console.log('1. Work on development branch');
      console.log('2. Test locally with: npm run dev');
      console.log('3. Push changes: git push origin development');
      console.log('4. Deploy via GitHub web interface');
    } catch (error) {
      console.log('❌ Setup failed:', error.message);
    }
    break;

  default:
    console.log('📋 Available commands:');
    console.log('  npm run deploy:dev     - Show development workflow');
    console.log('  npm run deploy:live    - Show production deployment steps');
    console.log('  npm run deploy:status  - Check current git status');
    console.log('  npm run deploy:setup   - Setup the workflow');
    console.log('\n💡 Usage: node scripts/deploy-workflow.js <command>');
    console.log('\n🔄 Workflow:');
    console.log('1. Make changes → Test locally → Push to development');
    console.log('2. Go to GitHub → Create Pull Request → Merge to main');
    console.log('3. Vercel auto-deploys to production!');
} 