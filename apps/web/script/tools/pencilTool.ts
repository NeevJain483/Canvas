import { ToolManagerType } from "../types";
import { pushRedoState } from "../functions";
import { emptyUndoStack } from "../functions";

export class PencilTool implements ToolManagerType {
  name = "Pencil";
  private drawing = false;
  private color = "#000";
  private lineWidth = 2;

  setColor(color: string) {
    this.color = color;
  }

  setStrokeWidth(width: number) {
    this.lineWidth = width;
  }

  private startDrawing(event: PointerEvent, ctx: CanvasRenderingContext2D) {
    if (event.buttons !== 1) return;

    this.drawing = true;
    const { offsetX: x, offsetY: y } = event;

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.moveTo(x, y);

    emptyUndoStack();
  }

  private continueDrawing(event: PointerEvent, ctx: CanvasRenderingContext2D) {
    if (!this.drawing) return;

    const { offsetX: x, offsetY: y } = event;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  private stopDrawing(ctx: CanvasRenderingContext2D) {
    if (!this.drawing) return;

    const snapShot = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.drawing = false;
    ctx.closePath();
    pushRedoState(snapShot);
  }

  onPointerDown(event: PointerEvent, ctx: CanvasRenderingContext2D) {
    this.startDrawing(event, ctx);
  }

  onPointerMove(event: PointerEvent, ctx: CanvasRenderingContext2D) {
    this.continueDrawing(event, ctx);
  }

  onPointerUp(event: PointerEvent, ctx: CanvasRenderingContext2D) {
    this.stopDrawing(ctx);
  }
}