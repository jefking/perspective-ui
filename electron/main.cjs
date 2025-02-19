const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const parquetWasm = require('parquet-wasm')

// Use isDev without electron-is-dev
const isDev = process.env.npm_lifecycle_event === "electron";

// Initialize parquet-wasm at startup
let parquetModule = null;
async function initParquet() {
  try {
    parquetModule = await parquetWasm.init();
    console.log('Parquet WASM initialized successfully');
  } catch (err) {
    console.error('Failed to initialize Parquet WASM:', err);
  }
}

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

// Initialize parquet-wasm before creating window
app.whenReady()
  .then(initParquet)
  .then(createWindow)
  .catch(console.error);

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

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Parquet Files', extensions: ['parquet'] }
    ]
  });
  if (!canceled) {
    return filePaths[0];
  }
  return null;
});

ipcMain.handle('read-parquet', async (event, filePath) => {
  console.log('Reading parquet file:', filePath);
  try {
    if (!parquetModule) {
      throw new Error('Parquet WASM not initialized');
    }

    // Read the parquet file using parquet-wasm
    const buffer = fs.readFileSync(filePath);
    const reader = await parquetModule.ParquetReader.openBuffer(buffer);
    const result = await reader.readRows();
    const records = result.toArray();
    
    console.log(\`Loaded \${records.length} records\`);
    return records;
  } catch (error) {
    console.error('Error reading Parquet file:', error);
    throw new Error(\`Failed to read Parquet file: \${error.message}\`);
  }
}) 