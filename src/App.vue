<script setup lang="ts">
import { SITE } from './config/site';

const year = new Date().getFullYear();
</script>

<template>
  <div class="app-container">
    <router-view />

    <!-- 全站统一页脚：ICP 备案号必须出现在每一个页面底部 -->
    <footer class="site-footer">
      <div class="site-footer-inner">
        <div class="site-footer-meta">
          <span class="site-footer-brand">🐍 SnakeBattle</span>
          <span class="site-footer-sep" aria-hidden="true">/</span>
          <span>个人全栈技术学习与展示项目</span>
          <span class="site-footer-sep" aria-hidden="true">/</span>
          <span>© {{ year }}</span>
        </div>

        <div class="site-footer-links">
          <a :href="SITE.githubUrl" target="_blank" rel="noopener noreferrer">前端源码</a>
          <span class="site-footer-sep" aria-hidden="true">/</span>
          <a :href="SITE.backendGithubUrl" target="_blank" rel="noopener noreferrer">后端源码</a>
          <span class="site-footer-sep" aria-hidden="true">/</span>
          <a :href="SITE.icpUrl" class="site-footer-icp" target="_blank" rel="noopener noreferrer">
            {{ SITE.icpNumber }}
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background-color: #121212;
  color: white;
  font-family: sans-serif;
  /* clip 不会把 body 变成滚动容器，页面仍由文档本身滚动 */
  overflow-x: clip;
}

/* min-height 允许内容超出视口时自然滚动，而非截断 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: clip;
  width: 100%;
}

.app-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ---------- 全站页脚 ---------- */
.site-footer {
  width: 100%;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(10, 12, 11, 0.6);
}

.site-footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 28px;
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 22px 24px;
  box-sizing: border-box;
}

.site-footer-meta,
.site-footer-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  color: #7d8b81;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei',
    sans-serif;
  font-size: 12px;
  line-height: 1.7;
}

.site-footer-brand {
  color: #9fb3a4;
  font-weight: 600;
}

.site-footer-sep {
  color: #3d4a41;
}

.site-footer-links a {
  color: #7f8f84;
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-footer-links a:hover {
  color: #7ee787;
}

.site-footer-icp {
  color: #a7b6ab !important;
}

.site-footer-icp:hover {
  color: #d3e0d6 !important;
  text-decoration: underline;
}

@media (max-width: 620px) {
  .site-footer-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 18px;
  }
}
</style>
