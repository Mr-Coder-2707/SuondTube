import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/', // يمكنك تغييره إلى '/repo-name/' إذا كنت تستخدم GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // استخدام esbuild بدلاً من terser (أسرع ومدمج مع Vite)
  },
  // نسخ ملفات PWA إلى مجلد البناء
  publicDir: 'public',
})
