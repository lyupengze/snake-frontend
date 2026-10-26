import { createSeededRandom } from './PRNG';

export interface Point {
  x: number;
  y: number;
}

export interface Action {
  tick: number;
  dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}

export type GameMode = 'classic' | 'daily' | 'wrap';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export class SnakeEngine {
  public gridSize: number;
  public canvasSize: number;
  public seed: number | null;
  public mode: GameMode;

  public snake: Point[] = [];
  public direction: Direction = 'RIGHT';
  // 队列化转向输入，防止同一帧内快速连按导致 180 度反向自杀
  public directionQueue: Direction[] = [];
  public score: number = 0;
  public isGameOver: boolean = false;
  public food: Point = { x: 0, y: 0 };

  public currentTick: number = 0;
  // 有效操作序列，游戏结束后提交给服务器进行重放校验
  public actions: Action[] = [];
  public wrapEffect: { edge: string; timestamp: number } | null = null;
  public justWrapped: boolean = false;

  private randomFunc: () => number;

  constructor(
    gridSize = 20,
    canvasSize = 400,
    seed: number | null = null,
    mode: GameMode = 'classic'
  ) {
    this.gridSize = gridSize;
    this.canvasSize = canvasSize;
    this.seed = seed;
    this.mode = mode;
    this.randomFunc = createSeededRandom(this.seed || 0);
    this.reset();
  }

  public reset(): void {
    this.randomFunc = createSeededRandom(this.seed || 0);
    this.snake = [{ x: 200, y: 200 }];
    this.direction = 'RIGHT';
    this.directionQueue = [];
    this.score = 0;
    this.isGameOver = false;
    this.wrapEffect = null;
    this.justWrapped = false;
    this.currentTick = 0;
    this.actions = [];
    this.spawnFood();
  }

  // 遍历顺序（外层 x 内层 y）和取模选格逻辑必须与后端 ReplayEngine.cpp 的 spawn_food 完全一致
  public spawnFood(): void {
    const cols = this.canvasSize / this.gridSize;
    const rows = this.canvasSize / this.gridSize;
    const freeCells: Point[] = [];

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

  public changeDirection(newDir: Direction): void {
    if (this.directionQueue.length < 2) {
      this.directionQueue.push(newDir);
    }
  }

  public update(): void {
    if (this.isGameOver) return;

    this.justWrapped = false;

    // 消费转向队列
    while (this.directionQueue.length > 0) {
      const newDir = this.directionQueue.shift()!;
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

    const head = this.snake[0];
    const newHead: Point = { ...head };

    if (this.direction === 'RIGHT') newHead.x += this.gridSize;
    if (this.direction === 'LEFT') newHead.x -= this.gridSize;
    if (this.direction === 'UP') newHead.y -= this.gridSize;
    if (this.direction === 'DOWN') newHead.y += this.gridSize;

    // 边界处理：穿墙模式循环，经典模式撞墙死亡
    if (this.mode === 'wrap') {
      let wrapped = false;
      let edge = '';

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

    // 没吃到食物时蛇尾会在本帧移走，因此撞到当前蛇尾位置是合法的
    const ateFood = newHead.x === this.food.x && newHead.y === this.food.y;
    const snakeToCheck = ateFood ? this.snake : this.snake.slice(0, -1);

    if (snakeToCheck.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      this.isGameOver = true;
      return;
    }

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
