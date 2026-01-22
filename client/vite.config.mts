import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Vite config for React client
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to the Express backend in development
      '/api': 'http://localhost:5000',
      // Proxy model file requests to the Express backend
      '/models': 'http://localhost:5000'
    }
  }
}); 