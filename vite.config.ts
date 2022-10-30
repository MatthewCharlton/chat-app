import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/murmur/',
  plugins: [
    solidPlugin(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      mode: 'development',
      manifest: {
        name: 'murmur - a chat with mates',
        short_name: 'murmur',
        theme_color: '#46cbb2',
        background_color: '#46cbb2',
        icons: [
          {
            src: 'pwa-192x192.png', // <== don't add slash, for testing
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-256x256.png', // <== don't remove slash, for testing
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'pwa-256x256.png', // <== don't add slash, for testing
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      srcDir: 'src',
      filename: 'sw.ts',
      strategies: 'injectManifest',
      devOptions: {
        enabled: true,
        /* when using generateSW the PWA plugin will switch to classic */
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ],
  build: {
    target: 'esnext',
  },
});
