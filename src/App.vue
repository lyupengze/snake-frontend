<template>
  <div class="app-container">
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
  overflow-x: hidden;
  overflow-y: auto;
}

/* min-height 允许内容超出视口时自然滚动，而非截断 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
}

.app-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
