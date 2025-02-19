import { useEffect, useRef, useState } from 'react';
import perspective from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";

export default function ParquetViewer({ data }) {
  const viewerRef = useRef(null);
  const [worker] = useState(() => perspective.worker());

  useEffect(() => {
    if (!viewerRef.current || !data) return;

    const loadData = async () => {
      try {
        const table = await worker.table(data);
        await viewerRef.current.load(table);
        
        // Set minimal default configuration
        await viewerRef.current.restore({
          plugin: "datagrid",
          settings: true,
          theme: "Material Dark"
        });
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    loadData();
    return () => worker.table?.delete();
  }, [data, worker]);

  return <perspective-viewer ref={viewerRef} class="h-full" />;
} 