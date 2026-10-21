<template>
  <div class="leaderboard-panel">
    <h3>🏆 排行榜 TOP 10</h3>
    <ul class="rank-list">
      <li v-for="(item, index) in list" :key="index">
        <span class="rank-num">{{ index + 1 }}</span>
        <span class="rank-name">{{ item.playerName }}</span>
        <span class="rank-score">{{ item.score }} 分</span>
      </li>
      <li v-if="list.length === 0" class="empty">暂无记录，快来霸榜！</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const list = ref([]);

const API_BASE = '';

// 提取成独立函数，方便后面主动刷新
const fetchLeaderboard = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/leaderboard`);
    const json = await res.json();
    // 【修复】如果 json 是 null，或者没有 data 字段，就直接给空数组
    if (json && json.data) {
      list.value = json.data;
    } else {
      list.value = [];
    }
  } catch (e) {
    console.error('获取排行榜失败', e);
    list.value = []; // 报错时也清空列表
  }
};

// 暴露出 fetch 方法，父组件可以主动调用刷新
defineExpose({ fetchLeaderboard });

onMounted(() => {
  fetchLeaderboard();
});
</script>

<style scoped>
/* 利用 scoped 保证样式不泄漏 */
.leaderboard-panel {
  background: #1e1e1e;
  border: 2px solid #555;
  border-radius: 8px;
  padding: 20px;
  width: 250px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  text-align: left;
}
h3 {
  margin-top: 0;
  color: #4caf50;
  text-align: center;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
}
.rank-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.rank-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #333;
  font-size: 14px;
}
.rank-num {
  color: #888;
  width: 20px;
}
.rank-name {
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.rank-score {
  color: #4caf50;
  font-weight: bold;
}
.empty {
  text-align: center;
  color: #888;
  font-style: italic;
  border: none !important;
}
</style>
