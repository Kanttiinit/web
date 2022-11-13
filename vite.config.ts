import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import solidPlugin from 'vite-plugin-solid';
import pkg from './package.json';

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,png,svg}'],
        globIgnores: [
          "**/node_modules/**/*",
          "sw.js",
          "workbox-*.js",
          "index.html"
        ]
      },
      manifest: {
        name: 'Kanttiinit',
        short_name: 'Kanttiinit',
        start_url: '.',
        display: 'standalone',
        background_color: '#f4f4f4',
        theme_color: '#009688',
        description: 'Student lunch effortlessly.',
        lang: 'en-US',
        orientation: 'any',
        icons: [
          {
            src: 'logo.png',
            sizes: '800x800',
            type: 'image/png'
          }
        ],
        related_applications: [
          {
            platform: 'web',
            url: 'https://kanttiinit.fi/'
          },
          {
            platform: 'itunes',
            url: 'https://itunes.apple.com/fi/app/kanttiinit/id1069903670?l=fi&mt=8'
          }
        ]
      }
    })
  ],
  define: {
    'VERSION': JSON.stringify(pkg.version),
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
