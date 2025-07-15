const { spawn } = require('child_process');
const net = require('net');

class SimplePortManager {
  constructor(startPort = 3000, maxAttempts = 10, enableProcessKill = false) {
    this.startPort = startPort;
    this.maxAttempts = maxAttempts;
    this.enableProcessKill = enableProcessKill;
  }

  // Check if a port is available
  async isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      
      server.listen(port, () => {
        server.once('close', () => {
          resolve(true);
        });
        server.close();
      });
      
      server.on('error', () => {
        resolve(false);
      });
    });
  }

  // Kill Node processes quickly
  async killNodeProcesses() {
    return new Promise((resolve) => {
      console.log('🔄 Killing Node processes...');
      
      if (this.enableProcessKill) {
        // Try to kill Node processes
        const taskkill = spawn('taskkill', ['/IM', 'node.exe', '/F'], { 
          shell: true,
          stdio: 'pipe'
        });
        
        // Always resolve after 3 seconds, regardless of outcome
        setTimeout(() => {
          console.log('✅ Node process cleanup completed');
          resolve();
        }, 3000);
        
        taskkill.on('close', (code) => {
          if (code === 0) {
            console.log('📤 Node processes killed successfully');
          } else {
            console.log('📤 No Node processes found or already killed');
          }
        });
        
        taskkill.on('error', (error) => {
          console.log('📤 Error killing processes (may be normal):', error.message);
        });
      } else {
        // Skip process killing for stability
        console.log('⏭️ Skipping process kill (disabled for stability)');
        setTimeout(() => {
          console.log('✅ Node process cleanup completed (skipped)');
          resolve();
        }, 1000);
      }
    });
  }

  // Find available port
  async findAvailablePort() {
    console.log(`🔍 Finding available port starting from ${this.startPort}...`);
    
    for (let port = this.startPort; port < this.startPort + this.maxAttempts; port++) {
      const isAvailable = await this.isPortAvailable(port);
      
      if (isAvailable) {
        console.log(`✅ Found available port: ${port}`);
        return port;
      } else {
        console.log(`❌ Port ${port} is in use`);
      }
    }
    
    throw new Error(`No available ports found in range ${this.startPort}-${this.startPort + this.maxAttempts - 1}`);
  }

  // Start dev server
  async startDevServer() {
    try {
      console.log('🚀 Simple Port Manager Starting...');
      console.log('='.repeat(50));
      
      // Step 1: Kill Node processes (with timeout)
      console.log('Step 1: Killing Node processes...');
      await this.killNodeProcesses();
      console.log('Step 1 completed');
      
      // Step 2: Wait a moment
      console.log('Step 2: Waiting...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Step 2 completed');
      
      // Step 3: Find available port
      console.log('Step 3: Finding available port...');
      const port = await this.findAvailablePort();
      console.log('Step 3 completed');
      
      console.log(`\n🚀 Starting Next.js dev server on port ${port}...`);
      console.log(`📱 Your app will be available at: http://localhost:${port}`);
      console.log(`\n${'='.repeat(50)}`);
      
      // Step 4: Start the dev server
      console.log('Step 4: Starting dev server...');
      const isWin = process.platform === 'win32';
      const npxCmd = isWin ? 'npx.cmd' : 'npx';
      console.log(`Using command: ${npxCmd} next dev`);
      const devServer = spawn(npxCmd, ['next', 'dev'], {
        stdio: 'inherit',
        env: { ...process.env, PORT: port.toString() },
        shell: true
      });
      console.log('Dev server spawned');
      
      devServer.on('error', (error) => {
        console.error(`❌ Failed to start dev server: ${error.message}`);
      });
      
      devServer.on('close', (code) => {
        console.log(`\n🛑 Dev server stopped with code ${code}`);
      });
      
      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down dev server...');
        devServer.kill('SIGINT');
        process.exit(0);
      });
      
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }
}

// Auto-start function
async function autoStart() {
  // Enable process killing if ENABLE_PROCESS_KILL is set to 'true'
  const enableProcessKill = process.env.ENABLE_PROCESS_KILL === 'true';
  const portManager = new SimplePortManager(3000, 10, enableProcessKill);
  
  if (enableProcessKill) {
    console.log('⚠️ Process killing is ENABLED (set ENABLE_PROCESS_KILL=true)');
  } else {
    console.log('ℹ️ Process killing is DISABLED (default for stability)');
  }
  
  await portManager.startDevServer();
}

// Export for use in other scripts
module.exports = SimplePortManager;

// Run if called directly
if (require.main === module) {
  autoStart().catch(console.error);
} 