const net = require('net');
const { spawn } = require('child_process');
const readline = require('readline');

class PortManager {
  constructor(startPort = 3000, maxAttempts = 10) {
    this.startPort = startPort;
    this.maxAttempts = maxAttempts;
    this.currentPort = startPort;
    this.attempts = 0;
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

  // Find next available port
  async findAvailablePort() {
    console.log(`🔍 Searching for available port starting from ${this.startPort}...`);
    
    for (let port = this.startPort; port < this.startPort + this.maxAttempts; port++) {
      this.attempts++;
      process.stdout.write(`\r⏳ Checking port ${port}... (attempt ${this.attempts}/${this.maxAttempts})`);
      
      const isAvailable = await this.isPortAvailable(port);
      
      if (isAvailable) {
        console.log(`\n✅ Found available port: ${port}`);
        this.currentPort = port;
        return port;
      } else {
        console.log(`\n❌ Port ${port} is in use`);
      }
    }
    
    throw new Error(`No available ports found in range ${this.startPort}-${this.startPort + this.maxAttempts - 1}`);
  }

  // Kill processes on specific port
  async killProcessOnPort(port) {
    return new Promise((resolve) => {
      console.log(`🔄 Attempting to free port ${port}...`);
      
      // On Windows, use netstat and taskkill
      const netstat = spawn('netstat', ['-ano'], { shell: true });
      let output = '';
      
      netstat.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      netstat.on('close', () => {
        const lines = output.split('\n');
        const portLine = lines.find(line => line.includes(`:${port}`) && line.includes('LISTENING'));
        
        if (portLine) {
          const parts = portLine.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          
          if (pid && !isNaN(pid)) {
            console.log(`🎯 Found process ${pid} using port ${port}`);
            
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

  // Start Next.js dev server with smart port management
  async startDevServer() {
    try {
      // First, try to free the default port
      await this.killProcessOnPort(this.startPort);
      
      // Wait a moment for processes to fully terminate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find available port
      const port = await this.findAvailablePort();
      
      console.log(`\n🚀 Starting Next.js dev server on port ${port}...`);
      console.log(`📱 Your app will be available at: http://localhost:${port}`);
      console.log(`\n${'='.repeat(50)}`);
      
      // Start the dev server
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

  // Show current port status
  async showPortStatus() {
    console.log(`\n📊 Port Status Report:`);
    console.log(`Starting port: ${this.startPort}`);
    console.log(`Attempts made: ${this.attempts}`);
    console.log(`Current port: ${this.currentPort}`);
    
    // Check a few ports around the current one
    for (let port = this.startPort; port < this.startPort + 5; port++) {
      const isAvailable = await this.isPortAvailable(port);
      console.log(`Port ${port}: ${isAvailable ? '✅ Available' : '❌ In Use'}`);
    }
  }
}

// CLI interface
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(`\n🎯 DrishiQ Port Manager`);
  console.log(`======================\n`);

  const portManager = new PortManager(3000, 10);

  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

  const choice = await question(`
Choose an option:
1. 🚀 Start dev server (auto-find port)
2. 🔍 Check port status
3. 🧹 Kill processes on port 3000
4. 🔄 Kill all Node processes
5. ❌ Exit

Enter your choice (1-5): `);

  rl.close();

  switch (choice.trim()) {
    case '1':
      await portManager.startDevServer();
      break;
    case '2':
      await portManager.showPortStatus();
      break;
    case '3':
      await portManager.killProcessOnPort(3000);
      break;
    case '4':
      console.log('🔄 Killing all Node processes...');
      const taskkill = spawn('taskkill', ['/IM', 'node.exe', '/F'], { shell: true });
      taskkill.on('close', () => {
        console.log('✅ All Node processes killed');
      });
      break;
    case '5':
      console.log('👋 Goodbye!');
      process.exit(0);
      break;
    default:
      console.log('❌ Invalid choice');
      process.exit(1);
  }
}

// Export for use in other scripts
module.exports = PortManager;

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
} 