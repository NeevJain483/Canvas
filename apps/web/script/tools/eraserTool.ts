import { Tool } from "../types";

export class EraserTool implements Tool {
  name = "Eraser";
  private drawing = false;
  private radius: number;
  private lastX = 0;
  private lastY = 0;

  constructor(radius: number = 5) {
    this.radius = radius;
  }

  private draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  onMouseDown(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    this.drawing = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;
    this.draw(ctx, this.lastX, this.lastY);
  }

  onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    if (this.drawing) {
      const x = event.offsetX;
      const y = event.offsetY;
      this.drawInterpolated(ctx, x, y);
      this.lastX = x;
      this.lastY = y;
    }
  }

  onMouseUp(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    this.drawing = false;
  }

  private drawInterpolated(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
  ) {
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    for (let i = 0; i < distance; i++) {
      const t = i / distance;
      const ix = this.lastX + dx * t;
      const iy = this.lastY + dy * t;
      this.draw(ctx, ix, iy);
    }
  }
}
