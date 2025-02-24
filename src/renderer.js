// Wait for the custom elements to be defined
window.addEventListener('WebComponentsReady', () => {
    console.log('Web Components are ready');
});

async function loadParquetFile() {
    const fileInput = document.getElementById('fileInput');
    const output = document.getElementById('output');
    const viewer = document.getElementById('perspective-viewer');

    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a Parquet file first');
        return;
    }

    try {
        const buffer = await file.arrayBuffer();
        
        // Initialize a new worker
        const worker = perspective.worker();
        // Create a table from the ArrayBuffer
        const table = await worker.table(buffer);
        
        // Load the table into the viewer
        await viewer.load(table);
        
        // Configure some default settings for the viewer
        await viewer.restore({
            plugin: 'Datagrid',
            settings: true,
            theme: 'Pro Light'
        });

        output.textContent = 'File loaded successfully!';
    } catch (error) {
        console.error('Error reading Parquet file:', error);
        output.textContent = 'Error reading file: ' + error.message;
    }
}

// Initialize perspective when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Register the plugins with the viewer
    await Promise.all([
        perspective.viewer.registerPlugin("perspective-viewer-datagrid"),
        perspective.viewer.registerPlugin("perspective-viewer-d3fc")
    ]);
    console.log('Perspective plugins registered');
});