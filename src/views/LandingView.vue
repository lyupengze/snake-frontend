<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SITE } from '../config/site';
import { isNative } from '../utils/runtime';
import previewImage from '../../images/game-preview.png';

const route = useRoute();
const router = useRouter();

const pageNames: Record<string, string> = {
  home: '游戏菜单',
  game: '游戏',
  leaderboard: '排行榜',
  'ai-demo': 'AI 寻路演示',
};

const lockedPage = ref(typeof route.query.locked === 'string' ? route.query.locked : '');
const showLocked = computed(() => Boolean(lockedPage.value));
const lockedLabel = computed(() => pageNames[lockedPage.value] ?? '该页面');

const dismissLocked = () => {
  lockedPage.value = '';
  const query = { ...route.query };
  delete query.locked;
  router.replace({ query });
};

const navItems = [
  { href: '#play', label: '玩法' },
  { href: '#tech', label: '技术亮点' },
  { href: '#preview', label: '界面预览' },
  { href: '#stack', label: '技术栈' },
  { href: '#opensource', label: '开源' },
];

const modes = [
  {
    name: '经典模式',
    en: 'CLASSIC',
    desc: '撞墙即死，保留最纯粹的贪吃蛇规则。速度递增，比拼预判与路线规划。',
    accent: '#4caf50',
    icon: 'classic',
  },
  {
    name: '每日挑战',
    en: 'DAILY',
    desc: '全服共享同一个随机种子，每天按日期结算排名，同一张棋盘只此一次。',
    accent: '#ff9800',
    icon: 'daily',
  },
  {
    name: '穿墙模式',
    en: 'WRAP',
    desc: '越界后从另一侧循环出现，棋盘边缘带光晕提示，路线选择更自由。',
    accent: '#ab47bc',
    icon: 'wrap',
  },
];

const features = [
  {
    title: '纯逻辑游戏引擎',
    desc: 'SnakeEngine 独立于 Vue，物理推进、碰撞检测与操作录制彼此解耦，可单独测试与复用。',
    icon: 'engine',
  },
  {
    title: 'Canvas 2D 渲染',
    desc: 'Retina 自适应、5 套主题皮肤、穿墙边缘光晕，所有像素由 Renderer 统一绘制。',
    icon: 'canvas',
  },
  {
    title: 'AI 寻路演示',
    desc: 'BFS 贪心叠加安全校验的 AutoPilot，可在演示模式下自动吃满棋盘。',
    icon: 'ai',
  },
  {
    title: '比特级回放校验',
    desc: '前端 Mulberry32 与 C++ 后端逐位对齐；服务器重放操作序列验证分数，偏差直接 403。',
    icon: 'shield',
  },
  {
    title: '三端网络适配',
    desc: '运行时探测宿主环境，自动切换 fetch / Tauri HTTP / CapacitorHttp，移动端带域名白名单防 SSRF。',
    icon: 'globe',
  },
  {
    title: '合成音效系统',
    desc: 'Web Audio API 预生成 AudioBuffer 并心跳保活，操作反馈零延迟，支持一键静音。',
    icon: 'audio',
  },
];

const stackRows = [
  { layer: '框架', value: 'Vue 3 + TypeScript + Vite' },
  { layer: '路由', value: 'Vue Router（HTML5 History）' },
  { layer: '桌面端', value: 'Tauri 2（Rust）' },
  { layer: '移动端', value: 'Capacitor（Android）' },
  { layer: '渲染', value: 'Canvas 2D' },
  { layer: '音频', value: 'Web Audio API（合成音效）' },
];

const techBadges = ['Vue 3', 'TypeScript', 'Vite', 'Tauri 2', 'Capacitor', 'Canvas 2D', 'Web Audio', 'MIT License'];
</script>

