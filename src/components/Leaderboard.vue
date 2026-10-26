<template>
  <div class="leaderboard-panel">
    <div class="tabs">
      <button :class="{ active: currentMode === 'classic' }" @click="switchMode('classic')">
        🏆 经典榜
      </button>
      <button :class="{ active: currentMode === 'daily' }" @click="switchMode('daily')">
        📅 每日榜
      </button>
      <button :class="{ active: currentMode === 'wrap' }" @click="switchMode('wrap')">
        🌀 穿墙榜
      </button>
    </div>

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
import { request } from '../utils/api';

const props = defineProps({
  initialMode: {
    type: String,
    default: 'classic',
  },
});

const list = ref([]);
const currentMode = ref(props.initialMode);

const fetchLeaderboard = async () => {
  try {
    const safeMode = currentMode.value || 'classic';
    const res = await request(`/api/leaderboard?mode=${safeMode}`);
    const json = await res.json();
    list.value = json.data || [];
  } catch (e) {
    console.error('获取排行榜失败', e);
    list.value = [];
  }
};

const switchMode = (mode) => {
  if (currentMode.value === mode) return;
  currentMode.value = mode;
  fetchLeaderboard();
};

defineExpose({ fetchLeaderboard });

onMounted(fetchLeaderboard);
</script>

<style scoped>
.leaderboard-panel {
  background: #1e1e1e;
  border: 2px solid #555;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  background: #333;
  color: #888;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease-in-out;
}

.tabs button.active {
  background: #4caf50;
  color: white;
  font-weight: bold;
}

.rank-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rank-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #444;
  font-size: 16px;
}

.rank-num { color: #888; width: 30px; }

.rank-name {
  flex: 1;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.rank-score { color: #4caf50; font-weight: bold; }

.empty {
  text-align: center;
  color: #888;
  font-style: italic;
  border: none !important;
  margin-top: 20px;
}
</style>
