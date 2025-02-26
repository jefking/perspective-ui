const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

// Function to find the HTML file
function findIndexPath() {
    const possiblePaths = [
        path.join(__dirname, 'index.html'),
        path.join(__dirname, '..', 'src', 'index.html'),
        path.join(process.cwd(), 'src', 'index.html'),
        path.join(process.cwd(), 'index.html')
    ];
    
    console.log('Searching for index.html in these locations:');
    for (const filePath of possiblePaths) {
        const exists = fs.existsSync(filePath);
        console.log(`- ${filePath} (exists: ${exists})`);
        if (exists) {
            return filePath;
        }
    }
    
    console.error('Could not find index.html in any expected location!');
    return path.join(__dirname, 'index.html');
}

function createWindow () {
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            // Enable nodeIntegration and disable contextIsolation
            // This is less secure but will work without a preload script
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    // Find the best path for index.html
    const indexPath = findIndexPath();
    console.log('Using index path:', indexPath);
    
    win.loadFile(indexPath);
    win.webContents.openDevTools(); // This will help us debug
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});