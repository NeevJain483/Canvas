import { Pencil, Tool } from "../types";
import { pushRedoState } from "./redoTool";
import { emptyUndoStack } from "./undoTool";

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
      this.drawInterPolated(ctx, x, y);
      this.lastX = x;
      this.lastY = y;
    }
  }

  onMouseUp(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    const snapShot = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height,
    );
    this.drawing = false;
    ctx.closePath();
    pushRedoState(snapShot);
    emptyUndoStack();
  }

  private drawInterPolated(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
  ) {
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const steps = Math.ceil(distance / 3);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const ix = this.lastX + dx * t;
      const iy = this.lastY + dy * t;
      this.draw(ctx, ix, iy);
    }

    this.lastX = x;
    this.lastY = y;
  }
}
