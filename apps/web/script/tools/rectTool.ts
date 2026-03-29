import { ToolManagerType } from "../types";
import { pushRedoState } from "../functions";
import { emptyUndoStack } from "../functions";

export class RectrangleTool implements ToolManagerType {
  name = "rectrangle";
  private drawing = false;
  private startX = 0;
  private startY = 0;
  private width = 0;
  private height = 0;
  private canvasX;
  private canvasY;
  private snapshot: ImageData | undefined;
  private thickness = 2;

  private color: string = "#000";

  constructor(canvasX: number, canvasY: number) {
    this.canvasX = canvasX;
    this.canvasY = canvasY;
  }

  setColor(color: string): void {
    this.color = color;
  }

  setStrokeWidth(width: number): void {
    this.thickness = width;
  }

  onPointerDown(event: PointerEvent, ctx: CanvasRenderingContext2D): void {
    this.startDrawing(event, ctx);
  }

  onPointerMove(event: PointerEvent, ctx: CanvasRenderingContext2D): void {
    this.continueDrawing(event, ctx);
  }

  onPointerUp(event: PointerEvent, ctx: CanvasRenderingContext2D): void {
    this.stopDrawing(event, ctx);
  }

  private startDrawing(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    this.snapshot = ctx.getImageData(0, 0, this.canvasX, this.canvasY);
    this.drawing = true;
    ctx.beginPath();
    this.startX = event.offsetX;
    this.startY = event.offsetY;
    emptyUndoStack();
  }
  private continueDrawing(
    event: MouseEvent,
    ctx: CanvasRenderingContext2D,
  ): void {
    if (this.drawing) {
      if (!this.snapshot) return;
      ctx.putImageData(this.snapshot, 0, 0);
      ctx.lineWidth = this.thickness;
      this.width = event.offsetX - this.startX;
      this.height = event.offsetY - this.startY;
      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.startX, this.startY, this.width, this.height);
    }
  }

  private stopDrawing(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
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
