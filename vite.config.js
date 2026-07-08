import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative base so the built assets resolve whether the app is served at the
  // domain root (firebase.json / nginx.conf both serve at `/`) or under a path
  // prefix. Navigation is state-based (no URL routing), so relative is safe.
  base: './',
})
