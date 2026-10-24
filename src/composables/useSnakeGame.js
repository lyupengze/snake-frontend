import { ref, onUnmounted } from 'vue';
import { SnakeEngine } from '../game/SnakeEngine';
import { Renderer } from '../game/Renderer';
import { request } from '../utils/api';
import { audioManager } from '../utils/audio';

/**
 * 贪吃蛇游戏 Vue Composable
 * 负责将 SnakeEngine 与 Vue 的响应式状态、Canvas 渲染以及后端 API 连接起来。
 */
export function useSnakeGame() {
  const gameStatus = ref('idle'); // idle | playing | gameover
  const score = ref(0);
  const currentMode = ref('classic');

  let engine = null;
  let renderer = null;
  let animationFrameId = null;
  let lastUpdateTime = 0;
  const TICK_INTERVAL = 150; // 一帧 150ms

  // 状态锁与上下文变量
  let currentGameId = null;
  let isStarting = false; // 防止重复发起 start 请求
  let isSubmitting = false; // 防止重复提交分数
  let canvasEl = null;

  // ==========================================
  // 键盘与触摸事件监听
  // ==========================================

  const handleKeydown = (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    if (!engine) return;
    if (e.key === 'ArrowUp') engine.changeDirection('UP');
    if (e.key === 'ArrowDown') engine.changeDirection('DOWN');
    if (e.key === 'ArrowLeft') engine.changeDirection('LEFT');
    if (e.key === 'ArrowRight') engine.changeDirection('RIGHT');
  };

  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e) => {
    // [交互优化] 严格限制只有在游玩状态下才记录触摸点，防止在结算/开始界面滑动时触发误触
    if (gameStatus.value !== 'playing') return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    // [交互优化] 监听 window 全局触摸，让玩家在画布外（如两侧留白处）滑动也能生效
    if (gameStatus.value !== 'playing' || !engine) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // 忽略过小的滑动（误触）
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) engine.changeDirection('RIGHT');
      else engine.changeDirection('LEFT');
    } else {
      if (dy > 0) engine.changeDirection('DOWN');
      else engine.changeDirection('UP');
    }
  };

  // 阻止移动端滑动时页面跟着滚动
  const handleTouchMove = (e) => {
    if (gameStatus.value !== 'playing') return;
    e.preventDefault();
  };

  // ==========================================
  // 游戏主循环 (requestAnimationFrame)
  // ==========================================

  const gameLoop = (timestamp) => {
    if (gameStatus.value !== 'playing') return;

    if (timestamp - lastUpdateTime >= TICK_INTERVAL) {
      const prevScore = engine.score;
      engine.update();

      // 如果分数增加，说明吃到了食物
      if (engine.score > prevScore) {
        audioManager.playEat();
      }

      if (engine.justWrapped) {
        audioManager.playWarp();
      }

      score.value = engine.score;

      if (engine.isGameOver) {
        gameStatus.value = 'gameover';
        audioManager.playDie(); // 播放死亡音效
        stopGame(true);
        renderer.draw(engine);
        return;
      }

      // 帧率补偿机制：防止由于 requestAnimationFrame 触发间隔不精准导致的游戏变慢
      lastUpdateTime = timestamp - ((timestamp - lastUpdateTime) % TICK_INTERVAL);
    }

    renderer.draw(engine);
    animationFrameId = requestAnimationFrame(gameLoop);
  };

  /**
   * 启动游戏并获取服务器下发的权威 seed
   *
   * @param {HTMLCanvasElement} canvasElement 画布 DOM
   * @param {string} mode 游戏模式 (classic/daily)
   * @returns {Promise<{success: boolean, message?: string}>} 启动结果
   */
  const startGame = async (canvasElement, mode = 'classic', theme = 'classic') => {
    if (isStarting) return { success: false, message: '正在启动中，请勿重复点击' };
    isStarting = true;
    currentMode.value = mode;

    // [关键] 用户点击开始，解锁浏览器的音频上下文
    audioManager.init();

    try {
      // [网络请求] 向服务器申请开局，获取服务器下发的权威 seed
      const res = await request(`/api/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: mode }),
      });
      if (!res.ok) throw new Error('Network error');

      const data = await res.json();
      currentGameId = data.gameId;
      const serverSeed = data.seed;

      if (typeof data.seed !== 'number') {
        throw new Error('Invalid seed from server');
      }

      initAndRun(canvasElement, new SnakeEngine(20, 400, serverSeed, mode), mode, theme);
      return { success: true };
    } catch (e) {
      console.error('[API Error] 启动游戏失败:', e);
      currentGameId = null; // 清理可能产生的无用 gameId
      return { success: false, message: '无法连接服务器，请稍后重试' };
    } finally {
      isStarting = false; // [历史Bug修复] 无论成功失败都要解锁，否则无法连开第二局
    }
  };

  const initAndRun = (canvasElement, newEngine, mode, theme) => {
    stopGame(); // 先清理上一局的残余监听器
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

  // ==========================================
  // 销毁与清理
  // ==========================================

  const stopGame = (isGameOver = false) => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('touchmove', handleTouchMove);

    // 主动退出时才重置为 idle，如果是死亡触发的，则保留 gameover 状态供 UI 展示
    if (!isGameOver) {
      gameStatus.value = 'idle';
    }
  };

  onUnmounted(() => {
    stopGame();
  });

  /**
   * 提交游戏分数到服务器进行重放校验
   *
   * [架构设计]
   * 返回值不再是简单的 boolean，而是包含 { success, status } 的对象。
   * 这是为了将 HTTP 状态码透传给 UI 层（GameView），以便根据不同错误提供精确的用户提示。
   *
   * @param {string} playerName 玩家昵称
   * @returns {Promise<{success: boolean, status: number}>} 包含成功状态和 HTTP 状态码的结果
   */
  const submitScore = async (playerName) => {
    // [并发控制] 如果正在提交或没有有效的 GameID，直接拦截
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
          actions: engine.actions, // 携带完整操作序列供后端重放
        }),
      });

      const ok = response.ok;

      // [状态清理] 只要拿到了服务器响应（无论成功还是被防作弊拦截），都清空 gameId 防止双击重复提交
      currentGameId = null;

      // 透传后端返回的 HTTP 状态码（如 403, 413, 400）
      return { success: ok, status: response.status };
    } catch (error) {
      console.error('[API Error] 提交分数失败:', error);
      // 状态码 0 代表网络层异常（如断网、跨域失败）
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
