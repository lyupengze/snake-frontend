<template>
  <div class="game-view">
    <div class="header">
      <h2 class="score-board">🤖 AI 寻路演示 - 得分: {{ score }}</h2>
      <div class="speed-controls">
        <button class="speed-btn" :class="{ active: speedMultiplier !== 1 }" @click="cycleSpeed">
          {{ speedMultiplier }}x
        </button>
        <button class="mute-btn" @click="toggleMute">
          {{ isMuted ? '🔇' : '🔊' }}
        </button>
      </div>
    </div>

    <div class="canvas-wrapper">
      <canvas ref="canvasRef" width="400" height="400" class="game-canvas"></canvas>

      <div v-if="gameStatus === 'idle'" class="overlay">
        <h2>准备演示</h2>
        <button class="action-btn" @click="startAiGame">开始演示</button>
      </div>

      <div v-if="gameStatus === 'gameover'" class="overlay">
        <h2>💀 演示结束</h2>
        <p class="final-score">最终得分: {{ score }}</p>
        <button class="action-btn" @click="startAiGame">重新演示</button>
      </div>
    </div>

    <router-link to="/" class="back-link">⬅️ 返回主页</router-link>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { SnakeEngine } from '../game/SnakeEngine';
import { Renderer } from '../game/Renderer';
import { AutoPilot } from '../game/AutoPilot';
import { audioManager } from '../utils/audio';

const canvasRef = ref(null);
const score = ref(0);
const gameStatus = ref('idle');
const isMuted = ref(audioManager.isMuted);
const speedMultiplier = ref(1);

const SPEED_LEVELS = [1, 2, 4, 8];
const BASE_TICK_INTERVAL = 150;

let engine = null;
let renderer = null;
let animationFrameId = null;
let lastUpdateTime = 0;

const currentTickInterval = () => BASE_TICK_INTERVAL / speedMultiplier.value;

const cycleSpeed = () => {
  const idx = SPEED_LEVELS.indexOf(speedMultiplier.value);
  speedMultiplier.value = SPEED_LEVELS[(idx + 1) % SPEED_LEVELS.length];
};

const toggleMute = () => {
  isMuted.value = audioManager.toggleMute();
};

const gameLoop = (timestamp) => {
  if (gameStatus.value !== 'playing') return;

  const interval = currentTickInterval();
  if (timestamp - lastUpdateTime >= interval) {
    const nextDir = AutoPilot.getNextDirection(engine);
    engine.changeDirection(nextDir);

    const prevScore = engine.score;
    engine.update();

    if (engine.score > prevScore) audioManager.playEat();
    if (engine.justWrapped) audioManager.playWarp();

    score.value = engine.score;

    if (engine.isGameOver) {
      gameStatus.value = 'gameover';
      audioManager.playDie();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      renderer.draw(engine);
      return;
    }

    lastUpdateTime = timestamp - ((timestamp - lastUpdateTime) % interval);
  }
  renderer.draw(engine);
  animationFrameId = requestAnimationFrame(gameLoop);
};

const startAiGame = () => {
  if (canvasRef.value) {
    audioManager.init();

    // 纯前端随机种子，不请求后端
    const randomSeed = Math.floor(Math.random() * 1000000);

    engine = new SnakeEngine(20, 400, randomSeed, 'wrap');
    renderer = new Renderer(canvasRef.value, 20, 'cyber', 'wrap');

    score.value = 0;
    speedMultiplier.value = 1;
    gameStatus.value = 'playing';
    lastUpdateTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
  }
};

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.game-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  min-height: 100vh;
  box-sizing: border-box;
  touch-action: none;
}
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
  position: relative;
}
.score-board { color: #00e5ff; margin: 0; }
.mute-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  opacity: 0.8;
  transition: transform 0.2s;
}
.mute-btn:hover { transform: scale(1.1); opacity: 1; }
.speed-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.speed-btn {
  background: transparent;
  border: 1px solid #00e5ff;
  color: #00e5ff;
  font-size: 14px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
}
.speed-btn:hover {
  background: rgba(0, 229, 255, 0.1);
}
.speed-btn.active {
  background: #00e5ff;
  color: #000;
}
.canvas-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
}
.game-canvas {
  border: 2px solid #555;
  background-color: #000;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1/1;
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
  border-radius: 4px;
}
.action-btn {
  padding: 12px 28px;
  font-size: 18px;
  background: #00e5ff;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}
.final-score { font-size: 20px; color: #ff9800; margin: 0; }
.back-link {
  display: inline-block;
  margin-top: 25px;
  color: #888;
  text-decoration: none;
  padding: 10px;
}

@media (max-width: 480px) {
  .score-board { font-size: 18px; margin-bottom: 10px; }
  .game-view { padding-top: 10px; }
  .action-btn { padding: 14px 32px; }
}
</style>
