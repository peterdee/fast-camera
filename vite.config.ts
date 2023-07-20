import { defineConfig, type UserConfigExport } from 'vite';
import { readFileSync } from 'node:fs';
import vue from '@vitejs/plugin-vue';

const configuration: UserConfigExport = {
  plugins: [vue()],
};

if (process.env.ENV === 'local') {
  configuration.server = {
    cors: true,
    host: true,
    https: {
      cert: readFileSync('./certificates/cert.pem'),
      key: readFileSync('./certificates/key.pem'),
    },
    port: 3000,
  };
}

export default defineConfig(configuration);
