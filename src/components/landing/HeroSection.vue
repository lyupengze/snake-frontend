<script setup lang="ts">
import { SITE } from '../../config/site';
import HeroBoard from './HeroBoard.vue';
</script>

<template>
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
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
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
          <a
            class="btn btn-primary"
            :href="SITE.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
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

    <HeroBoard />
  </section>
</template>