<template>
  <div class="landing">
    <!-- 顶部导航 -->
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/" aria-label="SnakeBattle 首页">
          <svg class="brand-mark" viewBox="0 0 512 512" aria-hidden="true">
            <rect width="512" height="512" rx="96" fill="#121212" stroke="#4caf50" stroke-width="24" />
            <rect x="330" y="110" width="60" height="60" rx="10" fill="#e53935" />
            <rect x="110" y="330" width="60" height="60" rx="10" fill="#388e3c" />
            <rect x="150" y="270" width="60" height="60" rx="10" fill="#388e3c" />
            <rect x="210" y="210" width="60" height="60" rx="10" fill="#4caf50" />
            <rect x="270" y="150" width="60" height="60" rx="10" fill="#2e7d32" />
            <circle cx="285" cy="170" r="8" fill="#fff" />
            <circle cx="288" cy="170" r="4" fill="#000" />
            <circle cx="315" cy="170" r="8" fill="#fff" />
            <circle cx="318" cy="170" r="4" fill="#000" />
          </svg>
          <span>Snake<em>Battle</em></span>
        </a>

        <nav class="nav" aria-label="页面导航">
          <a v-for="item in navItems" :key="item.href" :href="item.href">{{ item.label }}</a>
        </nav>

        <div class="header-actions">
          <router-link v-if="isNative" to="/menu" class="header-back" aria-label="返回游戏主页">
            <span aria-hidden="true">←</span>
            <span class="back-text">返回主页</span>
          </router-link>

          <a
            class="header-github"
            :href="SITE.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="前端源码仓库"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" fill="currentColor">
              <path
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
              />
            </svg>
            <span>前端</span>
          </a>

          <a
            class="header-github"
            :href="SITE.backendGithubUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="后端源码仓库"
          >
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <ellipse cx="12" cy="5" rx="7" ry="3" />
              <path d="M5 5v6c0 1.66 3.13 3 7 3s7-1.34 7-3V5" />
              <path d="M5 11v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
            </svg>
            <span>后端</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">
          <span class="pulse-dot" aria-hidden="true"></span>
          {{ SITE.version }} · 技术展示页
        </span>

        <h1>Snake<span>Battle</span></h1>

        <p class="hero-lead">
          一套代码，三端同源。用 <strong>Vue 3 + TypeScript</strong> 打造的跨平台贪吃蛇客户端，
          在浏览器、Tauri 桌面端与 Capacitor Android 上跑出同样的手感。
        </p>

        <div class="notice" role="note">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 3 20 6v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6z" />
            <path d="M12 9v4M12 16.5v.5" />
          </svg>
          <span>
            因尚未取得游戏版号，本站当前仅作技术展示，暂不开放在线试玩。
            已完成的玩法与源码全部保留，版号下发后可随时恢复。
          </span>
        </div>

        <div class="hero-actions">
          <template v-if="SITE.gameplayEnabled">
            <router-link class="btn btn-primary" to="/menu">开始游戏</router-link>
            <a class="btn btn-ghost" :href="SITE.githubUrl" target="_blank" rel="noopener noreferrer">
              前端源码
            </a>
          </template>
          <template v-else>
            <a class="btn btn-primary" :href="SITE.githubUrl" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path
                  d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
                />
              </svg>
              查看前端源码
            </a>
            <a class="btn btn-ghost" href="#play">了解项目</a>
          </template>
        </div>

        <p class="hero-repo-note">
          <span class="repo-dot" aria-hidden="true"></span>
          后端服务同样开源：
          <a :href="SITE.backendGithubUrl" target="_blank" rel="noopener noreferrer">
            snake-backend
            <span aria-hidden="true">↗</span>
          </a>
        </p>

        <ul class="hero-stats">
          <li><strong>3</strong><span>端同源</span></li>
          <li><strong>3</strong><span>种玩法</span></li>
          <li><strong>5</strong><span>套主题</span></li>
        </ul>
      </div>

      <div class="hero-visual">
        <div class="board-card">
          <div class="board-chrome">
            <span class="dot dot-red"></span>
            <span class="dot dot-amber"></span>
            <span class="dot dot-green"></span>
            <span class="board-url">snakebattle.cn</span>
            <span class="board-badge">DISPLAY ONLY</span>
          </div>

          <div class="board-body">
            <svg class="board-svg" viewBox="0 0 440 440" role="img" aria-label="SnakeBattle 游戏画面示意图：一条绿色贪吃蛇正朝红色食物移动">
              <defs>
                <linearGradient id="boardBg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#101a12" />
                  <stop offset="1" stop-color="#090c0a" />
                </linearGradient>
                <linearGradient id="snakeGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stop-color="#1b5e20" />
                  <stop offset="0.55" stop-color="#43a047" />
                  <stop offset="1" stop-color="#7ee787" />
                </linearGradient>
                <radialGradient id="boardGlow" cx="0.82" cy="0.12" r="0.6">
                  <stop offset="0" stop-color="#4caf50" stop-opacity="0.16" />
                  <stop offset="1" stop-color="#4caf50" stop-opacity="0" />
                </radialGradient>
                <pattern id="boardGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                </pattern>
                <filter id="appleGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="440" height="440" rx="18" fill="url(#boardBg)" />
              <rect width="440" height="440" rx="18" fill="url(#boardGrid)" />
              <rect width="440" height="440" rx="18" fill="url(#boardGlow)" />

              <!-- 蛇身：从尾部到头部，尾部颜色更深 -->
              <g>
                <rect x="93" y="317" width="30" height="30" rx="7" fill="#1b5e20" />
                <rect x="93" y="285" width="30" height="30" rx="7" fill="#235f27" />
                <rect x="125" y="285" width="30" height="30" rx="7" fill="#2e7d32" />
                <rect x="125" y="253" width="30" height="30" rx="7" fill="#337f36" />
                <rect x="125" y="221" width="30" height="30" rx="7" fill="#388e3c" />
                <rect x="157" y="221" width="30" height="30" rx="7" fill="#3d9741" />
                <rect x="189" y="221" width="30" height="30" rx="7" fill="#43a047" />
                <rect x="189" y="189" width="30" height="30" rx="7" fill="#48aa4c" />
                <rect x="189" y="157" width="30" height="30" rx="7" fill="#4caf50" />
                <rect x="221" y="157" width="30" height="30" rx="7" fill="#5bb95e" />
                <rect x="253" y="157" width="30" height="30" rx="7" fill="url(#snakeGrad)" stroke="#8ee894" stroke-opacity="0.35" stroke-width="1.5" />
              </g>

              <!-- 眼睛：看向右侧的食物 -->
              <circle cx="262" cy="168" r="4.2" fill="#ffffff" />
              <circle cx="264" cy="168" r="2.1" fill="#0b120d" />
              <circle cx="276" cy="168" r="4.2" fill="#ffffff" />
              <circle cx="278" cy="168" r="2.1" fill="#0b120d" />

              <!-- 舌头 -->
              <path d="M286 178h14" stroke="#e53935" stroke-width="3" stroke-linecap="round" />
              <path d="m300 178 7-5m-7 5 7 5" stroke="#e53935" stroke-width="3" stroke-linecap="round" fill="none" />

              <!-- 食物 -->
              <g filter="url(#appleGlow)">
                <rect x="317" y="157" width="30" height="30" rx="7" fill="#e53935" />
                <rect x="323" y="163" width="9" height="9" rx="2" fill="#ffffff" fill-opacity="0.42" />
              </g>

              <!-- 边角装饰 -->
              <circle cx="377" cy="86" r="2" fill="#7ee787" fill-opacity="0.5" />
              <circle cx="70" cy="120" r="1.6" fill="#7ee787" fill-opacity="0.35" />
              <circle cx="360" cy="330" r="1.8" fill="#7ee787" fill-opacity="0.3" />
            </svg>

            <span class="board-caption">静态示意图 · 不可操作</span>
          </div>
        </div>

        <div class="float-chip chip-one">
          <span class="chip-dot"></span>
          Canvas 2D · 60 FPS
        </div>
        <div class="float-chip chip-two">
          <span class="chip-dot"></span>
          Mulberry32 回放校验
        </div>
      </div>
    </section>

    <div class="stack-strip" aria-label="技术栈关键词">
      <span v-for="badge in techBadges" :key="badge">{{ badge }}</span>
    </div>

    <!-- 玩法 -->
    <section id="play" class="section">
      <div class="section-head">
        <span class="section-index">01 — Gameplay</span>
        <h2>三种玩法，同一套引擎</h2>
        <p class="section-desc">
          规则不同，底层共用 SnakeEngine 与 Renderer。模式切换只改变边界策略与随机种子，
          节奏、手感与判分逻辑始终保持一致。
        </p>
      </div>

      <div class="mode-grid">
        <article v-for="mode in modes" :key="mode.name" class="mode-card" :style="{ '--accent': mode.accent }">
          <div class="mode-top">
            <span class="mode-icon">
              <svg v-if="mode.icon === 'classic'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
              </svg>
              <svg v-else-if="mode.icon === 'daily'" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M8 3v4M16 3v4M3 10h18" />
                <path d="M8 14h2M14 14h2M8 18h2M14 18h2" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke-dasharray="4 3" />
                <path d="M8 12h8M13 9l3 3-3 3" />
              </svg>
            </span>
            <span class="mode-en">{{ mode.en }}</span>
          </div>
          <h3>{{ mode.name }}</h3>
          <p>{{ mode.desc }}</p>
          <span class="mode-lock">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            展示模式 · 暂未开放
          </span>
        </article>
      </div>
    </section>

    <!-- 技术亮点 -->
    <section id="tech" class="section">
      <div class="section-head">
        <span class="section-index">02 — Engineering</span>
        <h2>为「公平」和「手感」写的代码</h2>
        <p class="section-desc">
          从纯逻辑引擎到比特级回放校验，这个项目把「能玩」之外的部分也完整做了一遍。
        </p>
      </div>

      <div class="feature-grid">
        <article v-for="feature in features" :key="feature.title" class="feature">
          <span class="feature-icon">
            <svg v-if="feature.icon === 'engine'" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3 21 8v8l-9 5-9-5V8z" />
              <path d="m3 8 9 5 9-5M12 13v8" />
            </svg>
            <svg v-else-if="feature.icon === 'canvas'" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <path d="M8 20h8M12 16v4" />
            </svg>
            <svg v-else-if="feature.icon === 'ai'" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="6" cy="18" r="2" />
              <circle cx="18" cy="6" r="2" />
              <path d="M8 18h4a6 6 0 0 0 6-6V8" />
            </svg>
            <svg v-else-if="feature.icon === 'shield'" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3 20 6v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <svg v-else-if="feature.icon === 'globe'" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" />
            </svg>
          </span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </article>
      </div>
    </section>

    <!-- 界面预览 -->
    <section id="preview" class="section">
      <div class="preview-grid">
        <div>
          <div class="section-head">
            <span class="section-index">03 — Preview</span>
            <h2>先看，不玩</h2>
            <p class="section-desc">
              展示模式下，游戏页不再对公网开放。下面是已完成的 Web 端界面截图，仅作预览。
            </p>
          </div>

          <ul class="preview-list">
            <li>
              <svg class="check" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
              5 套主题实时切换，得分与棋盘配色联动
            </li>
            <li>
              <svg class="check" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
              键盘方向键 / 移动端滑动手势，双端操作
            </li>
            <li>
              <svg class="check" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
              结束后一键提交分数，进入全服排行榜
            </li>
            <li>
              <svg class="check" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
              提交失败按状态码分类重试，避免误判作弊
            </li>
          </ul>
        </div>

        <figure class="shot-card">
          <div class="shot-chrome">
            <span class="dot dot-red"></span>
            <span class="dot dot-amber"></span>
            <span class="dot dot-green"></span>
            <span class="shot-url">snakebattle.cn / game</span>
          </div>
          <img :src="previewImage" alt="SnakeBattle Web 端每日挑战结算界面截图" />
          <figcaption>Web 端 · 每日挑战结算界面（历史截图）</figcaption>
        </figure>
      </div>
    </section>

    <!-- 技术栈 -->
    <section id="stack" class="section">
      <div class="section-head">
        <span class="section-index">04 — Stack</span>
        <h2>从像素到网络层</h2>
        <p class="section-desc">
          同一份 <code>src/</code> 代码，构建出 Web 静态站点、Windows 桌面端与 Android 安装包。
        </p>
      </div>

      <div class="stack-grid">
        <div class="spec">
          <div v-for="row in stackRows" :key="row.layer" class="spec-row">
            <span>{{ row.layer }}</span>
            <span>{{ row.value }}</span>
          </div>
        </div>

        <div class="practices">
          <h3>工程化</h3>
          <div class="practice">
            <span class="practice-mark">01</span>
            <p>严格 TypeScript，<code>vue-tsc --noEmit</code> 作为 CI 门禁。</p>
          </div>
          <div class="practice">
            <span class="practice-mark">02</span>
            <p>GitHub Actions 自动执行类型检查与生产构建。</p>
          </div>
          <div class="practice">
            <span class="practice-mark">03</span>
            <p>跨端网络层按运行时环境自动切换，原生端 Fail-Fast。</p>
          </div>
          <div class="practice">
            <span class="practice-mark">04</span>
            <p>MIT License，可自由学习、修改与分发。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 开源 -->
    <section id="opensource" class="cta">
      <div class="cta-card">
        <div class="cta-copy">
          <span class="section-index">05 — Open Source</span>
          <h2>源码即文档</h2>
          <p>
            项目仍在对战体验与跨端适配上持续迭代。欢迎 Star、提 Issue，或者直接读代码。
            本网站为个人全栈技术学习与展示项目，非商业游戏。
          </p>
          <div class="repo-list">
            <a class="repo-link" :href="SITE.githubUrl" target="_blank" rel="noopener noreferrer">
              <span class="repo-tag">前端</span>
              github.com/lyupengze/snake-frontend
              <span aria-hidden="true">↗</span>
            </a>
            <a class="repo-link" :href="SITE.backendGithubUrl" target="_blank" rel="noopener noreferrer">
              <span class="repo-tag">后端</span>
              github.com/lyupengze/snake-backend
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div class="cta-actions">
          <a class="btn btn-primary cta-btn" :href="SITE.githubUrl" target="_blank" rel="noopener noreferrer">
            前端仓库
          </a>
          <a class="btn btn-ghost cta-btn" :href="SITE.backendGithubUrl" target="_blank" rel="noopener noreferrer">
            后端仓库
          </a>
        </div>
      </div>
    </section>

    <!-- 从被拦截页面跳回时的提示 -->
    <transition name="toast">
      <div v-if="showLocked" class="locked-toast" role="status">
        <span>「{{ lockedLabel }}」页面在展示模式下暂未开放</span>
        <button type="button" aria-label="关闭提示" @click="dismissLocked">×</button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.landing {
  --bg: #0d100e;
  --panel: #151a16;
  --line: rgba(255, 255, 255, 0.08);
  --text: #e8efe9;
  --muted: #98a69b;
  --green: #4caf50;
  --green-bright: #7ee787;
  --amber: #ffb74d;
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--text);
  background:
    radial-gradient(900px 520px at 88% -8%, rgba(76, 175, 80, 0.16), transparent 62%),
    radial-gradient(720px 420px at -8% 18%, rgba(0, 188, 212, 0.07), transparent 62%),
    var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ---------- 顶部导航 ---------- */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--line);
  background: rgba(13, 16, 14, 0.72);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 34px;
  width: 100%;
  max-width: 1160px;
  height: 66px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-decoration: none;
}

