<template>
  <div class="leaderboard-view">
    <h1>🏆 排行榜</h1>
    <Leaderboard />
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
  align-items: center;
  margin-top: 40px;
}
h1 {
  color: #4caf50;
}
.back-link {
  margin-top: 30px;
  color: #888;
  text-decoration: none;
}
</style>
