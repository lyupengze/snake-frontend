import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],

  // [关键配置] 使用相对路径 './'。
  // 这是 Tauri 和 Capacitor 原生打包（file:// 协议）时正确加载静态资源的必须条件。
  // 注意：如果仅作为 Web 部署，此项应改为 '/'
  base: './',

  // 本地开发时的代理配置（目前已注释）。
  // 若想让 Web 端开发时不依赖 .env 中的绝对地址，可取消注释并通过 /api 代理请求。
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1:8080',
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
