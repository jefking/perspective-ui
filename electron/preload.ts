import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  readParquetFile: (filePath: string) => ipcRenderer.invoke('parquet:readFile', filePath),
});
