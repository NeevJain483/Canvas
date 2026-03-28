import { ToolManagerType } from "../types";
import { pushRedoState } from "../functions";
import { emptyUndoStack } from "../functions";

export class PencilTool implements ToolManagerType {
  name = "Pencil";
  private drawing = false;
  private color = "#000";
  private lastX = 0;
  private lastY = 0;
  private lineWidth = 2;

  setColor(color: string) {
    this.color = color;
  }

  setStrokeWidth(width: number) {
    console.log("pencil is here");
    this.lineWidth = width;
  }

  onMouseDown(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    this.drawing = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.moveTo(this.lastX, this.lastY);

    emptyUndoStack();
  }

  onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    if (!this.drawing) return;

    const x = event.offsetX;
    const y = event.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();

    this.lastX = x;
    this.lastY = y;
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
}