.brand-mark {
  width: 30px;
  height: 30px;
  border-radius: 8px;
}

.brand em {
  color: var(--green-bright);
  font-style: normal;
}

.nav {
  display: flex;
  gap: 26px;
  margin-left: auto;
}

.nav a {
  color: var(--muted);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav a:hover {
  color: var(--green-bright);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(126, 231, 135, 0.28);
  border-radius: 9px;
  background: rgba(76, 175, 80, 0.1);
  color: #9be59f;
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.header-back:hover {
  border-color: rgba(126, 231, 135, 0.5);
  background: rgba(76, 175, 80, 0.16);
  color: var(--green-bright);
}

.header-github {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  color: #cfd8d1;
  font-size: 13px;
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.header-github:hover {
  border-color: rgba(126, 231, 135, 0.4);
  background: rgba(126, 231, 135, 0.08);
  color: var(--green-bright);
}

/* ---------- Hero ---------- */
.hero {
  display: grid;
  grid-template-columns: 1.06fr 0.94fr;
  gap: 60px;
  align-items: center;
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 84px 24px 64px;
  box-sizing: border-box;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 7px 14px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 999px;
  background: rgba(76, 175, 80, 0.08);
  color: #9be59f;
  font-size: 12.5px;
  letter-spacing: 0.06em;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green-bright);
  box-shadow: 0 0 0 0 rgba(126, 231, 135, 0.5);
  animation: pulse 2.4s ease-out infinite;
}

h1 {
  margin: 22px 0 18px;
  color: #f4f8f5;
  font-size: clamp(54px, 7.4vw, 92px);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.045em;
}

h1 span {
  background: linear-gradient(120deg, #7ee787 0%, #4caf50 48%, #2e7d32 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-lead {
  max-width: 560px;
  margin: 0;
  color: var(--muted);
  font-size: 16.5px;
  line-height: 1.85;
}

.hero-lead strong {
  color: #dbe7de;
  font-weight: 600;
}

.notice {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  margin-top: 26px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 183, 77, 0.24);
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(255, 183, 77, 0.1), rgba(255, 183, 77, 0.03));
  color: #dcc7a2;
  font-size: 13px;
  line-height: 1.75;
}

.notice svg {
  flex: none;
  margin-top: 2px;
  color: var(--amber);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 30px;
}

.hero-repo-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 12.5px;
}

