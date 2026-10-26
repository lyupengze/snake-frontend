import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        // 本地开发时由代理自动注入密钥头，模拟 Nginx 的行为
        headers: {
          'X-Internal-Secret': 'local-test-secret',
        },
      },
    },
  },
});
