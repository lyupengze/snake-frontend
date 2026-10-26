import type { Point } from './SnakeEngine';

interface ThemePalette {
  head: string;
  body: string;
  glow: string;
  food: string;
}

export type ThemeName = 'classic' | 'cyber' | 'lava' | 'sakura' | 'toxic';

// Canvas 渲染引擎：Retina 高清屏适配、主题皮肤绘制、穿墙边缘光晕特效
export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gridSize: number;
  private theme: string;
  private mode: string;

  private padding: number;
  private size: number;
  private logicalWidth: number = 400;
  private logicalHeight: number = 400;

  private themes: Record<ThemeName, ThemePalette>;

  constructor(
    canvas: HTMLCanvasElement,
    gridSize = 20,
    theme = 'classic',
    mode: string = 'classic'
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.gridSize = gridSize;
    this.theme = theme;
    this.mode = mode;

    this.padding = 1;
    this.size = this.gridSize - this.padding * 2;

    // 按设备像素比放大画布，再缩放上下文，实现 Retina 屏清晰渲染
    const dpr = window.devicePixelRatio || 1;
    canvas.width = this.logicalWidth * dpr;
    canvas.height = this.logicalHeight * dpr;
    this.ctx.scale(dpr, dpr);

    this.themes = {
      classic: { head: '#2e7d32', body: '#4caf50', glow: 'rgba(76, 175, 80, 1)', food: '#e53935' },
      cyber: { head: '#00e5ff', body: '#00b0ff', glow: 'rgba(0, 229, 255, 1)', food: '#ff00ff' },
      lava: { head: '#ff1744', body: '#ff5722', glow: 'rgba(255, 23, 68, 1)', food: '#ffeb3b' },
      sakura: { head: '#f06292', body: '#f48fb1', glow: 'rgba(240, 98, 146, 1)', food: '#4caf50' },
      toxic: { head: '#76ff03', body: '#64dd17', glow: 'rgba(118, 255, 3, 1)', food: '#d500f9' },
    };
  }

  public draw(state: {
    snake: Point[];
    food: Point;
    wrapEffect: { edge: string; timestamp: number } | null;
  }): void {
    const palette = this.themes[this.theme as ThemeName] || this.themes.classic;
    const now = performance.now();

    this.ctx.fillStyle = '#121212';
    this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);

    // 穿墙模式边缘光晕：400ms 内基于物理时间平滑渐隐
    if (this.mode === 'wrap' && state.wrapEffect) {
      const elapsed = now - state.wrapEffect.timestamp;
      const duration = 400;

      if (elapsed < duration) {
        this.ctx.save();
        const alpha = 1 - elapsed / duration;
        this.ctx.globalAlpha = alpha;

        const edge = state.wrapEffect.edge;
        const thickness = 40;

        let grad: CanvasGradient;
        let rectX = 0,
          rectY = 0,
          rectW = 0,
          rectH = 0;

        if (edge === 'left') {
          grad = this.ctx.createLinearGradient(0, 0, thickness, 0);
          grad.addColorStop(0, palette.glow);
          grad.addColorStop(1, 'transparent');
          rectW = thickness;
          rectH = this.logicalHeight;
        } else if (edge === 'right') {
          grad = this.ctx.createLinearGradient(
            this.logicalWidth,
            0,
            this.logicalWidth - thickness,
            0
          );
          grad.addColorStop(0, palette.glow);
          grad.addColorStop(1, 'transparent');
          rectX = this.logicalWidth - thickness;
          rectW = thickness;
          rectH = this.logicalHeight;
        } else if (edge === 'top') {
          grad = this.ctx.createLinearGradient(0, 0, 0, thickness);
          grad.addColorStop(0, palette.glow);
          grad.addColorStop(1, 'transparent');
          rectW = this.logicalWidth;
          rectH = thickness;
        } else {
          grad = this.ctx.createLinearGradient(
            0,
            this.logicalHeight,
            0,
            this.logicalHeight - thickness
          );
          grad.addColorStop(0, palette.glow);
          grad.addColorStop(1, 'transparent');
          rectY = this.logicalHeight - thickness;
          rectW = this.logicalWidth;
          rectH = thickness;
        }

        this.ctx.fillStyle = grad;
        this.ctx.fillRect(rectX, rectY, rectW, rectH);
        this.ctx.restore();
      }
    }

    if (state.food) {
      this.ctx.save();
      this.ctx.fillStyle = palette.food;
      this.ctx.shadowColor = palette.food;
      this.ctx.shadowBlur = 10;
      this.ctx.fillRect(state.food.x + 2, state.food.y + 2, this.gridSize - 4, this.gridSize - 4);
      this.ctx.restore();
    }

    state.snake.forEach((segment, index) => {
      if (index === 0) {
        this.ctx.fillStyle = palette.head;
        this.ctx.shadowColor = palette.head;
        this.ctx.shadowBlur = 12;
      } else {
        this.ctx.fillStyle = palette.body;
        this.ctx.shadowBlur = 0;
      }
      this.ctx.fillRect(segment.x + this.padding, segment.y + this.padding, this.size, this.size);
    });
    this.ctx.shadowBlur = 0;
  }
}
