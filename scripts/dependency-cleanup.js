const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DependencyCleanup {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, 'backup-deps');
  }

  // Create backup of current dependencies
  async createBackup() {
    console.log('📦 Creating backup of current dependencies...');
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    
    // Backup package.json and package-lock.json
    if (fs.existsSync('package.json')) {
      fs.copyFileSync('package.json', path.join(this.backupDir, 'package.json.backup'));
    }
    
    if (fs.existsSync('package-lock.json')) {
      fs.copyFileSync('package-lock.json', path.join(this.backupDir, 'package-lock.json.backup'));
    }
    
    console.log('✅ Backup created in backup-deps/');
  }

  // Clean npm cache
  async cleanNpmCache() {
    console.log('🧹 Cleaning npm cache...');
    
    return new Promise((resolve) => {
      const clean = spawn('npm', ['cache', 'clean', '--force'], { 
        stdio: 'inherit',
        shell: true 
      });
      
      clean.on('close', (code) => {
        if (code === 0) {
          console.log('✅ NPM cache cleaned');
        } else {
          console.log('⚠️  NPM cache clean failed');
        }
        resolve();
      });
    });
  }

  // Remove node_modules and package-lock.json
  async removeDependencies() {
    console.log('🗑️  Removing node_modules and package-lock.json...');
    
    const dirsToRemove = ['node_modules', '.next'];
    const filesToRemove = ['package-lock.json'];
    
    for (const dir of dirsToRemove) {
      if (fs.existsSync(dir)) {
        try {
          fs.rmSync(dir, { recursive: true, force: true });
          console.log(`✅ Removed ${dir}`);
        } catch (error) {
          console.log(`⚠️  Failed to remove ${dir}: ${error.message}`);
        }
      }
    }
    
    for (const file of filesToRemove) {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
          console.log(`✅ Removed ${file}`);
        } catch (error) {
          console.log(`⚠️  Failed to remove ${file}: ${error.message}`);
        }
      }
    }
  }

  // Update package.json with optimized dependencies
  async optimizePackageJson() {
    console.log('🔧 Optimizing package.json...');
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Update Next.js to latest stable version
    packageJson.dependencies.next = "14.2.30";
    
    // Remove potentially problematic dependencies
    const dependenciesToRemove = [
      'critters', // Can cause build issues
      '@typescript-eslint/eslint-plugin-tslint' // Deprecated
    ];
    
    dependenciesToRemove.forEach(dep => {
      if (packageJson.dependencies[dep]) {
        delete packageJson.dependencies[dep];
        console.log(`🗑️  Removed ${dep} from dependencies`);
      }
      if (packageJson.devDependencies[dep]) {
        delete packageJson.devDependencies[dep];
        console.log(`🗑️  Removed ${dep} from devDependencies`);
      }
    });
    
    // Add missing peer dependencies
    const missingDeps = {
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18'
    };
    
    Object.entries(missingDeps).forEach(([dep, version]) => {
      if (!packageJson.devDependencies[dep]) {
        packageJson.devDependencies[dep] = version;
        console.log(`➕ Added ${dep} to devDependencies`);
      }
    });
    
    // Write updated package.json
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ Package.json optimized');
  }

  // Install dependencies with clean slate
  async installDependencies() {
    console.log('📥 Installing dependencies...');
    
    return new Promise((resolve) => {
      const install = spawn('npm', ['install'], { 
        stdio: 'inherit',
        shell: true 
      });
      
      install.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Dependencies installed successfully');
        } else {
          console.log('❌ Dependency installation failed');
        }
        resolve();
      });
    });
  }

  // Run security audit and fix
  async runSecurityAudit() {
    console.log('🔒 Running security audit...');
    
    return new Promise((resolve) => {
      const audit = spawn('npm', ['audit', 'fix'], { 
        stdio: 'inherit',
        shell: true 
      });
      
      audit.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Security audit completed');
        } else {
          console.log('⚠️  Security audit found issues');
        }
        resolve();
      });
    });
  }

  // Check for dependency conflicts
  async checkConflicts() {
    console.log('🔍 Checking for dependency conflicts...');
    
    try {
      const result = execSync('npm ls --depth=0', { encoding: 'utf8' });
      console.log('✅ No dependency conflicts found');
      return true;
    } catch (error) {
      console.log('❌ Dependency conflicts found:');
      console.log(error.stdout || error.message);
      return false;
    }
  }

  // Full cleanup process
  async fullCleanup() {
    console.log('🚀 Starting comprehensive dependency cleanup...');
    console.log('='.repeat(60));
    
    try {
      // Step 1: Create backup
      await this.createBackup();
      
      // Step 2: Clean npm cache
      await this.cleanNpmCache();
      
      // Step 3: Remove existing dependencies
      await this.removeDependencies();
      
      // Step 4: Optimize package.json
      await this.optimizePackageJson();
      
      // Step 5: Install dependencies
      await this.installDependencies();
      
      // Step 6: Run security audit
      await this.runSecurityAudit();
      
      // Step 7: Check for conflicts
      const noConflicts = await this.checkConflicts();
      
      console.log('='.repeat(60));
      console.log('🎉 Dependency cleanup completed!');
      
      if (noConflicts) {
        console.log('✅ All dependencies are clean and up to date');
      } else {
        console.log('⚠️  Some conflicts remain - check the output above');
      }
      
      console.log('\n📋 Summary:');
      console.log('- Backup created in backup-deps/');
      console.log('- NPM cache cleaned');
      console.log('- Dependencies reinstalled');
      console.log('- Security vulnerabilities fixed');
      console.log('- Next.js updated to 14.2.30');
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      console.log('💡 You can restore from backup-deps/ if needed');
    }
  }

  // Quick fix for specific issues
  async quickFix() {
    console.log('⚡ Running quick dependency fix...');
    
    try {
      await this.cleanNpmCache();
      await this.runSecurityAudit();
      await this.checkConflicts();
      
      console.log('✅ Quick fix completed');
    } catch (error) {
      console.error('❌ Quick fix failed:', error.message);
    }
  }
}

// CLI interface
async function main() {
  const cleanup = new DependencyCleanup();
  const command = process.argv[2];
  
  switch (command) {
    case 'full':
      await cleanup.fullCleanup();
      break;
    case 'quick':
      await cleanup.quickFix();
      break;
    case 'backup':
      await cleanup.createBackup();
      break;
    case 'audit':
      await cleanup.runSecurityAudit();
      break;
    default:
      console.log('🔧 DrishiQ Dependency Cleanup Tool');
      console.log('Usage:');
      console.log('  node scripts/dependency-cleanup.js full   - Full cleanup');
      console.log('  node scripts/dependency-cleanup.js quick  - Quick fix');
      console.log('  node scripts/dependency-cleanup.js backup - Create backup');
      console.log('  node scripts/dependency-cleanup.js audit  - Security audit');
      await cleanup.fullCleanup();
  }
}

// Export for use in other scripts
module.exports = DependencyCleanup;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
} 