.hero-repo-note a {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #9be59f;
  text-decoration: none;
  transition: color 0.2s ease;
}

.hero-repo-note a:hover {
  color: #c6f2c9;
  text-decoration: underline;
}

.repo-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 8px rgba(126, 231, 135, 0.7);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 14.5px;
  font-weight: 650;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease,
    border-color 0.2s ease;
}

.btn-primary {
  background: linear-gradient(180deg, #66d06b, #3e9142);
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.28);
  color: #08130a;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(76, 175, 80, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

.btn-ghost {
  border-color: var(--line);
  background: rgba(255, 255, 255, 0.035);
  color: #d7e1da;
}

.btn-ghost:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 42px;
  margin: 44px 0 0;
  padding: 0;
  list-style: none;
}

.hero-stats strong {
  display: block;
  color: #eef5f0;
  font-size: 27px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.hero-stats span {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.08em;
}

/* ---------- Hero 视觉 ---------- */
.hero-visual {
  position: relative;
}

.hero-visual::before {
  content: '';
  position: absolute;
  inset: -14% -8%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(76, 175, 80, 0.18), transparent 72%);
  filter: blur(10px);
  pointer-events: none;
}

.board-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 20px;
  background: linear-gradient(180deg, #161d18, #0e120f);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.62), inset 0 0 0 1px rgba(76, 175, 80, 0.07),
    0 0 60px rgba(76, 175, 80, 0.08);
  animation: float 7s ease-in-out infinite;
}

