import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import GameView from '../views/GameView.vue';
import LeaderboardView from '../views/LeaderboardView.vue';

/**
 * 前端路由配置
 *
 * 采用 createWebHistory (HTML5 History 模式)，URL 中不会出现 '#' 号。
 * 注意：该模式要求服务端（如 Nginx）配置 try_files 将未匹配的请求回退到 index.html。
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 首页：游戏模式选择
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // 游戏页面：承载核心 Canvas 游戏逻辑（支持 ?mode=daily 进入每日挑战）
    {
      path: '/game',
      name: 'game',
      component: GameView,
    },
    // 排行榜页面：展示经典与每日挑战的双榜单
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: LeaderboardView,
    },
  ],
});

export default router;
