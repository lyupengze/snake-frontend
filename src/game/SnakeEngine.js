import { createSeededRandom } from './PRNG';

export class SnakeEngine {
  constructor(gridSize = 20, canvasSize = 400, seed = null) {
    this.gridSize = gridSize;
    this.canvasSize = canvasSize;
    this.randomFunc =
      seed !== null ? createSeededRandom(seed) : () => Math.floor(Math.random() * 1000000);

    this.reset();
  }

  reset() {
    this.snake = [{ x: 200, y: 200 }];
    this.direction = 'RIGHT';
    this.directionQueue = []; // 【新增】输入队列
    this.score = 0;
    this.isGameOver = false;
    this.spawnFood();
  }

  spawnFood() {
    const cols = this.canvasSize / this.gridSize;
    const rows = this.canvasSize / this.gridSize;

    // 1. 找出所有空闲的格子（绝不使用 while 循环）
    const freeCells = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const px = x * this.gridSize;
        const py = y * this.gridSize;
        const isOccupied = this.snake.some((s) => s.x === px && s.y === py);
        if (!isOccupied) {
          freeCells.push({ x: px, y: py });
        }
      }
    }

    // 2. 如果还有空位，从空闲池里“抽”一个（只消耗1个随机数！）
    if (freeCells.length > 0) {
      const randomIndex = this.randomFunc() % freeCells.length;
      this.food = freeCells[randomIndex];
    } else {
      this.isGameOver = true; // 通关了
    }
  }

  changeDirection(newDir) {
    // 【修复】只将合法的输入推入队列，不直接修改 nextDirection
    if (this.directionQueue.length < 2) {
      this.directionQueue.push(newDir);
    }
  }

  update() {
    if (this.isGameOver) return;

    // 1. 处理输入队列
    while (this.directionQueue.length > 0) {
      const newDir = this.directionQueue.shift();
      const isOpposite =
        (this.direction === 'RIGHT' && newDir === 'LEFT') ||
        (this.direction === 'LEFT' && newDir === 'RIGHT') ||
        (this.direction === 'UP' && newDir === 'DOWN') ||
        (this.direction === 'DOWN' && newDir === 'UP');

      // 只要不是反方向，就应用这个转向，并跳出循环（一帧只能转一次）
      if (!isOpposite) {
        this.direction = newDir;
        break;
      }
    }

    // 2. 移动逻辑
    const head = this.snake[0];
    const newHead = { ...head };

    if (this.direction === 'RIGHT') newHead.x += this.gridSize;
    if (this.direction === 'LEFT') newHead.x -= this.gridSize;
    if (this.direction === 'UP') newHead.y -= this.gridSize;
    if (this.direction === 'DOWN') newHead.y += this.gridSize;

    // 3. 死亡判定
    if (
      newHead.x < 0 ||
      newHead.x >= this.canvasSize ||
      newHead.y < 0 ||
      newHead.y >= this.canvasSize ||
      this.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
    ) {
      this.isGameOver = true;
      return;
    }

    // 4. 推进蛇身与吃食物
    this.snake.unshift(newHead);
    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score += 1;
      this.spawnFood();
    } else {
      this.snake.pop();
    }
  }
}
