import { useState } from 'react';

export default function FileUpload({ onDataLoaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const data = await window.electron.ipcRenderer.invoke('read-parquet', file.path);
      console.log('Loaded parquet data:', data);
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No data found in parquet file');
      }
      onDataLoaded(data);
    } catch (error) {
      console.error('Error reading Parquet file:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {loading && (
        <div className="text-sm text-gray-600 animate-pulse">
          Loading...
        </div>
      )}
      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}
      <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
        {loading ? 'Loading...' : 'Open Parquet File'}
        <input
          type="file"
          accept=".parquet"
          onChange={handleFileSelect}
          className="hidden"
          disabled={loading}
        />
      </label>
    </div>
  );
} 