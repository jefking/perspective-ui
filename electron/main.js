const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const arrow = require('apache-arrow')
const parquet = require('parquetjs')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
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
  try {
    const reader = await parquet.ParquetReader.openFile(filePath)
    const cursor = reader.getCursor()
    const records = []
    
    let record = null
    while (record = await cursor.next()) {
      records.push(record)
    }
    
    await reader.close()
    return records
  } catch (error) {
    console.error('Error reading Parquet file:', error)
    throw error
  }
}) 