.board-chrome {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.02);
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #3a3a3a;
}

.dot-red {
  background: #ff5f57;
}

.dot-amber {
  background: #febc2e;
}

.dot-green {
  background: #28c840;
}

.board-url {
  max-width: 180px;
  margin-left: 8px;
  overflow: hidden;
  padding: 3px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  color: #7d8a80;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.board-badge {
  margin-left: auto;
  padding: 3px 8px;
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 4px;
  color: #8fd694;
  font-size: 9.5px;
  letter-spacing: 0.14em;
}

.board-body {
  position: relative;
  padding: 14px;
}

.board-svg {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.board-caption {
  position: absolute;
  right: 26px;
  bottom: 26px;
  padding: 5px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  background: rgba(8, 12, 9, 0.72);
  color: #93a196;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  backdrop-filter: blur(6px);
}

.float-chip {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(16, 22, 18, 0.86);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.45);
  color: #c8d5cb;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  backdrop-filter: blur(10px);
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green-bright);
  box-shadow: 0 0 10px rgba(126, 231, 135, 0.8);
}

.chip-one {
  top: 19%;
  left: -30px;
  animation: float 6s ease-in-out infinite 0.6s;
}

.chip-two {
  right: -26px;
  bottom: 15%;
  animation: float 8s ease-in-out infinite 0.2s;
}

