<template>
  <div class="leaderboard-panel">
    <!-- 模式切换 Tab -->
    <div class="tabs">
      <button :class="{ active: currentMode === 'classic' }" @click="switchMode('classic')">
        🏆 经典榜
      </button>
      <button :class="{ active: currentMode === 'daily' }" @click="switchMode('daily')">
        📅 每日榜
      </button>
      <!-- [新增] 穿墙榜 -->
      <button :class="{ active: currentMode === 'wrap' }" @click="switchMode('wrap')">
        🌀 穿墙榜
      </button>
    </div>

    <!-- 排行榜列表 -->
    <ul class="rank-list">
      <li v-for="(item, index) in list" :key="index">
        <span class="rank-num">{{ index + 1 }}</span>
        <span class="rank-name">{{ item.playerName }}</span>
        <span class="rank-score">{{ item.score }} 分</span>
      </li>

      <!-- 空状态提示 -->
      <li v-if="list.length === 0" class="empty">暂无记录，快来霸榜！</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { request } from '../utils/api';

// 接收父组件传入的初始模式
const props = defineProps({
  initialMode: {
    type: String,
    default: 'classic',
  },
});

// 组件内部状态
const list = ref([]); // 排行榜数据列表
const currentMode = ref(props.initialMode); // 当前选中的榜单模式

/**
 * 获取排行榜数据
 * 根据当前 currentMode 向后端发起请求，并更新 list 数据。
 */
const fetchLeaderboard = async () => {
  try {
    const res = await request(`/api/leaderboard?mode=${currentMode.value}`);
    const json = await res.json();
    // 如果后端没返回 data，则兜底为空数组
    list.value = json.data || [];
  } catch (e) {
    console.error('获取排行榜失败', e);
    list.value = [];
  }
};

/**
 * 切换榜单模式（经典 / 每日）
 * @param {string} mode 'classic' | 'daily'
 */
const switchMode = (mode) => {
  if (currentMode.value === mode) return; // 避免重复点击同一个 Tab
  currentMode.value = mode;
  fetchLeaderboard();
};

// 暴露方法给父组件，允许外部触发刷新（可选）
defineExpose({ fetchLeaderboard });

// 组件挂载时立即请求一次数据
onMounted(fetchLeaderboard);
</script>

<style scoped>
/* ==========================================
   面板主容器
   ========================================== */
.leaderboard-panel {
  background: #1e1e1e;
  border: 2px solid #555;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  /* 确保 padding 不会撑大盒子的实际宽度，保持 100% 自适应 */
  box-sizing: border-box;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

/* ==========================================
   模式切换 Tabs
   ========================================== */
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

/* ==========================================
   排行榜列表
   ========================================== */
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

.rank-num {
  color: #888;
  width: 30px;
}

/* 玩家昵称：超出长度显示省略号 */
.rank-name {
  flex: 1;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.rank-score {
  color: #4caf50;
  font-weight: bold;
}

/* ==========================================
   空状态提示
   ========================================== */
.empty {
  text-align: center;
  color: #888;
  font-style: italic;
  border: none !important; /* 覆盖全局的虚线底边框 */
  margin-top: 20px;
}
</style>
