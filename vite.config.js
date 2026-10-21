import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['.trycloudflare.com'],
    // 增加 proxy 配置，把请求转发给本地后端
    proxy: {
      // 假设你的接口都以 /api 开头
      '/api': {
        target: 'http://127.0.0.1:8080', // 这里改成你真实的后端端口，比如 8080 或 3000
        changeOrigin: true,
        // 如果你的后端接口本身没有 /api 前缀，保留下面这行；如果有，请删掉
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
