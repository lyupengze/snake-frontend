<template>
  <div class="game-view">
    <div class="header">
      <h2 class="score-board">{{ modeText }} - 得分: {{ score }}</h2>
      <div class="header-actions">
        <button
          v-if="canEnlarge"
          type="button"
          class="zoom-btn"
          :class="{ active: isEnlarged }"
          :aria-pressed="isEnlarged"
          :aria-label="isEnlarged ? '恢复默认游戏画面大小' : '放大游戏画面'"
          :title="isEnlarged ? '恢复默认大小' : '放大游戏画面'"
          @click="toggleEnlarge"
        >
          <span aria-hidden="true">🔍</span>
          <span>{{ isEnlarged ? '还原' : '放大' }}</span>
        </button>
        <button
          type="button"
          class="mute-btn"
          :aria-label="isMuted ? '取消静音' : '静音'"
          @click="toggleMute"
        >
          {{ isMuted ? '🔇' : '🔊' }}
        </button>
      </div>
    </div>

    <div class="canvas-wrapper" :style="{ width: canvasDisplaySize + 'px' }">
      <canvas ref="canvasRef" width="400" height="400" class="game-canvas"></canvas>

      <!-- 等待开始 -->
      <div v-if="gameStatus === 'idle'" class="overlay">
        <h2>准备开始</h2>
        <div class="theme-picker">
          <div
            class="theme-opt classic"
            :class="{ active: currentTheme === 'classic' }"
            title="经典绿"
            @click="changeTheme('classic')"
          ></div>
          <div
            class="theme-opt cyber"
            :class="{ active: currentTheme === 'cyber' }"
            title="赛博蓝"
            @click="changeTheme('cyber')"
          ></div>
          <div
            class="theme-opt lava"
            :class="{ active: currentTheme === 'lava' }"
            title="熔岩红"
            @click="changeTheme('lava')"
          ></div>
          <div
            class="theme-opt sakura"
            :class="{ active: currentTheme === 'sakura' }"
            title="猛男粉"
            @click="changeTheme('sakura')"
          ></div>
          <div
            class="theme-opt toxic"
            :class="{ active: currentTheme === 'toxic' }"
            title="毒液绿"
            @click="changeTheme('toxic')"
          ></div>
        </div>
        <button class="action-btn" @click="handleStart">
          {{ isDailyMode ? '开始每日挑战' : '开始游戏' }}
        </button>
      </div>

      <!-- 游戏结束结算 -->
      <div v-if="gameStatus === 'gameover'" class="overlay">
        <h2>💀 游戏结束</h2>
        <p class="final-score">最终得分: {{ score }}</p>
        <input v-model="playerName" placeholder="输入你的名字" maxlength="20" />
        <button class="action-btn" @click="saveScore" :disabled="isSubmitting || isRetryExhausted">
          {{ isRetryExhausted ? '本局无法上榜' : isSubmitting ? '提交中...' : '提交排行榜' }}
        </button>
      </div>
    </div>

    <router-link to="/menu" class="back-link">⬅️ 返回菜单</router-link>
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSnakeGame } from '../composables/useSnakeGame';
import Toast from '../components/Toast.vue';
import { audioManager } from '../utils/audio';
import { isMobileDevice } from '../utils/runtime';

const CANVAS_SIZE = 400;
// 放大后至少要多出这么多像素，否则按钮没有实际意义
const MIN_ENLARGE_GAIN = 24;

const router = useRouter();
const route = useRoute();
const canvasRef = ref(null);
const playerName = ref('');
const isSubmitting = ref(false);
const isRetryExhausted = ref(false);
const toastRef = ref(null);
const isMuted = ref(audioManager.isMuted);
const currentTheme = ref(localStorage.getItem('snake_theme') || 'classic');

const isDailyMode = computed(() => route.query.mode === 'daily');
const isWrapMode = computed(() => route.query.mode === 'wrap');
const { score, gameStatus, startGame, stopGame, setZoom, submitScore } = useSnakeGame();

// ---------- 网页端 / 桌面端画布放大 ----------
const isEnlarged = ref(false);
const viewport = ref({ width: window.innerWidth, height: window.innerHeight });

const updateViewport = () => {
  viewport.value = { width: window.innerWidth, height: window.innerHeight };
};

// 左右各留 16px 内边距
const availableWidth = computed(() => Math.max(160, viewport.value.width - 32));
// 默认尺寸：桌面端 400px，窄屏时跟随容器收缩
const baseCanvasSize = computed(() => Math.min(CANVAS_SIZE, availableWidth.value));
// 放大尺寸：预留 160px 给得分栏、页脚等页面框架，并限制最大 900px
const maxCanvasSize = computed(() =>
  Math.max(baseCanvasSize.value, Math.min(availableWidth.value, 900, viewport.value.height - 160))
);
const canEnlarge = computed(
  () => !isMobileDevice && maxCanvasSize.value >= baseCanvasSize.value + MIN_ENLARGE_GAIN
);
const canvasDisplaySize = computed(() =>
  isEnlarged.value && canEnlarge.value ? maxCanvasSize.value : baseCanvasSize.value
);

