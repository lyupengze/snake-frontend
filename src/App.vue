<template>
  <div class="app-container">
    <!-- 全局路由出口：根据当前 URL 渲染对应的页面组件 -->
    <router-view />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #121212;
  color: white;
  font-family: sans-serif;
  /* 删掉 overflow: hidden，允许正常滚动 */
}

/* [关键] 使用 min-height 而不是 height */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 下面原有的 .navbar 等样式保持不变... */
</style>
