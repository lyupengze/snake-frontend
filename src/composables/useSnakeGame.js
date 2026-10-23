import { ref, onUnmounted } from 'vue';
import { SnakeEngine } from '../game/SnakeEngine';
import { Renderer } from '../game/Renderer';
import { request } from '../utils/api'; // 引入你的统一网络适配器

export function useSnakeGame() {
  const gameStatus = ref('idle');
  const score = ref(0);
  const currentMode = ref('classic');

  let engine = null;
  let renderer = null;
  let animationFrameId = null;
  let lastUpdateTime = 0;
  const TICK_INTERVAL = 150;

  let currentGameId = null;
  let isStarting = false;
  let isSubmitting = false;
  let canvasEl = null;

  // ==========================================
  // 事件监听（具名函数，为了能被正确解绑）
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
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!engine) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) engine.changeDirection('RIGHT');
      else engine.changeDirection('LEFT');
    } else {
      if (dy > 0) engine.changeDirection('DOWN');
      else engine.changeDirection('UP');
    }
  };

  // 【修复】具名函数，彻底告别内存泄漏
  const handleTouchMove = (e) => e.preventDefault();

  // ==========================================
  // 游戏主循环 (requestAnimationFrame)
  // ==========================================
  const gameLoop = (timestamp) => {
    if (gameStatus.value !== 'playing') return;

    if (timestamp - lastUpdateTime >= TICK_INTERVAL) {
      engine.update();
      score.value = engine.score;

      if (engine.isGameOver) {
        gameStatus.value = 'gameover'; // 先标记结束
        stopGame(true); // 【修复】传入 true，告诉它保留 gameover 状态
        renderer.draw(engine);
        return;
      }
      // ...

      // 补偿误差
      lastUpdateTime = timestamp - ((timestamp - lastUpdateTime) % TICK_INTERVAL);
    }

    renderer.draw(engine);
    animationFrameId = requestAnimationFrame(gameLoop);
  };

  // ==========================================
  // 启动逻辑
  // ==========================================
  const startGame = async (canvasElement, mode = 'classic') => {
    if (isStarting) return;
    isStarting = true;
    currentMode.value = mode;

    try {
      // 只发这一个请求，告诉后端我要玩什么模式
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
      initAndRun(canvasElement, new SnakeEngine(20, 400, serverSeed));
      isStarting = false; // 新增
    } catch (e) {
      alert('无法连接服务器！');
      currentGameId = null; // 新增：清理未完成的 session 引用
      isStarting = false;
    }
  };

  // 抽离公共初始化逻辑，保持代码 DRY
  const initAndRun = (canvasElement, newEngine) => {
    stopGame(); // 【修复】先清理上一局的残余监听器
    canvasEl = canvasElement;
    engine = newEngine;
    renderer = new Renderer(canvasElement);
    score.value = 0;
    gameStatus.value = 'playing';

    window.addEventListener('keydown', handleKeydown);
    canvasEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasEl.addEventListener('touchend', handleTouchEnd);
    canvasEl.addEventListener('touchmove', handleTouchMove, { passive: false });

    lastUpdateTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);
  };

  // ==========================================
  // 销毁逻辑
  // ==========================================
  // 接收一个参数，默认是 false（代表不是游戏结束，而是主动退出）
  const stopGame = (isGameOver = false) => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('keydown', handleKeydown);
    if (canvasEl) {
      canvasEl.removeEventListener('touchstart', handleTouchStart);
      canvasEl.removeEventListener('touchend', handleTouchEnd);
      canvasEl.removeEventListener('touchmove', handleTouchMove);
    }

    // 【核心修复】只有不是因为游戏结束而停止时，才重置为 idle
    if (!isGameOver) {
      gameStatus.value = 'idle';
    }
  };

  // 【修复】组件销毁时，自动清理所有内存
  onUnmounted(() => {
    stopGame();
  });

  // ==========================================
  // 核心业务：提交分数
  // ==========================================
  // 只贴出修改的 submitScore 部分
  const submitScore = async (playerName) => {
    if (!currentGameId || isSubmitting) return false;
    isSubmitting = true;

    try {
      const response = await request(`/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: currentGameId,
          name: playerName,
          score: score.value,
          actions: engine.actions, // 【核心】只传操作记录，不传 seed 了
        }),
      });
      const ok = response.ok;
      currentGameId = null; // 无论成功失败，只要拿到了服务器响应就清空
      return ok;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      isSubmitting = false;
    }
  };

  return {
    score,
    gameStatus,
    startGame, // 只暴露这一个
    stopGame,
    submitScore,
  };
}
