import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON == "true" ? './' : ".",
  build: {
    outDir: 'dist',
  },
  server: {
    open: false  // Prevent browser from opening automatically
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}) 