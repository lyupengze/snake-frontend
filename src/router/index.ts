import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import GameView from '../views/GameView.vue';
import LeaderboardView from '../views/LeaderboardView.vue';

/**
 * 前端路由配置表
 * [设计原则] 使用强类型 RouteRecordRaw 数组，使得路由配置具备完整的 TypeScript 智能提示。
 */
const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/game', name: 'game', component: GameView },
  { path: '/leaderboard', name: 'leaderboard', component: LeaderboardView },
];

/**
 * 路由器实例
 * 采用 HTML5 History 模式（不带 # 号）。
 * 注意：该模式在生产环境部署时，需要服务端（如 Nginx）配置 try_files 回退到 index.html。
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
