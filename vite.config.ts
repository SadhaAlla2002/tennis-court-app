import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use a relative base so the app works when hosted under a subpath
  // and when opening the built files from a static server without root.
  base: './',
  plugins: [react()],
})
