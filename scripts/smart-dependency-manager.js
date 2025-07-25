const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SmartDependencyManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, 'backup-deps');
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.packageLockPath = path.join(this.projectRoot, 'package-lock.json');
  }

  // Check if a dependency exists
  dependencyExists(depName, type = 'dependencies') {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
      return packageJson[type] && packageJson[type][depName];
    } catch (error) {
      return false;
    }
  }

  // Get current version of a dependency
  getCurrentVersion(depName, type = 'dependencies') {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
      return packageJson[type] && packageJson[type][depName];
    } catch (error) {
      return null;
    }
  }

  // Check if a dependency needs updating
  async checkForUpdates(depName) {
    try {
      const result = execSync(`npm view ${depName} version`, { encoding: 'utf8' });
      return result.trim();
    } catch (error) {
      console.log(`⚠️  Could not check version for ${depName}`);
      return null;
    }
  }

  // Safely update a dependency
  async updateDependency(depName, newVersion, type = 'dependencies') {
    const currentVersion = this.getCurrentVersion(depName, type);
    
    if (!currentVersion) {
      console.log(`➕ Adding new dependency: ${depName}@${newVersion}`);
      return this.addDependency(depName, newVersion, type);
    }
    
    if (currentVersion === newVersion) {
      console.log(`✅ ${depName} is already at version ${newVersion}`);
      return true;
    }
    
    console.log(`🔄 Updating ${depName}: ${currentVersion} → ${newVersion}`);
    return this.addDependency(depName, newVersion, type);
  }

  // Add a dependency safely
  async addDependency(depName, version, type = 'dependencies') {
    return new Promise((resolve) => {
      const install = spawn('npm', ['install', `${depName}@${version}`], {
        stdio: 'inherit',
        shell: true
      });
      
      install.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Successfully ${this.dependencyExists(depName, type) ? 'updated' : 'added'} ${depName}`);
          resolve(true);
        } else {
          console.log(`❌ Failed to ${this.dependencyExists(depName, type) ? 'update' : 'add'} ${depName}`);
          resolve(false);
        }
      });
    });
  }

  // Remove a dependency safely
  async removeDependency(depName, type = 'dependencies') {
    if (!this.dependencyExists(depName, type)) {
      console.log(`ℹ️  ${depName} not found in ${type}`);
      return true;
    }
    
    console.log(`🗑️  Removing ${depName} from ${type}...`);
    
    return new Promise((resolve) => {
      const uninstall = spawn('npm', ['uninstall', depName], {
        stdio: 'inherit',
        shell: true
      });
      
      uninstall.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Successfully removed ${depName}`);
          resolve(true);
        } else {
          console.log(`❌ Failed to remove ${depName}`);
          resolve(false);
        }
      });
    });
  }

  // Check for security vulnerabilities
  async checkSecurity() {
    console.log('🔒 Checking for security vulnerabilities...');
    
    return new Promise((resolve) => {
      const audit = spawn('npm', ['audit'], {
        stdio: 'pipe',
        shell: true
      });
      
      let output = '';
      
      audit.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      audit.stderr.on('data', (data) => {
        output += data.toString();
      });
      
      audit.on('close', (code) => {
        if (code === 0) {
          console.log('✅ No security vulnerabilities found');
          resolve(true);
        } else {
          console.log('⚠️  Security vulnerabilities found:');
          console.log(output);
          resolve(false);
        }
      });
    });
  }

  // Fix security vulnerabilities
  async fixSecurity() {
    console.log('🔧 Fixing security vulnerabilities...');
    
    return new Promise((resolve) => {
      const auditFix = spawn('npm', ['audit', 'fix'], {
        stdio: 'inherit',
        shell: true
      });
      
      auditFix.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Security vulnerabilities fixed');
          resolve(true);
        } else {
          console.log('⚠️  Some vulnerabilities could not be fixed automatically');
          resolve(false);
        }
      });
    });
  }

  // Smart dependency optimization
  async optimizeDependencies() {
    console.log('🔧 Smart dependency optimization...');
    
    const optimizations = [
      // Core dependencies that should be updated
      { name: 'next', version: '14.2.30', type: 'dependencies' },
      { name: 'react', version: '^18', type: 'dependencies' },
      { name: 'react-dom', version: '^18', type: 'dependencies' },
      
      // Dev dependencies that should be updated
      { name: '@types/node', version: '^20', type: 'devDependencies' },
      { name: '@types/react', version: '^18', type: 'devDependencies' },
      { name: '@types/react-dom', version: '^18', type: 'devDependencies' },
      { name: 'typescript', version: '^5', type: 'devDependencies' }
    ];
    
    // Dependencies to remove (problematic ones)
    const toRemove = [
      { name: 'critters', type: 'dependencies' },
      { name: '@typescript-eslint/eslint-plugin-tslint', type: 'devDependencies' }
    ];
    
    console.log('📋 Checking current dependency state...');
    
    // Remove problematic dependencies
    for (const dep of toRemove) {
      await this.removeDependency(dep.name, dep.type);
    }
    
    // Update/Add necessary dependencies
    for (const dep of optimizations) {
      await this.updateDependency(dep.name, dep.version, dep.type);
    }
    
    console.log('✅ Dependency optimization completed');
  }

  // Check dependency conflicts
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

  // Full smart dependency management
  async fullManagement() {
    console.log('🚀 Smart Dependency Management Starting...');
    console.log('='.repeat(60));
    
    try {
      // Step 1: Check current state
      console.log('📊 Current dependency analysis...');
      await this.checkSecurity();
      
      // Step 2: Optimize dependencies
      await this.optimizeDependencies();
      
      // Step 3: Fix security issues
      await this.fixSecurity();
      
      // Step 4: Check for conflicts
      const noConflicts = await this.checkConflicts();
      
      console.log('='.repeat(60));
      console.log('🎉 Smart dependency management completed!');
      
      if (noConflicts) {
        console.log('✅ All dependencies are optimized and conflict-free');
      } else {
        console.log('⚠️  Some conflicts remain - manual review may be needed');
      }
      
    } catch (error) {
      console.error('❌ Smart dependency management failed:', error.message);
    }
  }

  // Quick dependency check
  async quickCheck() {
    console.log('⚡ Quick dependency check...');
    
    try {
      await this.checkSecurity();
      await this.checkConflicts();
      
      console.log('✅ Quick check completed');
    } catch (error) {
      console.error('❌ Quick check failed:', error.message);
    }
  }
}

// CLI interface
async function main() {
  const manager = new SmartDependencyManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'optimize':
      await manager.fullManagement();
      break;
    case 'check':
      await manager.quickCheck();
      break;
    case 'security':
      await manager.checkSecurity();
      break;
    case 'fix':
      await manager.fixSecurity();
      break;
    default:
      console.log('🔧 Smart Dependency Manager');
      console.log('Usage:');
      console.log('  node scripts/smart-dependency-manager.js optimize - Full optimization');
      console.log('  node scripts/smart-dependency-manager.js check    - Quick check');
      console.log('  node scripts/smart-dependency-manager.js security - Security audit');
      console.log('  node scripts/smart-dependency-manager.js fix      - Fix security issues');
      await manager.fullManagement();
  }
}

// Export for use in other scripts
module.exports = SmartDependencyManager;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
} 