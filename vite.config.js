import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // React 17+ supports automatic runtime
      jsxImportSource: 'react',
    }),
  ],
  build: {
    sourcemap: true,
    target: 'esnext',
  },
  server: {
    port: 3000,
    open: true,
  },
})

