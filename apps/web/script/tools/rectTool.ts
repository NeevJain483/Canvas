import { Tool } from "../types";
import { pushRedoState } from "./redoTool";
import { emptyUndoStack } from "./undoTool";

export class RectrangleTool implements Tool {
  name = "rectrangle";
  private drawing = false;
  private startX = 0;
  private startY = 0;
  private width = 0;
  private height = 0;
  private canvasX;
  private canvasY;
  private snapshot: ImageData | undefined;

  private color: string = "#000";

  constructor(canvasX: number, canvasY: number) {
    this.canvasX = canvasX;
    this.canvasY = canvasY;
  }

  setColor(color: string): void {
    this.color = color;
  }

  onMouseDown(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    this.snapshot = ctx.getImageData(0, 0, this.canvasX, this.canvasY);
    this.drawing = true;
    ctx.beginPath();
    this.startX = event.offsetX;
    this.startY = event.offsetY;
    emptyUndoStack();
  }
  onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    if (this.drawing) {
      if (!this.snapshot) return;
      ctx.putImageData(this.snapshot, 0, 0);
      this.width = event.offsetX - this.startX;
      this.height = event.offsetY - this.startY;
      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.startX, this.startY, this.width, this.height);
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
    this.width = 0;
    this.height = 0;
  }
}
