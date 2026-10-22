<template>
  <div class="game-view">
    <h2 class="score-board">得分: {{ score }}</h2>
    <div class="canvas-wrapper">
      <canvas ref="canvasRef" width="400" height="400" class="game-canvas"></canvas>

      <div v-if="gameStatus === 'idle'" class="overlay">
        <h2>准备开始</h2>
        <button class="action-btn" @click="handleStart">开始游戏</button>
      </div>

      <div v-if="gameStatus === 'gameover'" class="overlay">
        <h2>💀 游戏结束</h2>
        <p class="final-score">最终得分: {{ score }}</p>
        <input v-model="playerName" placeholder="输入你的名字" maxlength="10" />
        <button class="action-btn" @click="saveScore" :disabled="isSubmitting">
          {{ isSubmitting ? '提交中...' : '提交排行榜' }}
        </button>
      </div>
    </div>
    <router-link to="/" class="back-link">⬅️ 返回主页</router-link>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSnakeGame } from '../composables/useSnakeGame';

const router = useRouter();
const canvasRef = ref(null);
const playerName = ref('');
const isSubmitting = ref(false);

const { score, gameStatus, startGame, stopGame, submitScore } = useSnakeGame();

const handleStart = async () => {
  if (canvasRef.value) await startGame(canvasRef.value);
};

const saveScore = async () => {
  if (!playerName.value) return alert('请输入名字');
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  const success = await submitScore(playerName.value);

  if (success) {
    // 提交成功后直接跳转到排行榜页面
    router.push('/leaderboard');
  } else {
    alert('提交失败，可能触发了反作弊！');
    isSubmitting.value = false;
  }
};

onUnmounted(() => stopGame());
</script>

<style scoped>
.game-view {
  text-align: center;
  margin-top: 30px;
}
.score-board {
  color: #4caf50;
  font-size: 24px;
}
.canvas-wrapper {
  position: relative;
  display: inline-block;
  margin-top: 10px;
}
.game-canvas {
  border: 2px solid #555;
  background-color: #000;
  display: block;
  touch-action: none;
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
}
.action-btn {
  padding: 10px 24px;
  font-size: 18px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.overlay input {
  padding: 8px 12px;
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
.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #888;
  text-decoration: none;
}
</style>
