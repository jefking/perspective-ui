import { useState } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import ParquetViewer from './components/ParquetViewer'

function App() {
  const [data, setData] = useState(null);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Parquet Explorer
          </h1>
          <FileUpload onDataLoaded={setData} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {data ? (
          <div className="h-full p-4">
            <ParquetViewer data={data} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No data loaded</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload a Parquet file to get started
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            Powered by Perspective
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App 