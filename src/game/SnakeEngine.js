// src/game/SnakeEngine.js

import { createSeededRandom } from './PRNG';

export class SnakeEngine {
  // 构造函数增加 seed 参数
  constructor(gridSize = 20, canvasSize = 400, seed = null) {
    this.gridSize = gridSize;
    this.canvasSize = canvasSize;

    // 如果有种子，就用伪随机；否则用真随机
    this.randomFunc = seed !== null ? createSeededRandom(seed) : Math.random;
    this.reset();
  }

  reset() {
    this.snake = [{ x: 200, y: 200 }];
    this.direction = 'RIGHT';
    this.nextDirection = 'RIGHT';
    this.score = 0;
    this.isGameOver = false;
    this.spawnFood();
  }

  // 随机生成食物，且不能生成在蛇身上
  spawnFood() {
    let newFood;
    let isOverlapping = true;
    const cols = this.canvasSize / this.gridSize;
    const rows = this.canvasSize / this.gridSize;

    while (isOverlapping) {
      newFood = {
        // 【核心修改】换成 this.randomFunc()
        x: Math.floor(this.randomFunc() * cols) * this.gridSize,
        y: Math.floor(this.randomFunc() * rows) * this.gridSize,
      };

      const onSnake = this.snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );

      if (!onSnake) isOverlapping = false;
    }
    this.food = newFood;
  }

  // 改变方向（防止 180 度掉头）
  changeDirection(newDir) {
    const isOpposite =
      (this.direction === 'RIGHT' && newDir === 'LEFT') ||
      (this.direction === 'LEFT' && newDir === 'RIGHT') ||
      (this.direction === 'UP' && newDir === 'DOWN') ||
      (this.direction === 'DOWN' && newDir === 'UP');

    if (!isOpposite) {
      this.nextDirection = newDir;
    }
  }

  // 核心推进逻辑（由 Vue 的定时器每秒调用几次）
  update() {
    if (this.isGameOver) return;

    this.direction = this.nextDirection;
    const head = this.snake[0];
    const newHead = { ...head };

    if (this.direction === 'RIGHT') newHead.x += this.gridSize;
    if (this.direction === 'LEFT') newHead.x -= this.gridSize;
    if (this.direction === 'UP') newHead.y -= this.gridSize;
    if (this.direction === 'DOWN') newHead.y += this.gridSize;

    // 1. 撞墙检测
    if (
      newHead.x < 0 ||
      newHead.x >= this.canvasSize ||
      newHead.y < 0 ||
      newHead.y >= this.canvasSize
    ) {
      this.isGameOver = true;
      return;
    }

    // 2. 咬自己检测
    if (this.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      this.isGameOver = true;
      return;
    }

    // 3. 移动蛇
    this.snake.unshift(newHead);

    // 4. 吃食物检测
    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score += 1;
      this.spawnFood();
    } else {
      this.snake.pop(); // 没吃到，尾巴缩回去
    }
  }
}
