import { useState } from 'react';

export default function App() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Parquet Viewer (Web)
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded">
            ⚠️ This is the web version of the Parquet viewer. 
            File operations will be implemented in future updates.
          </div>

          <button
            onClick={() => setError('File operations are not yet implemented in the web version.')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Open Parquet File
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-600 dark:text-gray-400">
              This application will allow you to view and analyze Parquet files directly in your browser.
              The full functionality will include:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-400">
              <li>Loading Parquet files</li>
              <li>Viewing data in a tabular format</li>
              <li>Basic data analysis and visualization</li>
              <li>Data filtering and sorting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}