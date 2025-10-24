import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// اكتشاف البيئة: GitHub Pages أو Netlify
const isGitHubPages = process.env.VITE_DEPLOY_TARGET === 'github'
const base = isGitHubPages ? '/SuondTube/' : '/'

export default defineConfig({
  plugins: [vue()],
  base: base,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
  },
  publicDir: 'public',
})
