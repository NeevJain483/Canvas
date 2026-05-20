import { ToolType } from "@lib/store/canvasStore";

export interface ToolProperty {
  cursor: string;
  requiresPreview: boolean;
  canDraw: boolean;
}

export const TOOL_PROPERTIES: Record<ToolType, ToolProperty> = {
  eraser: { cursor: "cell", requiresPreview: false, canDraw: true },
  brush: { cursor: "crosshair", requiresPreview: false, canDraw: true },
  line: { cursor: "crosshair", requiresPreview: true, canDraw: true },
  rect: { cursor: "crosshair", requiresPreview: true, canDraw: true },
  ellipse: { cursor: "crosshair", requiresPreview: true, canDraw: true },
  // pen: { cursor: "default", requiresPreview: false, canDraw: true },
  // pencil: { cursor: "crosshair", requiresPreview: false, canDraw: true },
  // fill: { cursor: "pointer", requiresPreview: false, canDraw: true },
  // pan: { cursor: "grab", requiresPreview: false, canDraw: false },
  // text: { cursor: "text", requiresPreview: true, canDraw: true },
  // select: { cursor: "default", requiresPreview: false, canDraw: false },
};

export interface Point {
  x: number;
  y: number;
}

export const ToolLogic = {
  rect: (ctx: CanvasRenderingContext2D, start: Point, end: Point) => {
    ctx.beginPath();
    ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
    ctx.stroke();
    ctx.closePath();
  },

  eraser: (ctx: CanvasRenderingContext2D, start: Point, end: Point) => {
    const originalComposite = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "destination-out";

    ctx.quadraticCurveTo(start.x, start.y, end.x, end.y);
    ctx.stroke();

    ctx.globalCompositeOperation = originalComposite;
  },

  ellipse: (ctx: CanvasRenderingContext2D, start: Point, end: Point) => {
    const radiusX = Math.abs(end.x - start.x) / 2;
    const radiusY = Math.abs(end.y - start.y) / 2;
    const centerX = start.x + (end.x - start.x) / 2;
    const centerY = start.y + (end.y - start.y) / 2;

    if (radiusX === 0 || radiusY === 0) return;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  },

  line: (ctx: CanvasRenderingContext2D, start: Point, end: Point) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.closePath();
  },

  brush: (
    ctx: CanvasRenderingContext2D,
    start: { x: number; y: number },
    end: { x: number; y: number },
    brushSize: number = 20,
    hardness: number = 0.2,
  ) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const stepSpacing = hardness === 1 ? 1 : Math.max(1, brushSize * 0.1);
    const steps = Math.ceil(distance / stepSpacing);

    const baseColor = ctx.strokeStyle as string;

    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 1 : i / steps;
      const x = start.x + dx * t;
      const y = start.y + dy * t;

      ctx.beginPath();
      const radius = brushSize / 2;

      if (hardness === 1) {
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.fill();
      } else {
        const innerRadius = radius * hardness;

        const gradient = ctx.createRadialGradient(
          x,
          y,
          innerRadius,
          x,
          y,
          radius,
        );

        const transparentColor = baseColor.startsWith("#")
          ? hexToRgba(baseColor, 0)
          : baseColor
              .replace(/rgb\((.*)\)/, "rgba($1, 0)")
              .replace(
                /rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
                "rgba($1,$2,$3,0)",
              );

        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(1, transparentColor);

        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      ctx.closePath();
    }
  },
};

export function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
