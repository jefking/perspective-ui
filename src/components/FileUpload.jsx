import { useState } from 'react';

export default function FileUpload({ onDataLoaded }) {
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const data = await window.electron.ipcRenderer.invoke('read-parquet', file.path);
      console.log('Loaded data:', data);
      onDataLoaded(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        id="fileElem"
        accept=".parquet"
        onChange={handleFileSelect}
        disabled={loading}
      />
      <label className="button" htmlFor="fileElem">
        {loading ? 'Loading...' : 'Select a file'}
      </label>
    </>
  );
}