const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProjectHealthManager {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, 'backup-health');
    this.stateFile = path.join(this.backupDir, 'project-state.json');
    this.maxBackups = 5;
  }

  // Create backup of current project state
  async createBackup(reason = 'manual') {
    console.log('📦 Creating project state backup...');
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    
    const state = {
      timestamp: new Date().toISOString(),
      reason: reason,
      files: {}
    };
    
    // Backup critical files
    const criticalFiles = [
      'package.json',
      'package-lock.json',
      'next.config.js',
      'tsconfig.json',
      '.env.local'
    ];
    
    for (const file of criticalFiles) {
      if (fs.existsSync(file)) {
        const backupPath = path.join(this.backupDir, `${file}.backup`);
        fs.copyFileSync(file, backupPath);
        state.files[file] = backupPath;
      }
    }
    
    // Save state info
    fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
    
    // Clean old backups
    this.cleanOldBackups();
    
    console.log('✅ Project state backed up');
    return state;
  }

  // Clean old backups
  cleanOldBackups() {
    try {
      const files = fs.readdirSync(this.backupDir);
      const backupFiles = files.filter(f => f.endsWith('.backup'));
      
      if (backupFiles.length > this.maxBackups) {
        backupFiles.sort();
        const toDelete = backupFiles.slice(0, backupFiles.length - this.maxBackups);
        
        for (const file of toDelete) {
          fs.unlinkSync(path.join(this.backupDir, file));
          console.log(`🗑️  Removed old backup: ${file}`);
        }
      }
    } catch (error) {
      console.log('⚠️  Could not clean old backups:', error.message);
    }
  }

  // Check project health
  async checkHealth() {
    console.log('🏥 Checking project health...');
    
    const health = {
      dependencies: await this.checkDependencies(),
      build: await this.checkBuild(),
      ports: await this.checkPorts(),
      cache: await this.checkCache(),
      security: await this.checkSecurity()
    };
    
    const issues = Object.values(health).filter(h => !h.healthy);
    
    if (issues.length === 0) {
      console.log('✅ Project is healthy!');
      return { healthy: true, issues: [] };
    } else {
      console.log(`⚠️  Found ${issues.length} health issues`);
      return { healthy: false, issues };
    }
  }

  // Check dependencies
  async checkDependencies() {
    try {
      execSync('npm ls --depth=0', { stdio: 'pipe' });
      return { healthy: true, message: 'Dependencies are clean' };
    } catch (error) {
      return { healthy: false, message: 'Dependency conflicts found', error: error.message };
    }
  }

  // Check build
  async checkBuild() {
    try {
      execSync('npm run build', { stdio: 'pipe', timeout: 60000 });
      return { healthy: true, message: 'Build successful' };
    } catch (error) {
      return { healthy: false, message: 'Build failed', error: error.message };
    }
  }

  // Check ports
  async checkPorts() {
    try {
      const result = execSync('netstat -ano | findstr :3000', { encoding: 'utf8' });
      if (result.includes('LISTENING')) {
        return { healthy: false, message: 'Port 3000 is in use' };
      }
      return { healthy: true, message: 'Ports are available' };
    } catch (error) {
      return { healthy: true, message: 'Ports are available' };
    }
  }

  // Check cache
  async checkCache() {
    const cacheDir = path.join(this.projectRoot, '.next');
    if (fs.existsSync(cacheDir)) {
      const stats = fs.statSync(cacheDir);
      const sizeMB = stats.size / (1024 * 1024);
      
      if (sizeMB > 500) { // More than 500MB
        return { healthy: false, message: `Cache is large (${sizeMB.toFixed(1)}MB)` };
      }
    }
    return { healthy: true, message: 'Cache size is normal' };
  }

  // Check security
  async checkSecurity() {
    try {
      execSync('npm audit --audit-level=moderate', { stdio: 'pipe' });
      return { healthy: true, message: 'No security vulnerabilities' };
    } catch (error) {
      return { healthy: false, message: 'Security vulnerabilities found', error: error.message };
    }
  }

  // Auto-fix issues
  async autoFix(issues) {
    console.log('🔧 Attempting to auto-fix issues...');
    
    const fixes = [];
    
    for (const issue of issues) {
      if (issue.message.includes('Dependency conflicts')) {
        console.log('🔄 Fixing dependency conflicts...');
        await this.fixDependencies();
        fixes.push('dependencies');
      }
      
      if (issue.message.includes('Port 3000 is in use')) {
        console.log('🔄 Freeing port 3000...');
        await this.fixPorts();
        fixes.push('ports');
      }
      
      if (issue.message.includes('Cache is large')) {
        console.log('🔄 Cleaning cache...');
        await this.fixCache();
        fixes.push('cache');
      }
      
      if (issue.message.includes('Security vulnerabilities')) {
        console.log('🔄 Fixing security issues...');
        await this.fixSecurity();
        fixes.push('security');
      }
    }
    
    return fixes;
  }

  // Fix dependencies
  async fixDependencies() {
    return new Promise((resolve) => {
      const fix = spawn('npm', ['run', 'deps:smart'], {
        stdio: 'inherit',
        shell: true
      });
      
      fix.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Dependencies fixed');
        } else {
          console.log('❌ Failed to fix dependencies');
        }
        resolve();
      });
    });
  }

  // Fix ports
  async fixPorts() {
    return new Promise((resolve) => {
      const taskkill = spawn('taskkill', ['/IM', 'node.exe', '/F'], {
        shell: true,
        stdio: 'pipe'
      });
      
      taskkill.on('close', () => {
        console.log('✅ Ports freed');
        resolve();
      });
    });
  }

  // Fix cache
  async fixCache() {
    const cacheDir = path.join(this.projectRoot, '.next');
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('✅ Cache cleaned');
    }
  }

  // Fix security
  async fixSecurity() {
    return new Promise((resolve) => {
      const audit = spawn('npm', ['audit', 'fix'], {
        stdio: 'inherit',
        shell: true
      });
      
      audit.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Security issues fixed');
        } else {
          console.log('⚠️  Some security issues could not be fixed automatically');
        }
        resolve();
      });
    });
  }

  // Auto-reverse changes if issues persist
  async autoReverse() {
    console.log('🔄 Auto-reversing changes...');
    
    if (!fs.existsSync(this.stateFile)) {
      console.log('ℹ️  No backup state found');
      return false;
    }
    
    try {
      const state = JSON.parse(fs.readFileSync(this.stateFile, 'utf8'));
      
      // Restore files
      for (const [file, backupPath] of Object.entries(state.files)) {
        if (fs.existsSync(backupPath)) {
          fs.copyFileSync(backupPath, file);
          console.log(`✅ Restored ${file}`);
        }
      }
      
      // Clean up
      fs.unlinkSync(this.stateFile);
      
      console.log('✅ Changes reversed successfully');
      return true;
    } catch (error) {
      console.log('❌ Failed to reverse changes:', error.message);
      return false;
    }
  }

  // Full health check and auto-fix
  async fullHealthCheck() {
    console.log('🚀 DrishiQ Project Health Manager');
    console.log('='.repeat(50));
    
    // Create backup before any changes
    await this.createBackup('health-check');
    
    // Check health
    const health = await this.checkHealth();
    
    if (health.healthy) {
      console.log('🎉 Project is healthy! No action needed.');
      return;
    }
    
    console.log(`\n⚠️  Found ${health.issues.length} issues:`);
    health.issues.forEach(issue => {
      console.log(`- ${issue.message}`);
    });
    
    // Try to auto-fix
    console.log('\n🔧 Attempting auto-fix...');
    const fixes = await this.autoFix(health.issues);
    
    if (fixes.length > 0) {
      console.log(`\n✅ Applied ${fixes.length} fixes: ${fixes.join(', ')}`);
      
      // Check health again
      console.log('\n🏥 Re-checking health...');
      const newHealth = await this.checkHealth();
      
      if (newHealth.healthy) {
        console.log('🎉 All issues resolved!');
      } else {
        console.log('⚠️  Some issues remain after auto-fix');
        console.log('🔄 Reversing changes...');
        await this.autoReverse();
      }
    } else {
      console.log('ℹ️  No automatic fixes available');
    }
  }

  // Quick health check
  async quickCheck() {
    const health = await this.checkHealth();
    
    if (health.healthy) {
      console.log('✅ Project is healthy');
    } else {
      console.log(`⚠️  ${health.issues.length} issues found`);
      health.issues.forEach(issue => {
        console.log(`- ${issue.message}`);
      });
    }
  }
}

// CLI interface
async function main() {
  const manager = new ProjectHealthManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'check':
      await manager.fullHealthCheck();
      break;
    case 'quick':
      await manager.quickCheck();
      break;
    case 'backup':
      await manager.createBackup('manual');
      break;
    case 'reverse':
      await manager.autoReverse();
      break;
    default:
      console.log('🏥 DrishiQ Project Health Manager');
      console.log('Usage:');
      console.log('  node scripts/project-health-manager.js check   - Full health check and auto-fix');
      console.log('  node scripts/project-health-manager.js quick   - Quick health check');
      console.log('  node scripts/project-health-manager.js backup  - Create backup');
      console.log('  node scripts/project-health-manager.js reverse - Reverse changes');
      await manager.fullHealthCheck();
  }
}

// Export for use in other scripts
module.exports = ProjectHealthManager;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
} 