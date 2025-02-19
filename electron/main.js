const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const arrow = require('apache-arrow')
const parquet = require('parquetjs')

// Enable hot reloading in development
if (isDev) {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: false // Vite will handle renderer hot reloading
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
      preload: path.join(__dirname, 'preload.js')
    },
  })

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`
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
        console.log(`Read ${count} records...`);
      }
    }
    
    await reader.close();
    console.log(`Finished reading ${records.length} records`);
    return records;
  } catch (error) {
    console.error('Error reading Parquet file:', error);
    throw error;
  }
}); 