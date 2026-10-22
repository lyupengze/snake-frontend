<template>
  <div class="leaderboard-view">
    <h1>🏆 全球排行榜</h1>
    <div class="leaderboard-wrapper">
      <Leaderboard />
    </div>
    <router-link to="/" class="back-link">⬅️ 返回主页</router-link>
  </div>
</template>

<script setup>
import Leaderboard from '../components/Leaderboard.vue';
</script>

<style scoped>
.leaderboard-view {
  display: flex;
  flex-direction: column;
  align-items: center; /* 让里面的东西全部水平居中 */
  padding: 40px 20px;
  min-height: 100vh;
  box-sizing: border-box;
}

h1 {
  color: #4caf50;
  margin-bottom: 30px;
  font-size: 32px;
}

/* 给排行榜一个最大宽度，防止在电脑上被拉得太宽 */
.leaderboard-wrapper {
  width: 100%;
  max-width: 500px;
}

.back-link {
  margin-top: 40px;
  color: #aaa;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.2s;
}

.back-link:hover {
  color: #4caf50;
}
</style>
