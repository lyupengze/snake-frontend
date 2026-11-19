<script setup lang="ts">
import SectionHeading from './SectionHeading.vue';

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
</script>

<template>
  <SectionHeading index="01 — Gameplay" title="三种玩法，同一套引擎">
    规则不同，底层共用 SnakeEngine 与 Renderer。模式切换只改变边界策略与随机种子，
    节奏、手感与判分逻辑始终保持一致。
  </SectionHeading>

  <div class="mode-grid">
    <article
      v-for="mode in modes"
      :key="mode.name"
      class="mode-card"
      :style="{ '--accent': mode.accent }"
    >
      <div class="mode-top">
        <span class="mode-icon">
          <svg
            v-if="mode.icon === 'classic'"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
          </svg>
          <svg
            v-else-if="mode.icon === 'daily'"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M8 3v4M16 3v4M3 10h18" />
            <path d="M8 14h2M14 14h2M8 18h2M14 18h2" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" stroke-dasharray="4 3" />
            <path d="M8 12h8M13 9l3 3-3 3" />
          </svg>
        </span>
        <span class="mode-en">{{ mode.en }}</span>
      </div>
      <h3>{{ mode.name }}</h3>
      <p>{{ mode.desc }}</p>
      <span class="mode-lock">
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        展示模式 · 暂未开放
      </span>
    </article>
  </div>
</template>
