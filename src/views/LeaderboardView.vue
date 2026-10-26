<template>
  <div class="leaderboard-view">
    <h1>🏆 全球排行榜</h1>

    <div class="leaderboard-wrapper">
      <Leaderboard :initialMode="initialMode" />
    </div>

    <router-link to="/" class="back-link">⬅️ 返回主页</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Leaderboard from '../components/Leaderboard.vue';

const route = useRoute();

// 从 URL 查询参数解析榜单模式，默认经典模式
const initialMode = computed(() => route.query.mode || 'classic');
</script>

<style scoped>
.leaderboard-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 100vh;
  box-sizing: border-box;
}

h1 {
  color: #4caf50;
  margin-bottom: 30px;
  font-size: 32px;
}

/* 限制最大宽度，防止大屏横向拉伸 */
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

.back-link:hover { color: #4caf50; }
</style>
