import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.REACT_APP_API_URL || 'http://backend:4000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: false
  }
})
