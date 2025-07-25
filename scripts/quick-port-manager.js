const { spawn } = require('child_process');
const net = require('net');

// Check if a port is available
function isPortAvailable(port) {
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

// Find available port
async function findAvailablePort(startPort = 3000, maxAttempts = 10) {
  console.log(`🔍 Finding available port starting from ${startPort}...`);
  
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    const isAvailable = await isPortAvailable(port);
    
    if (isAvailable) {
      console.log(`✅ Found available port: ${port}`);
      return port;
    } else {
      console.log(`❌ Port ${port} is in use`);
    }
  }
  
  throw new Error(`No available ports found in range ${startPort}-${startPort + maxAttempts - 1}`);
}

// Start dev server
async function startDevServer() {
  try {
    console.log('🚀 Quick Port Manager Starting...');
    console.log('='.repeat(50));
    
    // Find available port
    const port = await findAvailablePort(3000, 10);
    
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

// Run if called directly
if (require.main === module) {
  startDevServer().catch(console.error);
}

module.exports = { findAvailablePort, startDevServer }; 