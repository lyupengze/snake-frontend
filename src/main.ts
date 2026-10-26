import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

const app = createApp(App);
app.use(router);

// 原生端沉浸式状态栏：网页内容延伸到状态栏下方，消除白边
if (Capacitor.isNativePlatform()) {
  StatusBar.setOverlaysWebView({ overlay: true });
  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#121212' });
}

app.mount('#app');
