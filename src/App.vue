<template>
  <div class="main-layout">
    <!-- 左侧游戏区 -->
    <div class="game-container">
      <h1>贪吃蛇</h1>
      <h2 class="score-board">得分: {{ score }}</h2>

      <div class="canvas-wrapper">
        <canvas ref="canvasRef" width="400" height="400" class="game-canvas"></canvas>

        <!-- 状态 1：待开始 -->
        <div v-if="gameStatus === 'idle'" class="overlay">
          <h2>准备开始</h2>
          <button class="action-btn" @click="handleStart">开始游戏</button>
        </div>

        <!-- 状态 2：游戏结束 -->
        <div v-if="gameStatus === 'gameover'" class="overlay">
          <h2>💀 游戏结束</h2>
          <p class="final-score">最终得分: {{ score }}</p>
          <input v-model="playerName" placeholder="输入你的名字" maxlength="10" />
          <button class="action-btn" @click="saveScore" :disabled="isSubmitting">
            {{ isSubmitting ? '提交中...' : '提交排行榜' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 右侧排行榜 -->
    <Leaderboard ref="leaderboardRef" />
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useSnakeGame } from './composables/useSnakeGame';
import Leaderboard from './components/Leaderboard.vue';

const canvasRef = ref(null);
const leaderboardRef = ref(null);
const playerName = ref('');

// 从 useSnakeGame 获取状态和方法
// 注意：这里解构出了 gameStatus，因为后面提交成功后要重置它
const { score, gameStatus, startGame, stopGame, submitScore } = useSnakeGame();

// 开始游戏（不再需要传 ctx）
const handleStart = async () => {
  if (canvasRef.value) {
    await startGame(canvasRef.value);
  }
};

// 提交分数
const isSubmitting = ref(false); // 防止重复提交

const saveScore = async () => {
  if (!playerName.value) {
    alert('请输入名字');
    return;
  }
  if (isSubmitting.value) return; // 如果正在提交，直接拦截

  isSubmitting.value = true; // 锁住

  const success = await submitScore(playerName.value);

  if (success) {
    // 提交成功，刷新排行榜
    if (leaderboardRef.value) {
      leaderboardRef.value.fetchLeaderboard();
    }
    playerName.value = '';
    isSubmitting.value = false;

    // 优雅地回到“待开始”状态，代替粗暴的 window.location.reload()
    gameStatus.value = 'idle';
  } else {
    alert('提交失败，可能触发了反作弊！请重试。');
    isSubmitting.value = false; // 如果失败，解锁，允许重试
  }
};

onUnmounted(() => {
  stopGame();
});
</script>

<style>
/* 全局基础样式 */
body {
  margin: 0;
  background-color: #121212;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: sans-serif;
}

/* 布局 */
.main-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  padding: 20px;
  box-sizing: border-box;
}

/* 游戏区 */
.game-container {
  text-align: center;
}
.score-board {
  color: #4caf50;
  margin-bottom: 15px;
  font-size: 24px;
}
.canvas-wrapper {
  position: relative;
  display: inline-block;
}
.game-canvas {
  border: 2px solid #555;
  background-color: #000;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.2);
  display: block;
  touch-action: none; /* 阻止手机滑动屏幕时的默认滚动 */
}

/* 遮罩层 */
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
}
.action-btn {
  padding: 10px 24px;
  font-size: 18px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}
.action-btn:hover {
  background-color: #388e3c;
}
.action-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
}
.overlay input {
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #555;
  background: #222;
  color: white;
  outline: none;
}
.final-score {
  font-size: 20px;
  color: #ff9800;
}

/* 移动端适配 (屏幕宽度小于 768px 时生效) */
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 10px;
  }

  h1 {
    font-size: 24px;
    margin: 10px 0;
  }

  .score-board {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .game-canvas {
    width: 100%;
    max-width: 400px;
    height: auto;
    aspect-ratio: 1 / 1;
  }

  .leaderboard-panel {
    width: 100%;
    max-width: 400px;
  }
}
</style>
