import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/murmur/',
  plugins: [
    solidPlugin(),
    VitePWA({ injectRegister: 'auto', registerType: 'autoUpdate' }),
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
