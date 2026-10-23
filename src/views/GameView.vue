<template>
  <div class="game-view">
    <div class="header">
      <h2 class="score-board">
        {{ isDailyMode ? '📅 每日挑战' : '🎮 经典模式' }} - 得分: {{ score }}
      </h2>
      <!-- 静音开关 -->
      <button class="mute-btn" @click="toggleMute">
        {{ isMuted ? '🔇' : '🔊' }}
      </button>
    </div>

    <div class="canvas-wrapper">
      <canvas ref="canvasRef" width="400" height="400" class="game-canvas"></canvas>

      <!-- 状态 1：等待开始 -->
      <div v-if="gameStatus === 'idle'" class="overlay">
        <h2>准备开始</h2>
        <button class="action-btn" @click="handleStart">
          {{ isDailyMode ? '开始每日挑战' : '开始游戏' }}
        </button>
      </div>

      <!-- 状态 2：游戏结束，展示结算与提交表单 -->
      <div v-if="gameStatus === 'gameover'" class="overlay">
        <h2>💀 游戏结束</h2>
        <p class="final-score">最终得分: {{ score }}</p>
        <input v-model="playerName" placeholder="输入你的名字" maxlength="20" />

        <!-- 提交按钮：通过 isSubmitting 控制防止用户双击重复提交 -->
        <button class="action-btn" @click="saveScore" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交排行榜' }}
        </button>
      </div>
    </div>

    <router-link to="/" class="back-link">⬅️ 返回主页</router-link>

    <!-- 引入全局轻提示组件 -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSnakeGame } from '../composables/useSnakeGame';
import Toast from '../components/Toast.vue'; // 引入 Toast 组件
import { audioManager } from '../utils/audio'; // 引入音频管理器

const router = useRouter();
const route = useRoute();
const canvasRef = ref(null);
const playerName = ref('');
const isSubmitting = ref(false);
const toastRef = ref(null); // 绑定 Toast 组件引用
const isMuted = ref(audioManager.isMuted);

const isDailyMode = computed(() => route.query.mode === 'daily');
const { score, gameStatus, startGame, stopGame, submitScore } = useSnakeGame();

// 切换静音
const toggleMute = () => {
  isMuted.value = audioManager.toggleMute();
};

/**
 * 启动游戏
 */
const handleStart = async () => {
  if (canvasRef.value) {
    const result = await startGame(canvasRef.value, isDailyMode.value ? 'daily' : 'classic');

    // 如果启动失败，用 Toast 提示玩家
    if (!result.success) {
      toastRef.value?.show(result.message);
    }
  }
};

/**
 * 保存并提交分数（含详细的状态码处理与 UI 提示）
 */
const saveScore = async () => {
  // [校验] 前置表单校验，使用 Toast 替代原生 alert
  if (!playerName.value) {
    return toastRef.value?.show('请输入名字');
  }
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  // 调用 Composable 层提交，获取包含状态码的结果
  const result = await submitScore(playerName.value);

  if (result.success) {
    toastRef.value?.show('🎉 提交成功！');

    // [UX 优化] 延迟 800ms 跳转，给玩家时间看完“提交成功”的提示
    setTimeout(() => {
      router.push({
        path: '/leaderboard',
        query: { mode: isDailyMode.value ? 'daily' : 'classic' },
      });
    }, 800);
  } else {
    // [异常处理] 提交失败，恢复按钮可点击状态，并根据后端返回的 HTTP 状态码给出精确提示
    isSubmitting.value = false;

    if (result.status === 403) {
      toastRef.value?.show('❌ 校验未通过（疑似作弊或会话过期）');
    } else if (result.status === 413) {
      toastRef.value?.show('⏱️ 游戏时间过长，未能上榜');
    } else if (result.status === 400) {
      toastRef.value?.show('⚠️ 提交的数据不合法');
    } else {
      toastRef.value?.show('📡 网络连接失败，请检查网络后重试');
    }
  }
};

// 组件卸载时确保停止游戏循环并释放资源
onUnmounted(() => stopGame());
</script>

<style scoped>
/* ==========================================
   页面主容器
   ========================================== */
.game-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
  position: relative;
}

.score-board {
  color: #4caf50;
  font-size: 22px;
  margin: 0; /* 覆盖原本的 margin */
}

.mute-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  opacity: 0.8;
  transition: transform 0.2s;
}

.mute-btn:hover {
  transform: scale(1.1);
  opacity: 1;
}

/* ==========================================
   画布与遮罩层
   ========================================== */
.canvas-wrapper {
  position: relative;
  /* 容器宽度自适应，确保遮罩层能与画布完美对齐 */
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
}

.game-canvas {
  border: 2px solid #555;
  background-color: #000;
  display: block;
  /* 禁用移动端默认触摸行为（如滚动、缩放），保证手势顺滑 */
  touch-action: none;

  /* 响应式自适应逻辑 */
  width: 100%;
  max-width: 400px;
  height: auto;
  aspect-ratio: 1 / 1; /* 强制保持 1:1 正方形 */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  border-radius: 4px;
}

/* ==========================================
   交互控件
   ========================================== */
.action-btn {
  padding: 12px 28px;
  font-size: 18px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.overlay input {
  padding: 10px 14px;
  border-radius: 5px;
  border: 1px solid #555;
  background: #222;
  color: white;
  outline: none;
  width: 70%;
  max-width: 200px;
}

.final-score {
  font-size: 20px;
  color: #ff9800;
  margin: 0;
}

.back-link {
  display: inline-block;
  margin-top: 25px;
  color: #888;
  text-decoration: none;
  padding: 10px;
}

/* ==========================================
   移动端屏幕适配
   ========================================== */
@media (max-width: 480px) {
  .score-board {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .game-view {
    padding-top: 10px;
  }
  .action-btn {
    padding: 14px 32px; /* 移动端增大触控区域 */
  }
}
</style>
