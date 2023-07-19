import { defineConfig, type ServerOptions } from 'vite';
import { readFileSync } from 'node:fs';
import vue from '@vitejs/plugin-vue';

// TODO: certificates should be used only for local development
export default defineConfig({
  plugins: [vue()],
  server: {
    cors: true,
    host: true,
    https: {
      cert: readFileSync('./certificates/cert.pem'),
      key: readFileSync('./certificates/key.pem'),
    },
    port: 3000,
  },
})
