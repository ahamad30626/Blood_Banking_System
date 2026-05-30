import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      /**
       * All /api/* requests are proxied to the Spring Boot backend.
       * This makes frontend and backend appear as the SAME origin to the browser,
       * which is required for httpOnly cookies to work without HTTPS.
       */
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
