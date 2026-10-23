import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import GameView from '../views/GameView.vue';
import LeaderboardView from '../views/LeaderboardView.vue';

/**
 * 前端路由配置
 *
 * 采用 createWebHistory (HTML5 History 模式)，去除 URL 中的 # 号。
 * 注意：该模式要求服务端（如 Nginx）配置 try_files 将未匹配的请求回退到 index.html。
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 首页
    { path: '/', name: 'home', component: HomeView },

    // 游戏页面（支持通过 ?mode=daily 进入每日挑战）
    { path: '/game', name: 'game', component: GameView },

    // 排行榜页面
    { path: '/leaderboard', name: 'leaderboard', component: LeaderboardView },

    // [防御性处理] 重定向带尾斜杠的路径，防止因 Vite 相对路径 base: './' 导致静态资源解析错误白屏
    { path: '/leaderboard/', redirect: '/leaderboard' },
    { path: '/game/', redirect: '/game' },

    // [兜底处理] 捕获所有未定义路径，重定向到首页
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

export default router;
