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

  return data ? (
    <ParquetViewer data={data} />
  ) : (
    <form className="my-form">
      <p>Upload a Parquet file by dragging from your desktop and dropping onto the dashed region.</p>
      <p>(Data is processed in browser, and never sent to any server).</p>
      <FileUpload onDataLoaded={setData} />
    </form>
  );
}

export default App 