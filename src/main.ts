import { createApp } from 'vue';
import './style.css'; // 引入全局基础样式
import App from './App.vue';
import router from './router'; // 引入路由配置

/**
 * 应用初始化与挂载
 * 创建 Vue 实例，注册路由插件，并将其绑定到 index.html 中的 #app 节点上。
 */
const app = createApp(App);

// 启用 Vue Router，使应用具备前端路由能力
app.use(router);

// 将应用挂载到 DOM
app.mount('#app');
