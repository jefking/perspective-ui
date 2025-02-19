import { useState } from 'react';

export default function FileUpload({ onDataLoaded }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const filePath = await window.electron.openFile();
      if (filePath) {
        const data = await window.electron.ipcRenderer.invoke('read-parquet', filePath);
        onDataLoaded(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Open File'}
    </button>
  );
} 