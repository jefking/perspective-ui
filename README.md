# Electron React App with Tailwind CSS

A cross-platform desktop application built with Electron, React, and Tailwind CSS.

## Features

- 🚀 Electron for desktop applications
- ⚛️ React for UI
- 🎨 Tailwind CSS for styling
- 🌐 Web and desktop compatible
- 📁 File system access (for .parquet files)
- ⚙️ WASM support

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

1. Create a new project:
```bash
npx create-vite my-electron-app --template react
cd my-electron-app
```

2. Install dependencies:
```bash
npm install -D electron electron-builder @vitejs/plugin-react autoprefixer postcss tailwindcss
npm install electron-is-dev
```

3. Install UI dependencies:
```bash
npm install @headlessui/react @heroicons/react
```

4. Development:
- For Electron development:
```bash
npm run dev:electron
```
- For web-only development:
```bash
npm run dev:web
```

5. Build:
```bash
npm run build
```

## Project Structure

```
my-electron-app/
├── electron/
│   └── main.js
├── src/
│   ├── components/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Scripts

- `dev:electron`: Run the app in electron development mode
- `dev:web`: Run the app in web development mode
- `build`: Build the app for production
- `preview`: Preview the production build

## Configuration

Check the following configuration files:
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `electron/main.js` - Electron main process