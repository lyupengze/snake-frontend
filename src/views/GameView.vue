<template>
  <div class="game-view">
    <h2 class="score-board">
      {{ isDailyMode ? '📅 每日挑战' : '🎮 经典模式' }} - 得分: {{ score }}
    </h2>

    <div class="canvas-wrapper">
      <canvas ref="canvasRef" width="400" height="400" class="game-canvas"></canvas>

      <!-- 状态 1：待开始 -->
      <div v-if="gameStatus === 'idle'" class="overlay">
        <h2>准备开始</h2>
        <button class="action-btn" @click="handleStart">
          {{ isDailyMode ? '开始每日挑战' : '开始游戏' }}
        </button>
      </div>

      <!-- 状态 2：游戏结束 -->
      <div v-if="gameStatus === 'gameover'" class="overlay">
        <h2>💀 游戏结束</h2>
        <p class="final-score">最终得分: {{ score }}</p>
        <input v-model="playerName" placeholder="输入你的名字" maxlength="10" />

        <!-- 【核心修改】加上 :disabled="isSubmitting" -->
        <button class="action-btn" @click="saveScore" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交排行榜' }}
        </button>
      </div>
    </div>
    <router-link to="/" class="back-link">⬅️ 返回主页</router-link>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'; // 去掉了 onMounted
import { useRouter, useRoute } from 'vue-router';
import { useSnakeGame } from '../composables/useSnakeGame';

const router = useRouter();
const route = useRoute();
const canvasRef = ref(null);
const playerName = ref('');
const isSubmitting = ref(false);

// 判断 URL 里是否有 mode=daily
const isDailyMode = route.query.mode === 'daily';

const { score, gameStatus, startGame, startDailyChallenge, stopGame, submitScore } = useSnakeGame();

// 根据模式调用不同的启动函数
const handleStart = async () => {
  if (!canvasRef.value) return;
  if (isDailyMode) {
    await startDailyChallenge(canvasRef.value);
  } else {
    await startGame(canvasRef.value);
  }
};

const saveScore = async () => {
  if (!playerName.value) return alert('请输入名字');
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const success = await submitScore(playerName.value);
  if (success) {
    router.push('/leaderboard');
  } else {
    alert('提交失败！');
    isSubmitting.value = false;
  }
};

onUnmounted(() => stopGame());
</script>

<style scoped>
.game-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px; /* 减小顶部间距 */
  min-height: 100vh;
  box-sizing: border-box;
}

.score-board {
  color: #4caf50;
  font-size: 22px;
  margin-top: 0;
  margin-bottom: 15px;
}

.canvas-wrapper {
  position: relative;
  /* 让 wrapper 也自适应，保证遮罩层能覆盖全画布 */
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
}

.game-canvas {
  border: 2px solid #555;
  background-color: #000;
  display: block;
  touch-action: none;
  /* 核心自适应逻辑 */
  width: 100%;
  max-width: 400px;
  height: auto;
  aspect-ratio: 1 / 1; /* 强制保持正方形 */
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
  border-radius: 4px; /* 如果画布有圆角，遮罩也跟上 */
}

.action-btn {
  padding: 12px 28px; /* 手机端按钮稍微大一点点，更好点 */
  font-size: 18px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

/* 针对小屏幕（手机）的微调 */
@media (max-width: 480px) {
  .score-board {
    font-size: 18px; /* 字体稍微小一点 */
    margin-bottom: 10px;
  }
  .game-view {
    padding-top: 10px;
  }
}
</style>
