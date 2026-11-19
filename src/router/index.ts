import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import { SITE } from '../config/site';
import { isNative } from '../utils/runtime';

/**
 * 展示模式（默认）下，只有 LandingView 对外开放；
 * 其余页面保留完整实现，通过 meta.requiresGameplay 统一拦截。
 * 版号下发后把 SITE.gameplayEnabled 置为 true 即可恢复。
 */
const gameplayRoutes: Array<RouteRecordRaw> = [
  {
    path: '/menu',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresGameplay: true },
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('../views/GameView.vue'),
    meta: { requiresGameplay: true },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => import('../views/LeaderboardView.vue'),
    meta: { requiresGameplay: true },
  },
  {
    path: '/ai-demo',
    name: 'ai-demo',
    component: () => import('../views/AIDemoView.vue'),
    meta: { requiresGameplay: true },
  },
];

/**
 * Web 端：`/` 是展示主页。
 * 原生 App（Tauri / Capacitor）：打包时开启玩法，`/` 直接进入原游戏菜单，
 * 保持与旧版本完全一致的启动体验；展示主页代码保留在 `/landing`。
 */
const routes: Array<RouteRecordRaw> =
  isNative && SITE.gameplayEnabled
    ? [
        { path: '/', redirect: '/menu' },
        ...gameplayRoutes,
        { path: '/landing', name: 'landing', component: LandingView },
        { path: '/:pathMatch(.*)*', redirect: '/menu' },
      ]
    : [
        { path: '/', name: 'landing', component: LandingView },
        ...gameplayRoutes,
        // 未知路径回到主页，避免展示模式下出现空白页
        { path: '/:pathMatch(.*)*', redirect: '/' },
      ];

// HTML5 History 模式，生产环境需 Nginx 配置 try_files 回退到 index.html
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  if (to.meta.requiresGameplay && !SITE.gameplayEnabled) {
    // 带上 locked 参数，主页据此提示「展示模式下暂未开放」
    return { path: '/', query: { locked: String(to.name ?? to.path) } };
  }
});

export default router;
