import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import GameView from '../views/GameView.vue';
import LeaderboardView from '../views/LeaderboardView.vue';
import AIDemoView from '../views/AIDemoView.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/game', name: 'game', component: GameView },
  { path: '/leaderboard', name: 'leaderboard', component: LeaderboardView },
  { path: '/ai-demo', name: 'ai-demo', component: AIDemoView },
];

// HTML5 History 模式，生产环境需 Nginx 配置 try_files 回退到 index.html
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
