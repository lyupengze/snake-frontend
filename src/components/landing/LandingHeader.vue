<script setup lang="ts">
import { SITE } from '../../config/site';
import { isNative } from '../../utils/runtime';

const navItems = [
  { href: '#play', label: '玩法' },
  { href: '#tech', label: '技术亮点' },
  { href: '#preview', label: '界面预览' },
  { href: '#stack', label: '技术栈' },
  { href: '#opensource', label: '开源' },
];
</script>

<template>
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
</template>