/* ---------- 技术栈标签条 ---------- */
.stack-strip {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 12px;
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px 70px;
  box-sizing: border-box;
}

.stack-strip span {
  padding: 6px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.025);
  color: #8fa095;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
}

/* ---------- 通用 Section ---------- */
.section {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 88px 24px;
  border-top: 1px solid var(--line);
  box-sizing: border-box;
  scroll-margin-top: 80px;
}

.section-head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 720px;
  margin-bottom: 42px;
}

.section-index {
  color: #5f9b63;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.section h2,
.cta-card h2 {
  margin: 0;
  color: #eef5f0;
  font-size: clamp(29px, 3.8vw, 42px);
  font-weight: 750;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.section-desc {
  margin: 0;
  color: var(--muted);
  font-size: 14.5px;
  line-height: 1.85;
}

.section-desc code,
.practice code {
  padding: 1px 6px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.04);
  color: #a9d9ad;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.92em;
}

/* ---------- 玩法卡片 ---------- */
.mode-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.mode-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.038), rgba(255, 255, 255, 0.012));
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.mode-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--accent);
  opacity: 0.85;
}

.mode-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.16);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.015));
}

.mode-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.mode-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 11px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
}

.mode-en {
  color: #56665b;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
}

.mode-card h3 {
  margin: 0 0 9px;
  color: #eaf2ec;
  font-size: 18px;
  font-weight: 650;
}

