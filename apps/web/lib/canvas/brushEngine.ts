import { BrushSettings, ToolType } from "@lib/store/canvasStore";
import { ToolLogic } from "@lib/canvas/tools";

export class BrushEngine {
  private settings: BrushSettings;

  constructor(initialSettings: BrushSettings) {
    this.settings = initialSettings;
  }

  updateSettings(newSettings: Partial<BrushSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  applyBrushState(ctx: CanvasRenderingContext2D) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this.settings.currentColor;
    ctx.lineWidth = this.settings.brushSize;
    ctx.globalAlpha = this.settings.brushOpacity;
    ctx.globalCompositeOperation = this.settings.brushBlendMode;
  }

  drawPointWithHardness(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const radius = this.settings.brushSize / 2;

    const innerRadius = Math.max(0, radius * this.settings.brushHardness);

    const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, radius);

    gradient.addColorStop(0, this.settings.currentColor);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPreviewShape(
    tool: ToolType,
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ) {
    this.applyBrushState(ctx);

    const start = { x: startX, y: startY };
    const end = { x: endX, y: endY };

    switch (tool) {
      case "line":
        ToolLogic.line(ctx, start, end);
        break;
      case "rectangle":
        ToolLogic.rectangle(ctx, start, end);
        break;
      case "ellipse":
        ToolLogic.ellipse(ctx, start, end);
        break;
    }
  }

  drawSoftStroke(
    mainCtx: CanvasRenderingContext2D,
    lastPointX: number,
    lastPointY: number,
    x: number,
    y: number,
  ) {
    const dx = x - lastPointX;
    const dy = y - lastPointY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const spacing = Math.max(1, this.settings.brushSize * 0.1);
    const steps = distance / spacing;

    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const interpolationX = lastPointX + dx * t;
      const interpolationY = lastPointY + dy * t;

      this.drawPointWithHardness(mainCtx, interpolationX, interpolationY);
    }
    this.drawPointWithHardness(mainCtx, x, y);
  }
}
