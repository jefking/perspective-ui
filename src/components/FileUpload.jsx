import { useState } from 'react';

export default function FileUpload({ onDataLoaded }) {
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const data = await window.electron.ipcRenderer.invoke('read-parquet', file.path);
      console.log('Loaded Parquet data:', data);
      onDataLoaded(data);
    } catch (error) {
      console.error('Error loading Parquet file:', error);
      alert('Error loading Parquet file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileElem"
        accept=".parquet"
        className="hidden"
        onChange={handleFileSelect}
        disabled={loading}
      />
      <label 
        htmlFor="fileElem"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Open File'}
      </label>
    </div>
  );
}