watch(canEnlarge, (value) => {
  if (!value) isEnlarged.value = false;
});

const toggleEnlarge = () => {
  if (!canEnlarge.value) return;
  isEnlarged.value = !isEnlarged.value;
};

// 画布实际 CSS 尺寸变化时，同步 Renderer 的位图分辨率，避免放大后发虚
let resizeObserver = null;
const syncCanvasScale = (cssWidth) => {
  if (!cssWidth || !Number.isFinite(cssWidth)) return;
  setZoom(cssWidth / CANVAS_SIZE);
};

const changeTheme = (t) => {
  currentTheme.value = t;
  localStorage.setItem('snake_theme', t);
};

const modeText = computed(() => {
  if (isDailyMode.value) return '📅 每日挑战';
  if (isWrapMode.value) return '🌀 穿墙模式';
  return '🎮 经典模式';
});

const toggleMute = () => {
  isMuted.value = audioManager.toggleMute();
};

const handleStart = async () => {
  isRetryExhausted.value = false;
  if (canvasRef.value) {
    const currentMode = isDailyMode.value ? 'daily' : isWrapMode.value ? 'wrap' : 'classic';
    // 直接读取真实 CSS 尺寸，保证位图分辨率与当前显示尺寸一致
    const zoom = canvasRef.value.clientWidth / CANVAS_SIZE || 1;
    const result = await startGame(canvasRef.value, currentMode, currentTheme.value, zoom);
    if (!result.success) {
      toastRef.value?.show(result.message);
    }
  }
};

const saveScore = async () => {
  if (!playerName.value) {
    return toastRef.value?.show('请输入名字');
  }
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  const result = await submitScore(playerName.value);

  if (result.success) {
    toastRef.value?.show('🎉 提交成功！');
    // 延迟跳转，让玩家看到成功提示
    setTimeout(() => {
      router.push({
        path: '/leaderboard',
        query: { mode: route.query.mode || 'classic' },
      });
    }, 800);
  } else {
    if (result.retryExhausted) {
      isSubmitting.value = false;
      isRetryExhausted.value = true;
      toastRef.value?.show('😞 多次提交失败，本局成绩无法上榜');
      return;
    }
    isSubmitting.value = false;
    if (result.status === 403) {
      toastRef.value?.show('❌ 校验未通过（疑似作弊或会话过期）');
    } else if (result.status === 429) {
      toastRef.value?.show('🚦 请求过于频繁，请稍后再试');
    } else if (result.status === 413) {
      toastRef.value?.show('⏱️ 游戏时间过长，未能上榜');
    } else if (result.status === 400) {
      toastRef.value?.show('⚠️ 提交的数据不合法');
    } else {
      toastRef.value?.show('📡 网络连接失败，请检查网络后重试');
    }
  }
};

onMounted(() => {
  window.addEventListener('resize', updateViewport);

  // 监听画布真实显示尺寸（含窗口缩放、放大按钮切换），保持位图清晰
  if (canvasRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) syncCanvasScale(width);
    });
    resizeObserver.observe(canvasRef.value);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateViewport);
  resizeObserver?.disconnect();
  stopGame();
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

.score-board {
  color: #4caf50;
  font-size: 22px;
  margin: 0;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 14px;
  line-height: 1;
  color: #4caf50;
  background: transparent;
  border: 1px solid #4caf50;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s, color 0.2s;
}

.zoom-btn:hover {
  background: rgba(76, 175, 80, 0.15);
}

.zoom-btn.active {
  color: #111;
  background: #4caf50;
}

.canvas-wrapper {
  position: relative;
  width: 400px;
  max-width: 100%;
  display: flex;
  justify-content: center;
}

.game-canvas {
  box-sizing: border-box;
  border: 2px solid #555;
  background-color: #000;
  display: block;
  touch-action: none;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
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

.theme-picker {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.theme-opt {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.theme-opt:hover {
  transform: scale(1.15);
}

.theme-opt.active {
  border-color: #ffffff;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
  transform: scale(1.15);
}

.theme-opt.classic {
  background: linear-gradient(135deg, #2e7d32, #4caf50);
}
.theme-opt.cyber {
  background: linear-gradient(135deg, #00e5ff, #00b0ff);
}
.theme-opt.lava {
  background: linear-gradient(135deg, #ff1744, #ff5722);
}
.theme-opt.sakura {
  background: linear-gradient(135deg, #f06292, #f48fb1);
}
.theme-opt.toxic {
  background: linear-gradient(135deg, #76ff03, #64dd17);
}

@media (max-width: 480px) {
  .score-board {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .game-view {
    padding-top: 10px;
  }
  .action-btn {
    padding: 14px 32px;
  }
}
</style>
