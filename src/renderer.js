const { electronAPI } = window;

console.log('Renderer script loaded');

// Listen for both DOMContentLoaded and load events
['DOMContentLoaded', 'load'].forEach(event => {
    document.addEventListener(event, async () => {
        console.log(`${event} event fired`);
        
        const output = document.getElementById('output');
        const fileInput = document.getElementById('fileInput');
        
        if (!output || !fileInput) {
            console.error('Required elements not found');
            return;
        }

        console.log('Elements found');
        output.textContent = 'Loading perspective...';
        
        try {
            const perspective = await waitForPerspective();
            console.log('Perspective loaded');
            
            await Promise.all([
                perspective.viewer.registerPlugin("perspective-viewer-datagrid"),
                perspective.viewer.registerPlugin("perspective-viewer-d3fc")
            ]);
            
            fileInput.addEventListener('change', async () => {
                console.log('File selected');
                output.textContent = 'Loading file...';
                
                const viewer = document.getElementById('perspective-viewer');
                const file = fileInput.files[0];
                
                if (!file) {
                    alert('Please select a Parquet file first');
                    return;
                }

                try {
                    const buffer = await file.arrayBuffer();
                    const worker = perspective.worker();
                    const table = await worker.table(buffer);
                    
                    await viewer.load(table);
                    await viewer.restore({
                        plugin: 'Datagrid',
                        settings: true,
                        theme: 'Pro Light'
                    });

                    output.textContent = 'File loaded successfully!';
                    console.log('File loaded successfully');
                } catch (error) {
                    console.error('Error reading Parquet file:', error);
                    output.textContent = 'Error reading file: ' + error.message;
                }
            });
            
            output.textContent = 'Perspective plugins registered';
            console.log('Plugins registered');
        } catch (error) {
            console.error('Error initializing perspective:', error);
            output.textContent = 'Error initializing perspective: ' + error.message;
        }
    });
});

// Wait for perspective to be available
function waitForPerspective() {
    return new Promise((resolve) => {
        if (window.perspective) {
            resolve(window.perspective);
        } else {
            const check = () => {
                if (window.perspective) {
                    resolve(window.perspective);
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        }
    });
}