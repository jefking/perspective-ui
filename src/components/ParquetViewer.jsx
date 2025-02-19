import { useEffect, useRef, useState } from 'react';
import perspective from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";

export default function ParquetViewer({ data }) {
  const viewerRef = useRef(null);
  const [worker] = useState(() => perspective.worker());
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!viewerRef.current || !data) return;

    const loadData = async () => {
      try {
        console.log('Loading data into Perspective:', data);
        
        // Create schema from first row
        const schema = {};
        const firstRow = data[0];
        Object.keys(firstRow).forEach(key => {
          const value = firstRow[key];
          if (typeof value === 'number') {
            schema[key] = 'float';
          } else if (typeof value === 'boolean') {
            schema[key] = 'boolean';
          } else {
            schema[key] = 'string';
          }
        });

        console.log('Schema:', schema);
        
        // Create and load table
        const table = await worker.table(schema);
        await table.update(data);
        
        console.log('Table created, loading into viewer');
        
        await viewerRef.current.load(table);
        
        // Set default configuration
        await viewerRef.current.restore({
          plugin: "datagrid",
          settings: true,
          theme: "Material Light",
          columns: Object.keys(schema)
        });

        console.log('Viewer configuration complete');
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
      }
    };

    loadData();

    return () => {
      worker.table?.delete();
    };
  }, [data, worker]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg bg-white">
      <perspective-viewer ref={viewerRef} />
    </div>
  );
} 