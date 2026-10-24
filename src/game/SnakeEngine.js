import { createSeededRandom } from './PRNG';

/**
 * 贪吃蛇核心游戏引擎（与后端 C++ 保持 1:1 逻辑一致）
 */
export class SnakeEngine {
  constructor(gridSize = 20, canvasSize = 400, seed = null, mode = 'classic') {
    this.gridSize = gridSize;
    this.canvasSize = canvasSize;
    this.seed = seed;
    this.mode = mode;
    this.randomFunc = createSeededRandom(this.seed);
    this.reset();
  }

  reset() {
    this.randomFunc = createSeededRandom(this.seed);
    this.snake = [{ x: 200, y: 200 }];
    this.direction = 'RIGHT';
    this.directionQueue = [];
    this.score = 0;
    this.isGameOver = false;
    this.wrapEffect = null; // 特效时间戳

    this.currentTick = 0;
    this.actions = [];

    this.spawnFood();
  }

  spawnFood() {
    const cols = this.canvasSize / this.gridSize;
    const rows = this.canvasSize / this.gridSize;
    const freeCells = [];

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const px = x * this.gridSize;
        const py = y * this.gridSize;
        const isOccupied = this.snake.some((s) => s.x === px && s.y === py);
        if (!isOccupied) freeCells.push({ x: px, y: py });
      }
    }

    if (freeCells.length > 0) {
      const randomIndex = this.randomFunc() % freeCells.length;
      this.food = freeCells[randomIndex];
    } else {
      this.isGameOver = true;
    }
  }

  changeDirection(newDir) {
    if (this.directionQueue.length < 2) {
      this.directionQueue.push(newDir);
    }
  }

  update() {
    if (this.isGameOver) return;

    this.justWrapped = false;

    // 1. 处理输入队列
    while (this.directionQueue.length > 0) {
      const newDir = this.directionQueue.shift();
      const isOpposite =
        (this.direction === 'RIGHT' && newDir === 'LEFT') ||
        (this.direction === 'LEFT' && newDir === 'RIGHT') ||
        (this.direction === 'UP' && newDir === 'DOWN') ||
        (this.direction === 'DOWN' && newDir === 'UP');

      if (!isOpposite) {
        this.direction = newDir;
        this.actions.push({ tick: this.currentTick, dir: newDir });
        break;
      }
    }

    // 2. 计算新蛇头坐标
    const head = this.snake[0];
    const newHead = { ...head };

    if (this.direction === 'RIGHT') newHead.x += this.gridSize;
    if (this.direction === 'LEFT') newHead.x -= this.gridSize;
    if (this.direction === 'UP') newHead.y -= this.gridSize;
    if (this.direction === 'DOWN') newHead.y += this.gridSize;

    // 3. 边界处理（严格限制 if-else 的作用域，只处理越界）
    if (this.mode === 'wrap') {
      let wrapped = false;
      let edge = null;

      if (newHead.x < 0) {
        newHead.x = this.canvasSize - this.gridSize;
        wrapped = true;
        edge = 'left';
      } else if (newHead.x >= this.canvasSize) {
        newHead.x = 0;
        wrapped = true;
        edge = 'right';
      }

      if (newHead.y < 0) {
        newHead.y = this.canvasSize - this.gridSize;
        wrapped = true;
        edge = 'top';
      } else if (newHead.y >= this.canvasSize) {
        newHead.y = 0;
        wrapped = true;
        edge = 'bottom';
      }

      if (wrapped) {
        this.wrapEffect = { edge, timestamp: performance.now() };
        this.justWrapped = true;
      }
    } else {
      // 经典/每日模式：撞墙死亡
      if (
        newHead.x < 0 ||
        newHead.x >= this.canvasSize ||
        newHead.y < 0 ||
        newHead.y >= this.canvasSize
      ) {
        this.isGameOver = true;
        return;
      }
    }

    // 👇 [核心修复] 以下逻辑必须放在 if-else 外面！无论什么模式都要执行！

    // 4. 死亡判定 (撞自己)
    const ateFood = newHead.x === this.food.x && newHead.y === this.food.y;
    const snakeToCheck = ateFood ? this.snake : this.snake.slice(0, -1);

    if (snakeToCheck.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      this.isGameOver = true;
      return;
    }

    // 5. 更新蛇身与分数
    this.snake.unshift(newHead);
    if (ateFood) {
      this.score += 1;
      this.spawnFood();
    } else {
      this.snake.pop();
    }

    this.currentTick++;
  }
}
