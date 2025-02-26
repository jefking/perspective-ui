const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

// Try multiple possible locations for preload.js
function findPreloadPath() {
    const possiblePaths = [
        path.join(__dirname, 'preload.js'),                 // /src/preload.js
        path.join(__dirname, '..', 'src', 'preload.js'),    // /src/preload.js (from parent dir)
        path.join(__dirname, '..', 'preload.js'),           // /preload.js
        path.join(process.cwd(), 'src', 'preload.js'),      // cwd/src/preload.js
        path.join(process.cwd(), 'preload.js')              // cwd/preload.js
    ];
    
    console.log('Searching for preload.js in these locations:');
    for (const filePath of possiblePaths) {
        const exists = fs.existsSync(filePath);
        console.log(`- ${filePath} (exists: ${exists})`);
        if (exists) {
            return filePath;
        }
    }
    
    console.error('Could not find preload.js in any expected location!');
    // Return the default path even though it doesn't exist (for consistent error messages)
    return path.join(__dirname, 'preload.js');
}

// Similarly find the HTML file
function findIndexPath() {
    const possiblePaths = [
        path.join(__dirname, 'index.html'),
        path.join(__dirname, '..', 'src', 'index.html'),
        path.join(__dirname, '..', 'index.html'),
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
    
    // Find the best path for preload.js
    const preloadPath = findPreloadPath();
    console.log('Using preload path:', preloadPath);
    
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
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