.mode-card p {
  flex: 1;
  margin: 0 0 22px;
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.8;
}

.mode-lock {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 5px 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: #7f8d83;
  font-size: 11px;
}

/* ---------- 技术卡片 ---------- */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.feature {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.024);
  transition: border-color 0.25s ease, background 0.25s ease;
}

.feature:hover {
  border-color: rgba(126, 231, 135, 0.22);
  background: rgba(126, 231, 135, 0.035);
}

.feature-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: 17px;
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 10px;
  background: rgba(76, 175, 80, 0.1);
  color: var(--green-bright);
}

.feature h3 {
  margin: 0 0 8px;
  color: #e6eee9;
  font-size: 15.5px;
  font-weight: 650;
}

.feature p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}

/* ---------- 预览 ---------- */
.preview-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 0.8fr;
  gap: 64px;
  align-items: start;
}

.preview-list {
  display: grid;
  gap: 14px;
  margin: 26px 0 0;
  padding: 0;
  list-style: none;
}

.preview-list li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: #c3cdc5;
  font-size: 13.5px;
  line-height: 1.65;
}

.check {
  flex: none;
  margin-top: 2px;
  color: var(--green-bright);
}

.shot-card {
  position: relative;
  margin: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: #101411;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.55);
}

.shot-chrome {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 14px;
  border-bottom: 1px solid var(--line);
}

.shot-url {
  margin-left: 8px;
  color: #6e7c72;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10.5px;
}

.shot-card img {
  display: block;
  width: 100%;
  height: auto;
}

.shot-card figcaption {
  padding: 12px 16px;
  border-top: 1px solid var(--line);
  color: #77857b;
  font-size: 11.5px;
  text-align: center;
}

/* ---------- 技术栈 ---------- */
.stack-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  gap: 48px;
  align-items: start;
}

.spec {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.02);
}

.spec-row {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 18px;
  padding: 15px 20px;
  border-bottom: 1px solid var(--line);
  font-size: 13.5px;
}

.spec-row:last-child {
  border-bottom: 0;
}

.spec-row span:first-child {
  color: #6f7f74;
}

.spec-row span:last-child {
  color: #d9e3dc;
}

.practices h3 {
  margin: 4px 0 18px;
  color: #e6eee9;
  font-size: 13px;
  font-weight: 650;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.practice {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 12px 0;
  border-top: 1px solid var(--line);
}

.practice-mark {
  color: #4f7c53;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10.5px;
  line-height: 1.9;
}

.practice p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.7;
}

