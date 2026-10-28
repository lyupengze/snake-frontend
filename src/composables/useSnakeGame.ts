import { ref, onUnmounted } from 'vue';
import { SnakeEngine, type GameMode } from '../game/SnakeEngine';
import { Renderer } from '../game/Renderer';
import { request } from '../utils/api';
import { audioManager } from '../utils/audio';

export interface StartGameResult {
  success: boolean;
  message?: string;
}

export interface SubmitScoreResult {
  success: boolean;
  status: number;
}

// 连接游戏引擎、渲染器、音频和网络层的 Vue 组合式函数
export function useSnakeGame() {
  const gameStatus = ref<'idle' | 'playing' | 'gameover'>('idle');
  const score = ref<number>(0);
  const currentMode = ref<GameMode>('classic');

  let engine: SnakeEngine | null = null;
  let renderer: Renderer | null = null;
  let animationFrameId: number | null = null;
  let lastUpdateTime = 0;
  const TICK_INTERVAL = 150;

  let currentGameId: string | null = null;
  let isStarting = false;
  let isSubmitting = false;
  let canvasEl: HTMLCanvasElement | null = null;
  let retryCount = 0;
  const MAX_RETRIES = 3;

  const handleKeydown = (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    if (!engine) return;
    if (e.key === 'ArrowUp') engine.changeDirection('UP');
    if (e.key === 'ArrowDown') engine.changeDirection('DOWN');
    if (e.key === 'ArrowLeft') engine.changeDirection('LEFT');
    if (e.key === 'ArrowRight') engine.changeDirection('RIGHT');
  };

  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    if (gameStatus.value !== 'playing') return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (gameStatus.value !== 'playing' || !engine) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // 滑动距离不足 30px 视为误触，忽略
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) engine.changeDirection('RIGHT');
      else engine.changeDirection('LEFT');
    } else {
      if (dy > 0) engine.changeDirection('DOWN');
      else engine.changeDirection('UP');
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (gameStatus.value !== 'playing') return;
    e.preventDefault();
  };

  const gameLoop = (timestamp: number) => {
    if (gameStatus.value !== 'playing' || !engine || !renderer) return;

    if (timestamp - lastUpdateTime >= TICK_INTERVAL) {
      const prevScore = engine.score;
      engine.update();

      if (engine.score > prevScore) audioManager.playEat();
      if (engine.justWrapped) audioManager.playWarp();

      score.value = engine.score;

      if (engine.isGameOver) {
        gameStatus.value = 'gameover';
        audioManager.playDie();
        stopGame(true);
        renderer.draw(engine);
        return;
      }

      // 帧率补偿：修正 requestAnimationFrame 间隔不精准导致的累计漂移
      lastUpdateTime = timestamp - ((timestamp - lastUpdateTime) % TICK_INTERVAL);
    }

    renderer.draw(engine);
    animationFrameId = requestAnimationFrame(gameLoop);
  };

  const startGame = async (
    canvasElement: HTMLCanvasElement,
    mode: GameMode = 'classic',
    theme: string = 'classic'
  ): Promise<StartGameResult> => {
    if (isStarting) return { success: false, message: '正在启动中，请勿重复点击' };
    isStarting = true;
    currentMode.value = mode;

    audioManager.init();

    try {
      const safeMode = mode || 'classic';

      const res = await request(`/api/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: safeMode }),
      });
      if (!res.ok) throw new Error('Network error');

      const data = await res.json();
      currentGameId = data.gameId;
      const serverSeed = data.seed;

      if (typeof data.seed !== 'number') throw new Error('Invalid seed from server');

      initAndRun(canvasElement, new SnakeEngine(20, 400, serverSeed, safeMode), safeMode, theme);
      return { success: true };
    } catch (e) {
      console.error('[API Error] 启动游戏失败:', e);
      currentGameId = null;
      return { success: false, message: '无法连接服务器，请稍后重试' };
    } finally {
      isStarting = false;
    }
  };

  const initAndRun = (
    canvasElement: HTMLCanvasElement,
    newEngine: SnakeEngine,
    mode: GameMode,
    theme: string
  ) => {
    stopGame();
    canvasEl = canvasElement;
    engine = newEngine;
    renderer = new Renderer(canvasElement, 20, theme, mode);

    score.value = 0;
    gameStatus.value = 'playing';

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    lastUpdateTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
  };

  const stopGame = (isGameOver = false) => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('touchmove', handleTouchMove);

    if (!isGameOver) gameStatus.value = 'idle';
  };

  onUnmounted(() => stopGame());

  const submitScore = async (playerName: string): Promise<SubmitScoreResult> => {
    if (!currentGameId || isSubmitting) {
      return { success: false, status: 400 };
    }
    isSubmitting = true;

    try {
      const response = await request(`/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: currentGameId,
          name: playerName,
          score: score.value,
          actions: engine?.actions || [],
        }),
      });

      if (response.ok) {
        currentGameId = null;
        retryCount = 0;
        return { success: true, status: response.status };
      }

      // 403（作弊/会话过期）和 413（游戏过长）为不可恢复的永久失败
      if (response.status === 403 || response.status === 413) {
        currentGameId = null;
        retryCount = 0;
        return { success: false, status: response.status };
      }

      // 400/429/500 等保留 gameId，玩家修正后仍可重试
      retryCount++;
      if (retryCount >= MAX_RETRIES) {
        currentGameId = null;
        retryCount = 0;
      }
      return { success: false, status: response.status };
    } catch (error) {
      console.error('[API Error] 提交分数失败:', error);
      retryCount++;
      if (retryCount >= MAX_RETRIES) {
        currentGameId = null;
        retryCount = 0;
      }
      return { success: false, status: 0 };
    } finally {
      isSubmitting = false;
    }
  };

  return {
    score,
    gameStatus,
    startGame,
    stopGame,
    submitScore,
  };
}
