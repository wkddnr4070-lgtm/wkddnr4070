import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    host: '0.0.0.0',
    hmr: false,
    strictPort: true,
    allowedHosts: 'all',
    cors: true,
    open: true, // 서버 시작 시 자동으로 브라우저 열기
  },
  define: {
    global: 'globalThis',
  }
})

