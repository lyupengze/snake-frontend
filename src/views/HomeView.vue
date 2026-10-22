<template>
  <div class="home-view">
    <h1>🐍 贪吃蛇大作战</h1>
    <div class="menu">
      <router-link to="/game" class="btn classic">🎮 经典模式</router-link>
      <router-link to="/leaderboard" class="btn leaderboard">🏆 查看排行榜</router-link>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  text-align: center;
  margin-top: 80px;
}
h1 {
  font-size: 40px;
  color: #4caf50;
  margin-bottom: 40px;
}
.menu {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.btn {
  width: 200px;
  padding: 15px 0;
  font-size: 20px;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  transition: transform 0.2s;
}
.btn:hover {
  transform: scale(1.05);
}
.classic {
  background: #4caf50;
}
.leaderboard {
  background: #2196f3;
}
</style>
