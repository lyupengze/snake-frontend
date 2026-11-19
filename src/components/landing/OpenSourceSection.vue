<script setup lang="ts">
import { SITE } from '../../config/site';
</script>

<template>
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
</template>
