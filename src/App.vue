<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
/* 彻底重置默认的浏览器边距 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #121212;
  color: white;
  font-family: sans-serif;
}

/* 核心：把页面变成一个从上到下的正常滚动流，取消以前的强制垂直居中 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 全局的导航栏样式（如果你之前加了的话） */
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
}
.navbar a.router-link-active {
  color: #4caf50;
}
</style>
