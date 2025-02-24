import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer/dist/cdn/perspective-viewer.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid/dist/cdn/perspective-viewer-datagrid.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc/dist/cdn/perspective-viewer-d3fc.js";

console.log('Renderer script loaded');
const output = document.getElementById('output');

// Initialize perspective worker after WASM is loaded
window.addEventListener("perspective-ready", async () => {
    const worker = window.perspective.worker();
    console.log('Perspective worker created');

    function initializeApp() {
        output.textContent = 'DOMContentLoaded event fired';
        const fileInput = document.getElementById('fileInput');
        
        if (!output || !fileInput) {
            console.error('Required elements not found');
            return;
        }

        output.textContent = 'Elements found';
        output.textContent = 'Loading perspective...';
        
        try {
            output.textContent = 'Perspective initialized - ready to load files';
            
            fileInput.addEventListener('change', async () => {
                output.textContent = 'Loading file...';
                
                const viewer = document.getElementById('perspective-viewer');
                const file = fileInput.files[0];
                
                if (!file) {
                    alert('Please select a Parquet file first');
                    return;
                }

                try {
                    const buffer = await file.arrayBuffer();
                    const table = await worker.table(buffer);
                    
                    await viewer.load(table);
                    await viewer.restore({
                        plugin: 'Datagrid',
                        settings: true,
                        theme: 'Pro Light'
                    });

                    output.textContent = 'File loaded successfully!';
                } catch (error) {
                    output.textContent = 'Error reading file: ' + error.message;
                }
            });
            
            output.textContent = 'Ready to load files';
            output.textContent = 'Setup complete';
        } catch (error) {
            output.textContent = 'Error initializing perspective: ' + error.message;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
});