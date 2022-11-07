import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  define: {
    'VERSION': JSON.stringify(process.env.npm_package_version),
    'PUBLIC_ASSET_PATH': JSON.stringify('/'),
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
