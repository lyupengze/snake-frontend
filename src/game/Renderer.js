export class Renderer {
  constructor(canvas, gridSize = 20) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridSize = gridSize;

    // 【修复 2】提前算好，避免在每秒 60 帧的循环里重复计算
    this.padding = 1;
    this.size = this.gridSize - this.padding * 2;

    // 【修复 1】适配高分屏，并保存逻辑宽高
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    this.logicalWidth = rect.width || 400;
    this.logicalHeight = rect.height || 400;

    // 设置物理像素尺寸
    canvas.width = this.logicalWidth * dpr;
    canvas.height = this.logicalHeight * dpr;

    // 放大画布上下文，让内部坐标和逻辑像素 1:1 对应
    this.ctx.scale(dpr, dpr);
  }

  draw(state) {
    // 1. 清屏：必须使用逻辑宽高！绝对不能用物理宽高
    this.ctx.fillStyle = '#1e1e1e';
    this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);

    // 2. 画食物（防御空指针）
    if (state.food) {
      this.ctx.fillStyle = '#e53935';
      this.ctx.fillRect(state.food.x, state.food.y, this.gridSize, this.gridSize);
    }

    // 3. 画蛇
    state.snake.forEach((segment, index) => {
      // 【修复 3】直接使用 constructor 算好的尺寸，提升性能
      if (index === 0) {
        this.ctx.fillStyle = '#2e7d32'; // 蛇头深绿
      } else {
        this.ctx.fillStyle = '#4caf50'; // 蛇身浅绿
      }

      this.ctx.fillRect(segment.x + this.padding, segment.y + this.padding, this.size, this.size);
    });
  }
}
