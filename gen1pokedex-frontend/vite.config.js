import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration with proxy for backend API
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend server URL
        changeOrigin: true,
      }
    }
  }
})