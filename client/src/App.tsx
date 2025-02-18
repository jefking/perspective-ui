import { useState } from 'react';
import { openFileDialog, readParquetFile } from './lib/electron';

export default function App() {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileData, setFileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async () => {
    try {
      const files = await openFileDialog();
      if (files.length > 0) {
        setFilePath(files[0]);
        const data = await readParquetFile(files[0]);
        setFileData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Parquet Viewer
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <button
            onClick={handleFileSelect}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Open Parquet File
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {filePath && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected file: {filePath}
              </p>
            </div>
          )}

          {fileData && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">File Contents</h2>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
                {JSON.stringify(fileData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
