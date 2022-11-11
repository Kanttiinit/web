import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  define: {
    'VERSION': JSON.stringify(process.env.npm_package_version),
    'PUBLIC_ASSET_PATH': JSON.stringify('/'),
    'API_BASE': JSON.stringify('https://kitchen.kanttiinit.fi')
  },
  server: {
    port: 8080,
    hmr: false
  },
  build: {
    target: 'es2015',
  },
});
