export class BrushTool {
  name = "Brush";
  private drawing = false;
  private color = "#000";
  private radius = 2;
  private lastX = 0;
  private lastY = 0;

  setColor(color: string) { this.color = color; }
  setSize(size: number) { this.radius = size; }

  onMouseDown(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    this.drawing = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;
    this.drawCircle(ctx, this.lastX, this.lastY);
  }

  onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D) {
    if (!this.drawing) return;
    const x = event.offsetX;
    const y = event.offsetY;
    this.drawInterpolated(ctx, x, y);
    this.lastX = x;
    this.lastY = y;
  }

  onMouseUp() { this.drawing = false; }

  private drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  private drawInterpolated(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    for (let i = 0; i < distance; i++) {
      const t = i / distance;
      const ix = this.lastX + dx * t;
      const iy = this.lastY + dy * t;
      this.drawCircle(ctx, ix, iy);
    }
  }
}