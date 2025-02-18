interface ElectronAPI {
  openFileDialog: () => Promise<string[]>;
  readParquetFile: (filePath: string) => Promise<any>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export const isElectron = !!window.electron;

export const openFileDialog = async (): Promise<string[]> => {
  if (!isElectron) {
    throw new Error('Electron IPC not available');
  }
  return window.electron.openFileDialog();
};

export const readParquetFile = async (filePath: string): Promise<any> => {
  if (!isElectron) {
    throw new Error('Electron IPC not available');
  }
  return window.electron.readParquetFile(filePath);
};
