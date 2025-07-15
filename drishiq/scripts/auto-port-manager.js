const net = require('net');
const { spawn } = require('child_process');

class AutoPortManager {
  constructor(startPort = 3000, maxAttempts = 10) {
    this.startPort = startPort;
    this.maxAttempts = maxAttempts;
    this.currentPort = startPort;
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

  // Kill all Node processes automatically
  async killAllNodeProcesses() {
    return new Promise((resolve) => {
      console.log('🔄 Killing all Node processes...');
      
      const taskkill = spawn('taskkill', ['/IM', 'node.exe', '/F'], { 
        shell: true,
        stdio: 'pipe'
      });
      
      let hasOutput = false;
      let hasResolved = false;
      
      const resolveOnce = () => {
        if (!hasResolved) {
          hasResolved = true;
          resolve();
        }
      };
      
      taskkill.stdout.on('data', (data) => {
        hasOutput = true;
        console.log(`📤 ${data.toString().trim()}`);
      });
      
      taskkill.stderr.on('data', (data) => {
        hasOutput = true;
        console.log(`⚠️  ${data.toString().trim()}`);
      });
      
      taskkill.on('close', (code) => {
        if (code === 0) {
          console.log('✅ All Node processes killed successfully');
        } else if (code === 128) {
          console.log('ℹ️  No Node processes found to kill');
        } else {
          console.log(`ℹ️  Node process cleanup completed (code: ${code})`);
        }
        resolveOnce();
      });
      
      taskkill.on('error', (error) => {
        console.log(`⚠️  Error killing processes: ${error.message}`);
        resolveOnce();
      });
      
      // Add timeout to prevent hanging
      setTimeout(() => {
        if (!hasOutput) {
          console.log('ℹ️  No Node processes found or already killed');
        }
        resolveOnce();
      }, 2000);
    });
  }

  // Kill specific process on port
  async killProcessOnPort(port) {
    return new Promise((resolve) => {
      console.log(`🎯 Checking for processes on port ${port}...`);
      
      const netstat = spawn('netstat', ['-ano'], { shell: true });
      let output = '';
      
      netstat.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      netstat.on('close', () => {
        const lines = output.split('\n');
        const portLine = lines.find(line => 
          line.includes(`:${port}`) && 
          (line.includes('LISTENING') || line.includes('ESTABLISHED'))
        );
        
        if (portLine) {
          const parts = portLine.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          
          if (pid && !isNaN(pid)) {
            console.log(`🎯 Found process ${pid} using port ${port}, killing it...`);
            
            const taskkill = spawn('taskkill', ['/PID', pid, '/F'], { shell: true });
            
            taskkill.on('close', (code) => {
              if (code === 0) {
                console.log(`✅ Successfully killed process ${pid}`);
              } else {
                console.log(`⚠️  Failed to kill process ${pid}`);
              }
              resolve();
            });
          } else {
            resolve();
          }
        } else {
          console.log(`ℹ️  No process found using port ${port}`);
          resolve();
        }
      });
    });
  }

  // Find available port with automatic process killing
  async findAvailablePort() {
    console.log(`🔍 Auto-searching for available port starting from ${this.startPort}...`);
    
    for (let port = this.startPort; port < this.startPort + this.maxAttempts; port++) {
      process.stdout.write(`\r⏳ Checking port ${port}... (${port - this.startPort + 1}/${this.maxAttempts})`);
      
      const isAvailable = await this.isPortAvailable(port);
      
      if (isAvailable) {
        console.log(`\n✅ Found available port: ${port}`);
        this.currentPort = port;
        return port;
      } else {
        console.log(`\n❌ Port ${port} is in use, attempting to free it...`);
        
        // Try to kill the process on this port
        await this.killProcessOnPort(port);
        
        // Wait a moment for the process to fully terminate
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check again after killing
        const isNowAvailable = await this.isPortAvailable(port);
        
        if (isNowAvailable) {
          console.log(`✅ Port ${port} is now available after killing process`);
          this.currentPort = port;
          return port;
        } else {
          console.log(`❌ Port ${port} still in use, trying next port...`);
        }
      }
    }
    
    throw new Error(`No available ports found in range ${this.startPort}-${this.startPort + this.maxAttempts - 1}`);
  }

  // Start Next.js dev server automatically
  async startDevServer() {
    try {
      console.log('🚀 DrishiQ Auto Port Manager Starting...');
      console.log('='.repeat(50));
      
      // Step 1: Kill all Node processes first
      console.log('Step 1: Killing Node processes...');
      await this.killAllNodeProcesses();
      console.log('Step 1 completed');
      
      // Step 2: Wait for processes to fully terminate
      console.log('Step 2: Waiting for processes to terminate...');
      console.log('⏳ Waiting for processes to fully terminate...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Step 2 completed');
      
      // Step 3: Find available port (with automatic process killing)
      console.log('Step 3: Finding available port...');
      const port = await this.findAvailablePort();
      console.log('Step 3 completed');
      
      console.log(`\n🚀 Starting Next.js dev server on port ${port}...`);
      console.log(`📱 Your app will be available at: http://localhost:${port}`);
      console.log(`\n${'='.repeat(50)}`);
      console.log('🎉 Dev server starting...\n');
      
      // Step 4: Start the dev server
      console.log('Step 4: Starting dev server...');
      const devServer = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        env: { ...process.env, PORT: port.toString() }
      });
      
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

  // Quick status check
  async quickStatus() {
    console.log('📊 Quick Port Status:');
    
    for (let port = this.startPort; port < this.startPort + 5; port++) {
      const isAvailable = await this.isPortAvailable(port);
      console.log(`Port ${port}: ${isAvailable ? '✅ Available' : '❌ In Use'}`);
    }
  }
}

// Auto-start function
async function autoStart() {
  const portManager = new AutoPortManager(3000, 10);
  await portManager.startDevServer();
}

// Quick status function
async function quickStatus() {
  const portManager = new AutoPortManager(3000, 10);
  await portManager.quickStatus();
}

// Export for use in other scripts
module.exports = AutoPortManager;

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      autoStart().catch(console.error);
      break;
    case 'status':
      quickStatus().catch(console.error);
      break;
    default:
      console.log('🎯 DrishiQ Auto Port Manager');
      console.log('Usage:');
      console.log('  node scripts/auto-port-manager.js start   - Auto-start dev server');
      console.log('  node scripts/auto-port-manager.js status  - Check port status');
      autoStart().catch(console.error);
  }
} 