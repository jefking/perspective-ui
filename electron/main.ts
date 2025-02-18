import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as parquet from 'parquetjs';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Parquet Files', extensions: ['parquet'] }],
  });
  
  if (canceled) {
    return [];
  }
  return filePaths;
});

ipcMain.handle('parquet:readFile', async (_, filePath) => {
  try {
    const reader = await parquet.ParquetReader.openFile(filePath);
    const cursor = reader.getCursor();
    const records = await cursor.next();
    await reader.close();
    return records;
  } catch (error) {
    console.error('Error reading parquet file:', error);
    throw error;
  }
});
