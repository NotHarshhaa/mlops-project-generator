#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// Check if backend dependencies are installed
function checkBackendDeps() {
  const backendPath = path.join(__dirname, '../web_api');
  const requirementsPath = path.join(backendPath, 'requirements.txt');
  
  if (!fs.existsSync(requirementsPath)) {
    log(colors.red, '❌ Backend requirements.txt not found!');
    return false;
  }
  
  log(colors.yellow, '📦 Checking backend dependencies...');
  return true;
}

// Install backend dependencies if needed
function installBackendDeps() {
  return new Promise((resolve, reject) => {
    const backendPath = path.join(__dirname, '../web_api');
    const pip = spawn('pip', ['install', '-r', 'requirements.txt'], {
      cwd: backendPath,
      stdio: 'pipe'
    });

    pip.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    pip.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    pip.on('close', (code) => {
      if (code === 0) {
        log(colors.green, '✅ Backend dependencies installed');
        resolve();
      } else {
        log(colors.red, '❌ Failed to install backend dependencies');
        reject(new Error('Backend dependencies installation failed'));
      }
    });
  });
}

// Start backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = path.join(__dirname, '../web_api');
    const backend = spawn('python', ['main.py'], {
      cwd: backendPath,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let backendReady = false;

    backend.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(`[Backend] ${output}`);
      
      if (output.includes('Uvicorn running') || output.includes('Application startup complete')) {
        if (!backendReady) {
          backendReady = true;
          log(colors.green, '🚀 Backend is ready!');
          resolve(backend);
        }
      }
    });

    backend.stderr.on('data', (data) => {
      const output = data.toString();
      process.stderr.write(`[Backend Error] ${output}`);
    });

    backend.on('close', (code) => {
      if (code !== 0 && !backendReady) {
        log(colors.red, `❌ Backend exited with code ${code}`);
        reject(new Error('Backend failed to start'));
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!backendReady) {
        log(colors.yellow, '⚠️  Backend starting (may take a moment)...');
        resolve(backend); // Continue anyway
      }
    }, 30000);
  });
}

// Start frontend server
function startFrontend() {
  return new Promise((resolve, reject) => {
    const frontend = spawn('npm', ['run', 'dev:frontend'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let frontendReady = false;

    frontend.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(`[Frontend] ${output}`);
      
      if (output.includes('Ready') || output.includes('localhost:3000')) {
        if (!frontendReady) {
          frontendReady = true;
          log(colors.green, '🎨 Frontend is ready!');
          log(colors.cyan, '🌐 Open http://localhost:3000 in your browser');
          resolve(frontend);
        }
      }
    });

    frontend.stderr.on('data', (data) => {
      const output = data.toString();
      process.stderr.write(`[Frontend Error] ${output}`);
    });

    frontend.on('close', (code) => {
      if (code !== 0) {
        log(colors.red, `❌ Frontend exited with code ${code}`);
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!frontendReady) {
        log(colors.yellow, '⚠️  Frontend starting (may take a moment)...');
        resolve(frontend);
      }
    }, 30000);
  });
}

// Main execution
async function main() {
  log(colors.cyan, '🧠 MLOps Project Generator - Auto Setup');
  log(colors.cyan, '==========================================');

  try {
    // Check and install backend dependencies
    if (checkBackendDeps()) {
      await installBackendDeps();
    }

    // Start both servers
    log(colors.yellow, '🚀 Starting backend and frontend...');
    
    const backend = await startBackend();
    const frontend = await startFrontend();

    // Handle cleanup on exit
    process.on('SIGINT', () => {
      log(colors.yellow, '\n🛑 Shutting down servers...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });

    log(colors.green, '✅ Both servers are running!');
    log(colors.magenta, '💡 Press Ctrl+C to stop both servers');

  } catch (error) {
    log(colors.red, `❌ Startup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main();
