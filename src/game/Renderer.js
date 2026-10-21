// src/game/Renderer.js

export class Renderer {
  constructor(canvas, gridSize = 20) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridSize = gridSize;
  }

  draw(state) {
    // 1. 清屏
    this.ctx.fillStyle = '#1e1e1e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. 先画蛇
    this.ctx.fillStyle = '#4caf50';
    state.snake.forEach((segment) => {
      this.ctx.fillRect(segment.x, segment.y, this.gridSize, this.gridSize);
    });

    // 3. 后画食物（如果发生重叠，食物会盖在蛇头上，保证你能看见）
    this.ctx.fillStyle = '#e53935';
    this.ctx.fillRect(state.food.x, state.food.y, this.gridSize, this.gridSize);
  }
}
