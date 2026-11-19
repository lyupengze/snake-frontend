<script setup lang="ts">
import SectionHeading from './SectionHeading.vue';

const stackRows = [
  { layer: '框架', value: 'Vue 3 + TypeScript + Vite' },
  { layer: '路由', value: 'Vue Router（HTML5 History）' },
  { layer: '桌面端', value: 'Tauri 2（Rust）' },
  { layer: '移动端', value: 'Capacitor（Android）' },
  { layer: '渲染', value: 'Canvas 2D' },
  { layer: '音频', value: 'Web Audio API（合成音效）' },
];
</script>

<template>
  <SectionHeading index="04 — Stack" title="从像素到网络层">
    同一份 <code>src/</code> 代码，构建出 Web 静态站点、Windows 桌面端与 Android 安装包。
  </SectionHeading>

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
</template>