/* ---------- 开源 CTA ---------- */
.cta {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px 96px;
  box-sizing: border-box;
  scroll-margin-top: 80px;
}

.cta-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 48px;
  border: 1px solid rgba(76, 175, 80, 0.24);
  border-radius: 22px;
  background:
    radial-gradient(620px 300px at 82% -10%, rgba(76, 175, 80, 0.2), transparent 70%),
    linear-gradient(180deg, #151d17, #101512);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.cta-copy {
  max-width: 620px;
}

.cta-card h2 {
  margin: 10px 0 14px;
}

.cta-copy p {
  margin: 0;
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.85;
}

.repo-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 20px;
}

.repo-link {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: #9be59f;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.6;
  overflow-wrap: anywhere;
  text-decoration: none;
  transition: color 0.2s ease;
}

.repo-link:hover {
  color: #c6f2c9;
  text-decoration: underline;
}

.repo-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 1px 6px;
  border: 1px solid rgba(126, 231, 135, 0.24);
  border-radius: 5px;
  background: rgba(126, 231, 135, 0.08);
  color: #9be59f;
  font-family: inherit;
  font-size: 11px;
  line-height: 1.5;
}

.cta-actions {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 12px;
  width: 180px;
}

.cta-actions .btn {
  width: 100%;
}

.cta-btn {
  flex: none;
}

/* ---------- 拦截提示 ---------- */
.locked-toast {
  position: fixed;
  bottom: 26px;
  left: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: calc(100vw - 40px);
  padding: 12px 14px 12px 18px;
  border: 1px solid rgba(255, 183, 77, 0.28);
  border-radius: 12px;
  background: rgba(28, 24, 17, 0.96);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
  color: #e3cfab;
  font-size: 13px;
  transform: translateX(-50%);
  backdrop-filter: blur(10px);
}

.locked-toast button {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbb894;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.locked-toast button:hover {
  background: rgba(255, 255, 255, 0.14);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

/* ---------- 动效 ---------- */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(126, 231, 135, 0.45);
  }
  70% {
    box-shadow: 0 0 0 7px rgba(126, 231, 135, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(126, 231, 135, 0);
  }
}

/* ---------- 响应式 ---------- */
@media (max-width: 980px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 54px;
    padding-top: 64px;
  }

  .hero-visual {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  }

  .nav {
    display: none;
  }

  .header-actions {
    margin-left: auto;
  }

  .cta-actions {
    width: 100%;
    max-width: 320px;
  }

  .mode-grid,
  .feature-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .preview-grid,
  .stack-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .preview-grid .shot-card {
    width: 100%;
    max-width: 380px;
    margin: 0 auto;
  }

  .cta-card {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 620px) {
  .header-inner {
    gap: 10px;
    padding: 0 18px;
  }

  .header-actions {
    gap: 8px;
  }

  .header-github span {
    display: none;
  }

  .header-github {
    width: 36px;
    padding: 0;
    justify-content: center;
  }

  .header-back {
    width: 36px;
    padding: 0;
    justify-content: center;
  }

  .header-back .back-text {
    display: none;
  }

  .cta-actions {
    width: 100%;
    max-width: none;
  }

  .hero,
  .section,
  .stack-strip,
  .cta {
    padding-left: 18px;
    padding-right: 18px;
  }

  .hero {
    padding-top: 52px;
    padding-bottom: 48px;
  }

  h1 {
    font-size: clamp(38px, 12.4vw, 54px);
    letter-spacing: -0.035em;
  }

  /* 装饰用浮动标签在窄屏会压住浏览器窗口，隐藏以免遮挡 */
  .float-chip {
    display: none;
  }

  .hero-stats {
    gap: 30px;
  }

  .mode-grid,
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .chip-one {
    top: -14px;
    left: 10px;
  }

  .chip-two {
    right: 8px;
    bottom: -14px;
  }

  .cta-card {
    padding: 30px 24px;
  }

  .section {
    padding-top: 66px;
    padding-bottom: 66px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .board-card,
  .float-chip,
  .pulse-dot {
    animation: none;
  }

  .mode-card,
  .btn,
  .feature {
    transition: none;
  }
}
</style>
