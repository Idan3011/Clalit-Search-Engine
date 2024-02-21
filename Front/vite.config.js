import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const PORT = import.meta.env.VITE_REACT_APP_PORT;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', 
    port: PORT
  }
})
