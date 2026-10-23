<template>
  <div class="app-container">
    <!-- 全局路由出口：根据当前 URL 渲染对应的页面组件 -->
    <router-view />
  </div>
</template>

<style>
/* ==========================================
   全局样式重置与基础配置
   ========================================== */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #121212; /* 全局暗黑主题背景 */
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/*
 * 核心布局容器
 * 使用 Flex 纵向布局，确保内容能撑满整个屏幕高度。
 * 防止内容较少时底部出现空白，或内容较多时破坏滚动体验。
 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ==========================================
   全局导航栏样式 (可选组件)
   ========================================== */
.navbar {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 15px;
  background: #1e1e1e;
  border-bottom: 2px solid #4caf50;
}

.navbar a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  transition: color 0.2s ease-in-out;
}

/* 当前激活的路由链接高亮显示 */
.navbar a.router-link-active {
  color: #4caf50;
}
</style>
