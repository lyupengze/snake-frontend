import { ref, onUnmounted } from 'vue';
import { SnakeEngine } from '../game/SnakeEngine';
import { Renderer } from '../game/Renderer';

export function useSnakeGame() {
  const gameStatus = ref('idle');
  const score = ref(0);
  const currentMode = ref('classic');
  const API_BASE = '';

  let engine = null;
  let renderer = null;
  let animationFrameId = null;
  let lastUpdateTime = 0;
  const TICK_INTERVAL = 150; // 毫秒/格

  let currentGameId = null;
  let isStarting = false;
  let isSubmitting = false; // 【修复】防连点提交锁
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
  const startGame = async (canvasElement) => {
    if (isStarting) return;
    isStarting = true;
    currentMode.value = 'classic';

    try {
      const res = await fetch(`${API_BASE}/api/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      // 【修复】严格检查 HTTP 状态码
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      currentGameId = data.gameId;
    } catch (e) {
      alert('无法连接服务器！');
      isStarting = false;
      return;
    }

    initAndRun(canvasElement, new SnakeEngine());
    isStarting = false;
  };

  const startDailyChallenge = async (canvasElement) => {
    if (isStarting) return;
    isStarting = true;
    currentMode.value = 'daily';

    let seed = null;
    try {
      const [seedRes, startRes] = await Promise.all([
        fetch(`${API_BASE}/api/daily-seed`),
        fetch(`${API_BASE}/api/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      ]);

      // 【修复】双请求严格校验
      if (!seedRes.ok || !startRes.ok) throw new Error('API Error');

      const seedData = await seedRes.json();
      const startData = await startRes.json();

      seed = seedData.seed;
      currentGameId = startData.gameId;
    } catch (e) {
      alert('无法获取每日挑战数据！');
      isStarting = false;
      return;
    }

    initAndRun(canvasElement, new SnakeEngine(20, 400, seed));
    isStarting = false;
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
  const submitScore = async (playerName) => {
    if (!currentGameId) return false;
    if (isSubmitting) return false; // 【修复】防止玩家狂点提交按钮狂发请求

    isSubmitting = true;
    try {
      const response = await fetch(`${API_BASE}/api/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: currentGameId,
          name: playerName,
          score: score.value,
          mode: currentMode.value,
        }),
      });

      // 如果后端返回 403 或 400，这里 response.ok 为 false，返回 false 给 UI 层处理
      return response.ok;
    } catch (error) {
      console.error('提交分数网络异常:', error);
      return false;
    } finally {
      isSubmitting = false; // 无论成败，必须解锁
    }
  };

  return {
    score,
    gameStatus,
    startGame,
    startDailyChallenge,
    stopGame,
    submitScore,
  };
}
