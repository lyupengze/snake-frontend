/**
 * Canvas 渲染引擎
 *
 * 负责将 SnakeEngine 的状态（蛇、食物）绘制到 Canvas 上。
 * 包含 Retina 高清屏 (devicePixelRatio) 适配逻辑，确保在任何屏幕下都不模糊。
 */
export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas Canvas DOM 元素
   * @param {number} gridSize 单元格逻辑大小（像素）
   */
  constructor(canvas, gridSize = 20) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gridSize = gridSize;

    // 绘制时的内边距，用于在网格之间留出缝隙，增强视觉层次感
    this.padding = 1;
    this.size = this.gridSize - this.padding * 2;

    // [坐标基准] 强制逻辑尺寸固定为 400x400，与游戏引擎逻辑（SnakeEngine）保持绝对一致
    // 这样不管 CSS 怎么缩放这个 DOM，内部计算坐标永远是 0~400。
    this.logicalWidth = 400;
    this.logicalHeight = 400;

    // [Retina 适配核心]
    // 获取当前设备的物理像素比 (通常手机是 2 或 3，电脑是 1 或 1.25)
    const dpr = window.devicePixelRatio || 1;

    // 1. 放大实际渲染分辨率
    canvas.width = this.logicalWidth * dpr;
    canvas.height = this.logicalHeight * dpr;

    // 2. 缩放绘图上下文
    // 这样后续所有 fillRect(x, y) 依然按照 400x400 的坐标系来写，浏览器底层会自动放大绘制，避免锯齿。
    this.ctx.scale(dpr, dpr);
  }

  /**
   * 执行一帧的渲染
   * @param {object} state 当前游戏状态 { snake: [], food: {x, y} }
   */
  draw(state) {
    // 1. 清屏
    // [注意] 必须使用逻辑宽高 (400x400) 来清屏。如果用物理宽高会导致坐标错位。
    this.ctx.fillStyle = '#1e1e1e'; // 深灰色背景
    this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);

    // 2. 渲染食物
    // 增加空指针保护，防止在极端边界情况下游戏结束（如全屏填满）时抛出异常
    if (state.food) {
      this.ctx.fillStyle = '#e53935'; // 红色食物
      this.ctx.fillRect(state.food.x, state.food.y, this.gridSize, this.gridSize);
    }

    // 3. 渲染蛇身
    state.snake.forEach((segment, index) => {
      // 区分蛇头（index === 0）和蛇身颜色
      if (index === 0) {
        this.ctx.fillStyle = '#2e7d32'; // 蛇头：深绿色
      } else {
        this.ctx.fillStyle = '#4caf50'; // 蛇身：浅绿色
      }

      // 使用 constructor 中预先计算好的尺寸（带 padding），绘制出有网格缝隙的方块
      this.ctx.fillRect(segment.x + this.padding, segment.y + this.padding, this.size, this.size);
    });
  }
}
