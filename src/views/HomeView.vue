<template>
  <div class="home-view">
    <h1>🐍 贪吃蛇大作战</h1>

    <div class="menu">
      <!-- 经典模式：直接跳转，无额外参数 -->
      <router-link to="/game" class="btn classic">🎮 经典模式</router-link>

      <!-- 每日挑战：通过按钮触发带参跳转 -->
      <button class="btn daily" @click="goDaily">📅 每日挑战</button>

      <!-- 排行榜：跳转至全局榜单页面 -->
      <router-link to="/leaderboard" class="btn leaderboard">🏆 查看排行榜</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * 跳转至每日挑战模式
 * 通过在 URL 中附加 `mode=daily` 查询参数，GameView 组件会据此切换逻辑与渲染状态。
 */
const goDaily = () => {
  router.push({ path: '/game', query: { mode: 'daily' } });
};
</script>

<style scoped>
/* ==========================================
   页面整体布局
   ========================================== */
.home-view {
  text-align: center;
  margin-top: 80px;
}

h1 {
  font-size: 40px;
  color: #4caf50;
  margin-bottom: 40px;
}

/* ==========================================
   菜单与按钮布局
   ========================================== */
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
  border: none;
  cursor: pointer;
  /* 悬停时的缩放过渡动画 */
  transition: transform 0.2s ease-in-out;
}

.btn:hover {
  transform: scale(1.05);
}

/* ==========================================
   按钮主题色
   ========================================== */
.classic {
  background: #4caf50; /* 经典模式：绿色 */
}

.leaderboard {
  background: #2196f3; /* 排行榜：蓝色 */
}

.daily {
  background: #ff9800; /* 每日挑战：橙色 */
}
</style>
