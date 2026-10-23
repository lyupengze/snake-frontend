<template>
  <div class="leaderboard-view">
    <h1>🏆 全球排行榜</h1>

    <div class="leaderboard-wrapper">
      <!-- 渲染核心榜单组件，并将解析出的 mode 传给它 -->
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

/**
 * 从 URL 查询参数中解析榜单模式。
 * 若未传参或参数非法，则默认展示经典模式 (classic) 排行榜。
 */
const initialMode = computed(() => route.query.mode || 'classic');
</script>

<style scoped>
/* ==========================================
   页面主容器
   ========================================== */
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

/* ==========================================
   内容区域限制
   ========================================== */
/* 限制最大宽度，防止在桌面端大屏幕上榜单被横向拉伸过长 */
.leaderboard-wrapper {
  width: 100%;
  max-width: 500px;
}

/* ==========================================
   返回链接
   ========================================== */
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
