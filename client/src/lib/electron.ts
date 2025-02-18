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

const throwWebOnlyError = () => {
  throw new Error(
    'This feature requires the Electron app. Please run the app using "npm run dev:electron" instead of "npm run dev:web".'
  );
};

export const openFileDialog = async (): Promise<string[]> => {
  if (!isElectron) {
    throwWebOnlyError();
  }
  return window.electron.openFileDialog();
};

export const readParquetFile = async (filePath: string): Promise<any> => {
  if (!isElectron) {
    throwWebOnlyError();
  }
  return window.electron.readParquetFile(filePath);
};