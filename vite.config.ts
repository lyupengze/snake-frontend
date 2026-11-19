import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  if (mode === 'native') {
    const env = loadEnv(mode, process.cwd(), '');
    if (!env.VITE_API_BASE_URL) {
      throw new Error('[native] 缺少 VITE_API_BASE_URL，请检查 .env.native');
    }
    if (env.VITE_GAMEPLAY_ENABLED !== 'true') {
      throw new Error('[native] 必须设置 VITE_GAMEPLAY_ENABLED=true，否则 App 会显示展示主页');
    }
  }

  return {
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
  };
});
