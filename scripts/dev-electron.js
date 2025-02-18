const { spawn } = require('child_process');
const { build } = require('esbuild');
const path = require('path');

// Build Electron main and preload scripts
async function buildElectron() {
  await build({
    entryPoints: [
      'electron/main.ts',
      'electron/preload.ts'
    ],
    bundle: true,
    platform: 'node',
    target: 'node18',
    outdir: 'dist/electron',
    external: ['electron']
  });
}

// Start Vite dev server
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Build and start Electron
buildElectron().then(() => {
  const electronProcess = spawn('electron', ['.'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  });

  electronProcess.on('close', () => {
    viteProcess.kill();
    process.exit();
  });
});
