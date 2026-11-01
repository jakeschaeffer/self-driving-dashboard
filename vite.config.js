import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // tailwindcss() turns the utility classes in our components (e.g. "rounded-2xl p-4")
  // into real CSS at build time, keeping only the ones we actually use.
  plugins: [react(), tailwindcss()],
  resolve: {
    // BoardUI components import each other as "@/components/…", "@/utils/cx".
    // This alias points "@" at src/, which is where those folders live.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Relative asset paths, so the built site works from any folder or host.
  base: './',
})
