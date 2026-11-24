import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {
  const portfolioMode = process.env.VITE_PORTFOLIO_MODE || 'content_review'
  const draftLoader =
    portfolioMode === 'approved_public'
      ? path.resolve(__dirname, 'src/data/portfolioDraftLoader.stub.js')
      : path.resolve(__dirname, 'src/data/portfolioDraftLoader.review.js')

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_PORTFOLIO_MODE': JSON.stringify(portfolioMode),
    },
    resolve: {
      alias: {
        '#portfolio-draft-loader': draftLoader,
      },
    },
    server: {
      proxy: {
        // Same-origin /api via Vite. Default to Railway so /dashboard works without local Django.
        // For a local backend: set VITE_PROXY_API=http://127.0.0.1:8000
        '/api': {
          target:
            process.env.VITE_PROXY_API ||
            'https://orchestrixlabsbackend-production.up.railway.app',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
