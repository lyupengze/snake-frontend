import { createSeededRandom } from './PRNG';

/** 二维网格坐标点 */
export interface Point {
  x: number;
  y: number;
}

/** 玩家操作记录（用于提交给后端重放） */
export interface Action {
  tick: number;
  dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
}

/** 游戏模式枚举 */
export type GameMode = 'classic' | 'daily' | 'wrap';

/** 移动方向枚举 */
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

/**
 * 贪吃蛇核心游戏引擎
 * 负责物理推进、碰撞检测、状态更新与动作录制。
 */
export class SnakeEngine {
  public gridSize: number;
  public canvasSize: number;
  public seed: number | null;
  public mode: GameMode;

  /** 蛇身坐标数组（index 0 为蛇头） */
  public snake: Point[] = [];
  public direction: Direction = 'RIGHT';
  /** 转向输入队列（防止一帧内多次转向导致反向自杀） */
  public directionQueue: Direction[] = [];
  public score: number = 0;
  public isGameOver: boolean = false;
  public food: Point = { x: 0, y: 0 };

  /** 当前游戏帧数（每次 update 且未死亡时递增） */
  public currentTick: number = 0;
  /** 玩家操作序列，用于结束后发给服务器校验 */
  public actions: Action[] = [];
  /** 穿墙特效触发状态 */
  public wrapEffect: { edge: string; timestamp: number } | null = null;
  /** 穿墙音效触发标记 */
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
    // 重新初始化 PRNG，确保同一种子下的食物序列完全一致
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

  /**
   * 生成食物
   * [核心警告]：遍历空闲格子的顺序（外层 x，内层 y）及取模算法，必须与 C++ 后端完全一致。
   */
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

    // 每次更新重置穿墙标记
    this.justWrapped = false;

    // 1. 消费输入队列
    while (this.directionQueue.length > 0) {
      const newDir = this.directionQueue.shift()!;
      const isOpposite =
        (this.direction === 'RIGHT' && newDir === 'LEFT') ||
        (this.direction === 'LEFT' && newDir === 'RIGHT') ||
        (this.direction === 'UP' && newDir === 'DOWN') ||
        (this.direction === 'DOWN' && newDir === 'UP');

      if (!isOpposite) {
        this.direction = newDir;
        // [防作弊] 记录有效转向
        this.actions.push({ tick: this.currentTick, dir: newDir });
        break;
      }
    }

    // 2. 计算新坐标
    const head = this.snake[0];
    const newHead: Point = { ...head };

    if (this.direction === 'RIGHT') newHead.x += this.gridSize;
    if (this.direction === 'LEFT') newHead.x -= this.gridSize;
    if (this.direction === 'UP') newHead.y -= this.gridSize;
    if (this.direction === 'DOWN') newHead.y += this.gridSize;

    // 3. 边界处理
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

    // 4. 死亡判定 (撞自己)
    const ateFood = newHead.x === this.food.x && newHead.y === this.food.y;
    // [关键逻辑] 如果没吃到食物，蛇尾会移开，因此撞到当前蛇尾是合法的
    const snakeToCheck = ateFood ? this.snake : this.snake.slice(0, -1);

    if (snakeToCheck.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      this.isGameOver = true;
      return;
    }

    // 5. 更新蛇身
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
