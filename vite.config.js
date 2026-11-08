import { defineConfig } from 'vite';

// Relative base so the build works on GitHub Pages (served from /chinamitl/) and anywhere else.
export default defineConfig({
  base: './',
  build: { chunkSizeWarningLimit: 900 },
});
