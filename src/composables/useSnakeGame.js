import { ref } from 'vue';
import { SnakeEngine } from '../game/SnakeEngine';
import { Renderer } from '../game/Renderer';

export function useSnakeGame() {
  const gameStatus = ref('idle');
  const score = ref(0);
  const API_BASE = '';
  const currentMode = ref('classic');

  let engine = null;
  let renderer = null;
  let gameLoop = null;
  let currentGameId = null;
  let isStarting = false;
  let canvasEl = null;

  // ==========================================
  // 事件监听定义区（这里就是你刚才丢失的部分）
  // ==========================================
  const handleKeydown = (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
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

  // ==========================================
  // 游戏启动与停止逻辑
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
      const data = await res.json();
      currentGameId = data.gameId;
    } catch (e) {
      alert('无法连接服务器！');
      isStarting = false;
      return;
    }

    canvasEl = canvasElement;
    engine = new SnakeEngine(); // 经典模式无种子
    renderer = new Renderer(canvasElement);

    score.value = 0;
    gameStatus.value = 'playing';

    // 绑定事件
    window.addEventListener('keydown', handleKeydown);
    canvasEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasEl.addEventListener('touchend', handleTouchEnd);
    canvasEl.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    renderer.draw(engine);

    gameLoop = setInterval(() => {
      engine.update();
      score.value = engine.score;
      renderer.draw(engine);

      if (engine.isGameOver) {
        gameStatus.value = 'gameover';
        stopGame();
      }
    }, 150);

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
      const seedData = await seedRes.json();
      const startData = await startRes.json();

      seed = seedData.seed;
      currentGameId = startData.gameId;
    } catch (e) {
      alert('无法获取每日挑战数据！');
      isStarting = false;
      return;
    }

    canvasEl = canvasElement;
    engine = new SnakeEngine(20, 400, seed); // 每日模式传入种子
    renderer = new Renderer(canvasElement);

    score.value = 0;
    gameStatus.value = 'playing';

    // 绑定事件
    window.addEventListener('keydown', handleKeydown);
    canvasEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasEl.addEventListener('touchend', handleTouchEnd);
    canvasEl.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    renderer.draw(engine);

    gameLoop = setInterval(() => {
      engine.update();
      score.value = engine.score;
      renderer.draw(engine);

      if (engine.isGameOver) {
        gameStatus.value = 'gameover';
        stopGame();
      }
    }, 150);

    isStarting = false;
  };

  const stopGame = () => {
    if (gameLoop) clearInterval(gameLoop);
    window.removeEventListener('keydown', handleKeydown);
    if (canvasEl) {
      canvasEl.removeEventListener('touchstart', handleTouchStart);
      canvasEl.removeEventListener('touchend', handleTouchEnd);
    }
  };

  const submitScore = async (playerName) => {
    if (!currentGameId) return false;
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
      return response.ok;
    } catch (error) {
      return false;
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
