import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL('.', import.meta.url)), '')
  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      'process.env.VITE_SOCKET_BASE_URL': JSON.stringify(env.VITE_SOCKET_BASE_URL),
    },
    server: {
      cors: true,
      allowedHosts: ['qms-mpp.web.id'],
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000/api',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              proxyReq.removeHeader('Origin')
            })
          },
        },
        '/socket.io': {
          target:
            env.VITE_WS_URL ||
            env.VITE_SOCKET_BASE_URL ||
            (env.VITE_API_BASE_URL || '').replace(/\/api(\/v1)?$/, ''),
          changeOrigin: true,
          ws: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              try {
                proxyReq.removeHeader('Origin')
              } catch (err) {
                console.error('Error removing Origin header:', err)
              }
            })
          },
        },
        '/ws': {
          target:
            env.VITE_WS_URL ||
            env.VITE_SOCKET_BASE_URL ||
            (env.VITE_API_BASE_URL || '').replace(/\/api(\/v1)?$/, ''),
          changeOrigin: true,
          ws: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              try {
                proxyReq.removeHeader('Origin')
              } catch (err) {
                console.error('Error removing Origin header:', err)
              }
            })
          },
        },
        '/audio': {
          target: 'https://is3.cloudhost.id',
          changeOrigin: true,
          ws: false,
          rewrite: (path) => path.replace(/^\/audio/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              try {
                proxyReq.removeHeader('Origin')
              } catch (err) {
                console.error('Error removing Origin header:', err)
              }
            })
            proxy.on('proxyRes', (proxyRes, req, res) => {
              try {
                const origin = req.headers.origin || '*'
                res.setHeader('Access-Control-Allow-Origin', origin)
                res.setHeader('Access-Control-Allow-Headers', 'Range')
                res.setHeader(
                  'Access-Control-Expose-Headers',
                  'Accept-Ranges, Content-Range, Content-Length',
                )
              } catch (err) {
                console.error('Error setting CORS headers:', err)
              }
            })
          },
        },
      },
    },
  }
})
