document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const loadButton = document.getElementById('loadButton');
    const output = document.getElementById('output');

    loadButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a Parquet file first');
            return;
        }

        try {
            const buffer = await file.arrayBuffer();
            
            output.textContent = 'File loaded successfully!';
        } catch (error) {
            console.error('Error reading Parquet file:', error);
            output.textContent = 'Error reading file: ' + error.message;
        }
    });
});