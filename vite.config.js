import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), viteSingleFile(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined // put everything in one file
      }
    }
  },
  base: './', // optional, ensures relative paths
})
