<template>
  <div class="home-view">
    <h1>🐍 贪吃蛇大作战</h1>

    <div class="menu">
      <router-link to="/game" class="btn classic">🎮 经典模式</router-link>
      <button class="btn daily" @click="goDaily">📅 每日挑战</button>
      <button class="btn wrap" @click="goWrap">🌀 穿墙模式</button>
      <router-link to="/leaderboard" class="btn leaderboard">🏆 查看排行榜</router-link>
    </div>

    <!-- 更新日志与下载面板 -->
    <div class="web-extras">
      <!-- 下载链接：仅在 Web 端显示 -->
      <div v-if="!env?.isNative" class="download-section">
        <div class="divider">—— 客户端下载 ——</div>
        <div class="download-links">
          <!-- 安卓版 -->
          <a href="/downloads/snake-battle-latest.apk" target="_blank" class="download-btn android">
            🤖 下载安卓版 (APK)
          </a>

          <!-- 桌面版 -->
          <a href="/downloads/snake-battle-latest.msi" target="_blank" class="download-btn windows">
            💻 下载桌面版 (Windows)
          </a>
        </div>
      </div>

      <!-- 动态更新日志：Web 和原生端都显示 -->
      <div class="changelog" v-if="changelog">
        <div class="divider">—— 最新动态 ——</div>
        <div class="changelog-box">
          <h3>🚀 {{ changelog.version }} ({{ changelog.date }})</h3>
          <ul>
            <li v-for="(item, index) in changelog.changes" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { request, env } from '../utils/api'; // 引入 request 和 env

const router = useRouter();
const changelog = ref(null); // 存储动态获取的更新日志

const goDaily = () => {
  router.push({ path: '/game', query: { mode: 'daily' } });
};

const goWrap = () => {
  router.push({ path: '/game', query: { mode: 'wrap' } });
};

// 页面挂载时，动态拉取服务器上的 changelog.json
onMounted(async () => {
  try {
    let res;
    if (env.isNative) {
      // 原生端没有域名上下文，必须走 API_BASE 拼出绝对路径
      res = await request('/changelog.json');
    } else {
      // Web 端（本地和线上）直接走同源相对路径，由 Vite/Nginx 处理静态文件
      res = await fetch('/changelog.json');
    }

    if (res.ok) {
      changelog.value = await res.json();
    }
  } catch (err) {
    console.error('获取更新日志失败', err);
  }
});
</script>

<style scoped>
/* ... 原有的样式保持不变 ... */
.home-view {
  text-align: center;
  margin-top: 60px;
  padding-bottom: 40px;
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
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
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
.daily {
  background: #ff9800;
}
.wrap {
  background: #9c27b0;
}

/* ==========================================
   扩展面板样式 (下载 + 更新日志)
   ========================================== */
.web-extras {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.divider {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  margin-top: 10px;
}

/* 下载区域 */
.download-links {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.download-btn {
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  color: white;
  font-size: 14px;
  font-weight: bold;
  transition: opacity 0.2s;
}

.download-btn:hover {
  opacity: 0.8;
}
.android {
  background: #a4c639;
  color: #333;
}
.windows {
  background: #0078d7;
}

/* 更新日志 */
.changelog-box {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  width: 320px;
  text-align: left;
  color: #ccc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.changelog-box h3 {
  margin-top: 0;
  color: #4caf50;
  font-size: 16px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.changelog-box ul {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.6;
}
</style>
