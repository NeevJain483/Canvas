import { Tool } from "../types";

export class EllipseTool implements Tool {
  name = "ellipse";
  private drawing = false;
  private startX = 0;
  private startY = 0;
  private canvasX: number;
  private canvasY: number;
  private x: number = 0;
  private y: number = 0;
  private radiusX: number = 0;
  private radiusY: number = 0;
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
    this.startX = event.offsetX;
    this.startY = event.offsetY;
  }

  onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    if (this.drawing) {
      if (this.snapshot) ctx.putImageData(this.snapshot, 0, 0);
      this.x = (event.offsetX - this.startX) / 2 + this.startX;
      this.y = (event.offsetY - this.startY) / 2 + this.startY;
      this.radiusX = Math.abs(event.offsetX - this.startX) / 2;
      this.radiusY = Math.abs(event.offsetY - this.startY) / 2;

      ctx.beginPath();
      ctx.ellipse(
        this.x,
        this.y,
        this.radiusX,
        this.radiusY,
        0,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
  }

  onMouseUp(event: MouseEvent, ctx: CanvasRenderingContext2D): void {
    this.drawing = false;
    ctx.closePath();
  }
}
