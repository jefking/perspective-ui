import { contextBridge, ipcRenderer } from 'electron';

// Log when preload script starts executing
console.log('Preload script is running');

// Create the electron bridge with logging
contextBridge.exposeInMainWorld('electron', {
  openFileDialog: async () => {
    console.log('IPC: Calling openFileDialog');
    const result = await ipcRenderer.invoke('dialog:openFile');
    console.log('IPC: openFileDialog result:', result);
    return result;
  },
  readParquetFile: async (filePath: string) => {
    console.log('IPC: Calling readParquetFile with path:', filePath);
    const result = await ipcRenderer.invoke('parquet:readFile', filePath);
    console.log('IPC: readParquetFile result:', result);
    return result;
  },
});

// Log when bridge is complete
console.log('Electron IPC bridge initialized');