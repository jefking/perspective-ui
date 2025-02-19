const fs = require('fs');
const path = require('path');

const files = [
  {
    path: 'electron/main.cjs',
    content: `const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const arrow = require('apache-arrow')
const parquet = require('parquetjs')

// Use isDev without electron-is-dev
const isDev = process.env.npm_lifecycle_event === "electron";

// Enable hot reloading in development
if (isDev) {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: false
    });
  } catch (_) { console.log('Error hot reloading'); }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs')
    },
  })

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : \`file://\${path.join(__dirname, '../dist/index.html')}\`
  )

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle('read-parquet', async (event, filePath) => {
  console.log('Reading parquet file:', filePath);
  try {
    const reader = await parquet.ParquetReader.openFile(filePath);
    console.log('Parquet reader created');
    const cursor = reader.getCursor();
    const records = [];
    
    let record = null;
    let count = 0;
    while (record = await cursor.next()) {
      records.push(record);
      count++;
      if (count % 1000 === 0) {
        console.log(\`Read \${count} records...\`);
      }
    }
    
    await reader.close();
    console.log(\`Finished reading \${records.length} records\`);
    return records;
  } catch (error) {
    console.error('Error reading Parquet file:', error);
    throw error;
  }
})`
  },
  {
    path: 'src/App.jsx',
    content: `import { useState } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import ParquetViewer from './components/ParquetViewer'

// Import Perspective styles
import '@finos/perspective-viewer'
import '@finos/perspective-viewer-datagrid'
import '@finos/perspective-viewer-d3fc'

function App() {
  const [data, setData] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Parquet Explorer
          </h1>
          <FileUpload onDataLoaded={setData} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {data ? (
          <div className="h-full p-4">
            <ParquetViewer data={data} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No data loaded</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload a Parquet file to get started
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            Powered by Perspective
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App`
  },
  {
    path: 'src/components/FileUpload.jsx',
    content: `import { useState } from 'react';

export default function FileUpload({ onDataLoaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      // Use window.electron from the contextBridge
      const data = await window.electron.ipcRenderer.invoke('read-parquet', file.path);
      console.log('Loaded parquet data:', data);
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No data found in parquet file');
      }
      onDataLoaded(data);
    } catch (error) {
      console.error('Error reading Parquet file:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {loading && (
        <div className="text-sm text-gray-600 animate-pulse">
          Loading...
        </div>
      )}
      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}
      <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
        {loading ? 'Loading...' : 'Open Parquet File'}
        <input
          type="file"
          accept=".parquet"
          onChange={handleFileSelect}
          className="hidden"
          disabled={loading}
        />
      </label>
    </div>
  );
}`
  },
  {
    path: 'src/components/ParquetViewer.jsx',
    content: `import { useEffect, useRef, useState } from 'react';
import perspective from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";

export default function ParquetViewer({ data }) {
  const viewerRef = useRef(null);
  const [worker] = useState(() => perspective.worker());

  useEffect(() => {
    if (!viewerRef.current || !data) return;

    const loadData = async () => {
      try {
        const table = await worker.table(data);
        await viewerRef.current.load(table);
        
        // Set default configuration
        await viewerRef.current.restore({
          plugin: "datagrid",
          settings: true,
          theme: "Material Light",
          columns: table.columns()
        });
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    loadData();

    return () => {
      worker.table?.delete();
    };
  }, [data, worker]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg bg-white">
      <perspective-viewer ref={viewerRef} />
    </div>
  );
}`
  },
  {
    path: 'src/App.css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

perspective-viewer {
  height: 100%;
  width: 100%;
  display: block;
  --theme-name: "Material Light";
}

.perspective-viewer-container {
  height: 100%;
  width: 100%;
  position: relative;
}

perspective-viewer[theme="Material Light"] {
  --plugin--background: white;
  --modal--background: white;
  --theme-name: "Material Light";
}`
  },
  {
    path: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Parquet Explorer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
  },
  {
    path: 'src/main.jsx',
    content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
  },
  {
    path: 'vite.config.js',
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON=="true" ? './' : ".",
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      '@finos/perspective',
      '@finos/perspective-viewer',
      '@finos/perspective-viewer-datagrid',
      '@finos/perspective-viewer-d3fc'
    ]
  },
  css: {
    preprocessorOptions: {
      css: {
        javascriptEnabled: true,
      },
    },
  },
})`
  },
  {
    path: 'electron/preload.cjs',
    content: `const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (...args) => ipcRenderer.invoke(...args)
  }
})`
  }
];

async function setup() {
  const appDir = path.join(process.cwd(), 'pee-viewer');
  
  // Create necessary directories
  const dirs = [
    path.join(appDir, 'electron'),
    path.join(appDir, 'src', 'components'),
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Write files
  files.forEach(file => {
    fs.writeFileSync(
      path.join(appDir, file.path),
      file.content
    );
  });

  // Update package.json
  const pkgPath = path.join(appDir, 'package.json');
  const pkg = require(pkgPath);
  pkg.name = 'pee-viewer';
  pkg.main = 'electron/main.cjs';
  pkg.type = "module";
  pkg.scripts = {
    "dev:web": "vite",
    "dev:electron": "ELECTRON=true vite",
    "electron": "wait-on tcp:5173 && electron .",
    "start": "concurrently -k \"npm run dev:electron\" \"npm run electron\"",
    "build": "vite build",
    "preview": "vite preview",
    "electron:build": "vite build && electron-builder"
  };
  pkg.devDependencies = {
    ...pkg.devDependencies,
    "concurrently": "^8.2.2",
    "wait-on": "^7.2.0"
  };

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  console.log('Setup complete!');
}

setup().catch(console.error);