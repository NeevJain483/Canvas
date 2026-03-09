import { Tool } from "../types";

export class EraserTool implements Tool {
  name = "Eraser";
  private drawing = false;
  private radius: number;

  constructor(radius: number = 5) {
    this.radius = radius;
  }

  private draw(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out"; // true erasing
    ctx.beginPath();
    ctx.arc(event.offsetX, event.offsetY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  onMouseDown(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    this.drawing = true;
    this.draw(event, ctx);
  }

  onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    if (this.drawing) this.draw(event, ctx);
  }

  onMouseUp(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    this.drawing = false;
  }
}