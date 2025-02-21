import { useEffect, useRef } from 'react';
import perspective from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";

export default function ParquetViewer({ data }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!viewerRef.current || !data) return;

    const loadData = async () => {
      try {
        // Create a new worker
        const worker = perspective.worker();
        // Load the data into a table
        const table = await worker.table(data);
        // Load the table into the viewer
        await viewerRef.current.load(table);

        // Configure the viewer
        await viewerRef.current.restore({
          plugin: "datagrid",
          settings: true,
          theme: "Material Dark"
        });

        console.log('Data loaded into Perspective');
      } catch (err) {
        console.error("Error loading data into Perspective:", err);
      }
    };

    loadData();
  }, [data]);

  return (
    <div className="h-full w-full">
      <perspective-viewer ref={viewerRef} />
    </div>
  );
} 