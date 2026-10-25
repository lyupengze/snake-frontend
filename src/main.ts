import { createApp } from 'vue';
import './style.css'; // 引入全局基础样式
import App from './App.vue';
import router from './router'; // 引入路由配置
import { StatusBar, Style } from '@capacitor/status-bar'; // [新增] 引入状态栏插件
import { Capacitor } from '@capacitor/core'; // [新增] 引入 Capacitor 核心

/**
 * 应用初始化与挂载
 * 创建 Vue 实例，注册路由插件，并将其绑定到 index.html 中的 #app 节点上。
 */
const app = createApp(App);

// 启用 Vue Router，使应用具备前端路由能力
app.use(router);

// [新增] 原生端状态栏沉浸式处理（解决上下白边）
if (Capacitor.isNativePlatform()) {
  // 允许网页内容延伸到系统状态栏下方
  StatusBar.setOverlaysWebView({ overlay: true });

  // 强制状态栏文字为浅色（暗黑模式）
  StatusBar.setStyle({ style: Style.Dark });

  // 强制状态栏背景为你的主题色
  StatusBar.setBackgroundColor({ color: '#121212' });
}

// 将应用挂载到 DOM
app.mount('#app');
