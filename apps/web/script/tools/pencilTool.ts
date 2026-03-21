import { Pencil, Tool } from "../types";
import { pushRedoState } from "./redoTool";
import { emptyUndoStack } from "./undoTool";

export class PencilTool implements Tool {
  name = "Pencil";
  private drawing = false;
  private color = "#000";
  private lastX = 0;
  private lastY = 0;
  private lineWidth = 2;
  private pencilData: Pencil = {
    name: "Pencil",
    coordinates: [],
    color: this.color,
    lineWidth: this.lineWidth,
  };

  setColor(color: string) {
    this.color = color;
  }

  setStrokeWidth(width: number) {
    this.lineWidth = width;
  }

  onMouseDown(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    this.drawing = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.lastX, this.lastY);
    emptyUndoStack();
  }

  onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    if (!this.drawing) return;
    this.drawInterPolated(ctx, event.offsetX, event.offsetY);
  }

  onMouseUp(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    const snapShot = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height,
    );
    this.drawing = false;
    ctx.closePath();
    pushRedoState(snapShot);
  }

  private drawInterPolated(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
  ) {
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const steps = Math.ceil(distance / 5);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const ix = this.lastX + dx * t;
      const iy = this.lastY + dy * t;
      this.draw(ctx, ix, iy);
      this.pencilData.coordinates.push({
        x: ix,
        y: iy,
      });
    }

    this.lastX = x;
    this.lastY = y;
  }
  private draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
