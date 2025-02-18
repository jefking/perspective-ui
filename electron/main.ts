import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as parquet from 'parquetjs';

function createWindow() {
  console.log('Creating main window');
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
    console.log('Loading development URL');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Loading production build');
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  console.log('Main window created');
}

app.whenReady().then(() => {
  console.log('Electron app is ready');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Register IPC handlers
ipcMain.handle('dialog:openFile', async () => {
  console.log('IPC: Handling dialog:openFile request');
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Parquet Files', extensions: ['parquet'] }],
    });

    console.log('Dialog result:', { canceled, filePaths });
    if (canceled) {
      return [];
    }
    return filePaths;
  } catch (error) {
    console.error('Error in dialog:openFile:', error);
    throw error;
  }
});

ipcMain.handle('parquet:readFile', async (_, filePath) => {
  console.log('IPC: Handling parquet:readFile request for path:', filePath);
  try {
    const reader = await parquet.ParquetReader.openFile(filePath);
    console.log('Parquet reader created');
    const cursor = reader.getCursor();
    console.log('Got cursor');
    const records = await cursor.next();
    console.log('Read records:', records);
    await reader.close();
    return records;
  } catch (error) {
    console.error('Error reading parquet file:', error);
    throw error;
  }
});