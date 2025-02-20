# Parquet Explorer

A cross-platform desktop application for viewing Parquet files, built with Electron, React, and Perspective.

## Features

- 🚀 Electron for desktop applications
- ⚛️ React for UI
- 📊 Perspective for data visualization
- 🎨 Tailwind CSS for styling
- 📁 Parquet file support
- ⚙️ WASM-powered parsing

## Project Structure

```
pee-viewer/
├── electron/
│   ├── main.cjs
│   └── preload.cjs
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx
│   │   └── ParquetViewer.jsx
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Development

1. Install dependencies and set up the project:
```bash
npm run build
```

2. Start the development server:
```bash
npm start
```

## Usage

1. Click "Open Parquet File" to select a Parquet file
2. Use Perspective's interface to:
   - View data in a grid
   - Create visualizations
   - Filter and sort data
   - Export data