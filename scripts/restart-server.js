const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Restarting DrishiQ development server...');

// Kill any existing Node processes
const killProcesses = () => {
  return new Promise((resolve) => {
    const taskkill = spawn('taskkill', ['/F', '/IM', 'node.exe'], { 
      stdio: 'ignore',
      shell: true 
    });
    
    taskkill.on('close', () => {
      console.log('✅ Killed existing Node processes');
      resolve();
    });
  });
};

// Clear Next.js cache
const clearCache = () => {
  return new Promise((resolve) => {
    const nextCachePath = path.join(__dirname, '..', '.next');
    if (fs.existsSync(nextCachePath)) {
      fs.rmSync(nextCachePath, { recursive: true, force: true });
      console.log('✅ Cleared Next.js cache');
    } else {
      console.log('ℹ️ No Next.js cache found');
    }
    resolve();
  });
};

// Start development server
const startServer = () => {
  console.log('🚀 Starting development server...');
  
  const devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, '..')
  });
  
  devProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
  });
  
  devProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
  
  return devProcess;
};

// Main execution
async function main() {
  try {
    await killProcesses();
    await clearCache();
    startServer();
  } catch (error) {
    console.error('❌ Error restarting server:', error);
  }
}

main(); 