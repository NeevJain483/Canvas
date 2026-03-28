import { Tool } from "../types";
import { pushRedoState } from "../functions";
import { emptyUndoStack } from "../functions";

export class LineTool implements Tool {
  name = "line";
  private color = "#000";
  private drawing = false;
  private x = 0;
  private y = 0;
  private canvasX: number;
  private canvasY: number;
  private snapShot: ImageData | null = null;
  private lineWidth = 2;

  constructor(canvasX: number, canvasY: number) {
    this.canvasX = canvasX;
    this.canvasY = canvasY;
  }

  private draw(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.closePath();
  }

  public setColor(color: string): void {
    this.color = color;
  }

  setStockWidth(width: number): void {
    this.lineWidth = width;
  }

  public onMouseDown(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    this.drawing = true;
    this.x = event.offsetX;
    this.y = event.offsetY;
    this.snapShot = ctx.getImageData(0, 0, this.canvasX, this.canvasY);
    emptyUndoStack();
  }
  public onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    if (this.drawing) {
      if (this.snapShot) ctx.putImageData(this.snapShot, 0, 0);
      this.draw(event, ctx);
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
  }
}
