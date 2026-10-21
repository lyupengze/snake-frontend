import { ref } from 'vue';
import { SnakeEngine } from '../game/SnakeEngine';
import { Renderer } from '../game/Renderer';

export function useSnakeGame() {
  const gameStatus = ref('idle');
  const score = ref(0);

  const API_BASE = '';

  let engine = null;
  let renderer = null;
  let gameLoop = null;
  let currentGameId = null;
  let isStarting = false;
  let canvasEl = null; // 【新增】保存 canvas 引用

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

  // --- 新增：移动端触摸滑动控制 ---
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e) => {
    // 记录手指按下的初始坐标
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!engine) return;

    // 记录手指离开时的坐标
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    // 计算 X 和 Y 轴上的滑动距离
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // 设置一个最小滑动阈值（比如 30 像素），防止误触
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    // 判断滑动方向（水平滑动还是垂直滑动幅度更大）
    if (Math.abs(dx) > Math.abs(dy)) {
      // 左右滑动
      if (dx > 0) engine.changeDirection('RIGHT');
      else engine.changeDirection('LEFT');
    } else {
      // 上下滑动
      if (dy > 0) engine.changeDirection('DOWN');
      else engine.changeDirection('UP');
    }
  };

  const startGame = async (canvasElement) => {
    if (isStarting) return;
    isStarting = true;

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

    canvasEl = canvasElement; // 【修改】保存引用，方便后面解绑
    // 初始化引擎和渲染器
    engine = new SnakeEngine();
    renderer = new Renderer(canvasElement);

    score.value = 0;
    gameStatus.value = 'playing';
    window.addEventListener('keydown', handleKeydown);

    // 【新增】绑定触摸事件
    canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasElement.addEventListener('touchend', handleTouchEnd);
    // 阻止在画布上滑动时触发网页滚动
    canvasElement.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // 立刻画一帧
    renderer.draw(engine);

    // 启动心跳
    gameLoop = setInterval(() => {
      engine.update();

      // 把引擎里的数据同步给 Vue 的响应式变量
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

    // 【新增】解绑触摸事件
    // 注意这里需要传入你获取 canvas 元素的方式，如果你在外部传了 canvasElement 进来，就用它
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
    stopGame,
    submitScore,
  };
}
