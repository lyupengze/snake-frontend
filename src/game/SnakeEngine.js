import { createSeededRandom } from './PRNG';

export class SnakeEngine {
  constructor(gridSize = 20, canvasSize = 400, seed = null) {
    this.gridSize = gridSize;
    this.canvasSize = canvasSize;
    this.seed = seed;
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

    this.currentTick = 0; // 当前帧数
    this.actions = []; // 玩家操作记录：[{ tick: 0, dir: 'UP' }]

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

    // 处理输入队列，并记录操作
    while (this.directionQueue.length > 0) {
      const newDir = this.directionQueue.shift();
      const isOpposite =
        (this.direction === 'RIGHT' && newDir === 'LEFT') ||
        (this.direction === 'LEFT' && newDir === 'RIGHT') ||
        (this.direction === 'UP' && newDir === 'DOWN') ||
        (this.direction === 'DOWN' && newDir === 'UP');

      if (!isOpposite) {
        this.direction = newDir;
        // 【核心】记录这一帧发生的转向
        this.actions.push({ tick: this.currentTick, dir: newDir });
        break;
      }
    }

    const head = this.snake[0];
    const newHead = { ...head };

    if (this.direction === 'RIGHT') newHead.x += this.gridSize;
    if (this.direction === 'LEFT') newHead.x -= this.gridSize;
    if (this.direction === 'UP') newHead.y -= this.gridSize;
    if (this.direction === 'DOWN') newHead.y += this.gridSize;

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

    this.snake.unshift(newHead);
    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score += 1;
      this.spawnFood();
    } else {
      this.snake.pop();
    }

    this.currentTick++; // 帧数递增
  }
}
