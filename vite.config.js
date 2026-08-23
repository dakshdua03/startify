import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000, open: true },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // For Cloudflare Pages, ensure SPA routing works
  // publicDir: 'public' is default
})