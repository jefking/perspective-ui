import { useState } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import ParquetViewer from './components/ParquetViewer'

// Import Perspective styles
import '@finos/perspective-viewer'
import '@finos/perspective-viewer-datagrid'
import '@finos/perspective-viewer-d3fc'

function App() {
  const [data, setData] = useState(null);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Parquet Viewer</h1>
        <FileUpload onDataLoaded={setData} />
      </header>

      <main className="flex-1">
        {data ? (
          <ParquetViewer data={data} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Click "Open File" to load a Parquet file
          </div>
        )}
      </main>
    </div>
  );
}

export default App 