<script setup lang="ts">
import SectionHeading from './SectionHeading.vue';

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
</script>

<template>
  <SectionHeading index="02 — Engineering" title="为「公平」和「手感」写的代码">
    从纯逻辑引擎到比特级回放校验，这个项目把「能玩」之外的部分也完整做了一遍。
  </SectionHeading>

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
</template>
