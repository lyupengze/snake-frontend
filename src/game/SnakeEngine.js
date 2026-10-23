import { createSeededRandom } from './PRNG';

/**
 * 贪吃蛇核心游戏引擎（与后端 C++ 保持 1:1 逻辑一致）
 * 负责状态的更新、移动、碰撞判定以及操作记录。
 */
export class SnakeEngine {
  /**
   * @param {number} gridSize 网格大小（像素）
   * @param {number} canvasSize 画布大小（像素）
   * @param {number} seed 服务器下发的随机种子，确保前后端食物生成一致
   */
  constructor(gridSize = 20, canvasSize = 400, seed = null) {
    this.gridSize = gridSize;
    this.canvasSize = canvasSize;
    this.seed = seed;
    this.randomFunc = createSeededRandom(this.seed);
    this.reset();
  }

  /**
   * 重置游戏状态（每次开局或重开时调用）
   */
  reset() {
    // 重置随机序列，确保每次开局的食物生成路径一致
    this.randomFunc = createSeededRandom(this.seed);
    this.snake = [{ x: 200, y: 200 }];
    this.direction = 'RIGHT';
    this.directionQueue = []; // 输入队列，最多缓存 2 个转向操作
    this.score = 0;
    this.isGameOver = false;

    this.currentTick = 0; // 当前游戏帧数
    this.actions = []; // 玩家操作记录：[{ tick: 0, dir: 'UP' }]，用于发给后端重放验证

    this.spawnFood();
  }

  /**
   * 生成食物（必须与 C++ 后端的 ReplayEngine 逻辑完全一致）
   */
  spawnFood() {
    const cols = this.canvasSize / this.gridSize;
    const rows = this.canvasSize / this.gridSize;
    const freeCells = [];

    // [关键逻辑] 遍历顺序（外层 x，内层 y）必须与后端保持一致，否则会导致随机索引错位
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const px = x * this.gridSize;
        const py = y * this.gridSize;
        const isOccupied = this.snake.some((s) => s.x === px && s.y === py);
        if (!isOccupied) freeCells.push({ x: px, y: py });
      }
    }

    if (freeCells.length > 0) {
      // 使用种子伪随机数取模，获取食物索引
      const randomIndex = this.randomFunc() % freeCells.length;
      this.food = freeCells[randomIndex];
    } else {
      // 如果全屏被填满，游戏直接胜利/结束
      this.isGameOver = true;
    }
  }

  /**
   * 接收玩家输入（进入缓存队列）
   */
  changeDirection(newDir) {
    if (this.directionQueue.length < 2) {
      this.directionQueue.push(newDir);
    }
  }

  /**
   * 核心物理帧推进（每 150ms 调用一次）
   */
  update() {
    if (this.isGameOver) return;

    // 1. 处理输入队列，并记录操作到 actions
    while (this.directionQueue.length > 0) {
      const newDir = this.directionQueue.shift();
      // 判断是否反向移动（贪吃蛇不能直接掉头）
      const isOpposite =
        (this.direction === 'RIGHT' && newDir === 'LEFT') ||
        (this.direction === 'LEFT' && newDir === 'RIGHT') ||
        (this.direction === 'UP' && newDir === 'DOWN') ||
        (this.direction === 'DOWN' && newDir === 'UP');

      if (!isOpposite) {
        this.direction = newDir;
        // 记录这一帧的有效转向，tick 不能递增，因为是在同一帧内发生的转向
        this.actions.push({ tick: this.currentTick, dir: newDir });
        break; // 一帧只能处理一个有效转向
      }
    }

    // 2. 计算新蛇头坐标
    const head = this.snake[0];
    const newHead = { ...head };

    if (this.direction === 'RIGHT') newHead.x += this.gridSize;
    if (this.direction === 'LEFT') newHead.x -= this.gridSize;
    if (this.direction === 'UP') newHead.y -= this.gridSize;
    if (this.direction === 'DOWN') newHead.y += this.gridSize;

    // 3. 是否吃到食物
    const ateFood = newHead.x === this.food.x && newHead.y === this.food.y;

    // 4. 碰撞检测
    // [历史Bug修复] 如果没吃到食物，蛇尾会同时移开，因此新蛇头撞到当前蛇尾是合法的，必须 slice(0, -1) 排除蛇尾。
    const snakeToCheck = ateFood ? this.snake : this.snake.slice(0, -1);

    if (
      newHead.x < 0 ||
      newHead.x >= this.canvasSize ||
      newHead.y < 0 ||
      newHead.y >= this.canvasSize ||
      snakeToCheck.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
    ) {
      this.isGameOver = true;
      return; // 死亡帧不递增 currentTick，与后端保持一致
    }

    // 5. 更新蛇身
    this.snake.unshift(newHead);
    if (ateFood) {
      this.score += 1;
      this.spawnFood(); // 吃到食物后生成新食物（会消耗一次随机数）
    } else {
      this.snake.pop();
    }

    this.currentTick++; // 帧数递增
  }
}
