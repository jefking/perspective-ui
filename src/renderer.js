import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer/dist/cdn/perspective-viewer.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid/dist/cdn/perspective-viewer-datagrid.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc/dist/cdn/perspective-viewer-d3fc.js";

console.log('Renderer script loaded');
const output = document.getElementById('output');

function initializeApp() {
    output.textContent = 'DOMContentLoaded event fired';
    // const fileInput = document.getElementById('fileInput');
    
    // if (!output || !fileInput) {
    //     console.error('Required elements not found');
    //     return;
    // }

    // console.log('Elements found');
    // output.textContent = 'Loading perspective...';
    
    // try {
    //     // Initialize perspective worker
    //     const worker = perspective.worker();
    //     console.log('Perspective worker initialized');
        
    //     fileInput.addEventListener('change', async () => {
    //         console.log('File selected');
    //         output.textContent = 'Loading file...';
            
    //         const viewer = document.getElementById('perspective-viewer');
    //         const file = fileInput.files[0];
            
    //         if (!file) {
    //             alert('Please select a Parquet file first');
    //             return;
    //         }

    //         try {
    //             const buffer = await file.arrayBuffer();
    //             const table = await worker.table(buffer);
                
    //             await viewer.load(table);
    //             await viewer.restore({
    //                 plugin: 'Datagrid',
    //                 settings: true,
    //                 theme: 'Pro Light'
    //             });

    //             output.textContent = 'File loaded successfully!';
    //             console.log('File loaded successfully');
    //         } catch (error) {
    //             console.error('Error reading Parquet file:', error);
    //             output.textContent = 'Error reading file: ' + error.message;
    //         }
    //     });
        
    //     output.textContent = 'Ready to load files';
    //     console.log('Setup complete');
    // } catch (error) {
    //     console.error('Error initializing perspective:', error);
    //     output.textContent = 'Error initializing perspective: ' + error.message;
    // }
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
    // If not loaded yet, add event listener
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // If already loaded, run initialization immediately
    initializeApp();
}