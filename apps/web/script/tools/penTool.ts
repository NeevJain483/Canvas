import { Tool } from "../types";

export class PencilTool implements Tool{
  name = "Pen";
  private drawing = false;
  private color = "#000";
  private lastX = 0;
  private lastY = 0;

  setColor(color: string) {
    this.color = color;
  }

  onMouseDown(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    this.drawing = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;
    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.strokeStyle = this.color;
  }

  onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D) {
  if (!this.drawing) return;

  const x = event.offsetX;
  const y = event.offsetY;
  const midX = (this.lastX + x) / 2;
  const midY = (this.lastY + y) / 2;

  ctx.quadraticCurveTo(this.lastX, this.lastY, midX, midY);
  ctx.stroke();

  this.lastX = x;
  this.lastY = y;
}

  onMouseUp(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    this.drawing = false;
    ctx.closePath();
  }
}