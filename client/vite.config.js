import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const clerkKey = env.VITE_CLERK_PUBLISHABLE_KEY
  const isMock = !clerkKey || clerkKey.includes('placeholder') || !clerkKey.startsWith('pk_');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: isMock ? {
        '@clerk/clerk-react': path.resolve(__dirname, 'src/configs/mockClerk.jsx')
      } : {}
    }
  }
})
