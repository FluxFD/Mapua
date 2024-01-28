import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/oq1/', // Your API server address
        changeOrigin: true,
        cors: true, // Enable CORS
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
