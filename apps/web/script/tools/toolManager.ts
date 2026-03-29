import { ToolManagerType } from "../types";
import { redoStack } from "../functions";

export class ToolManager {
  private currentTool: ToolManagerType | null = null;
  private color: string = "#000";

  constructor(ctx: CanvasRenderingContext2D) {
    redoStack.push(ctx.getImageData(0, 0, 1, 1));
  }

  setTool(tool: ToolManagerType) {
    this.currentTool = tool;
    if (tool.setColor) {
      tool.setColor(this.color);
    }
  }

  setColor(color: string) {
    this.color = color;
    if (this.currentTool?.setColor) {
      this.currentTool.setColor(color);
    }
  }

  setLineWidth(width: number) {
    if (this.currentTool?.setStrokeWidth) {
      this.currentTool.setStrokeWidth(width);
    }
  }

  // Unified pointer logic (mouse, touch, stylus)
  handlePointerDown(e: PointerEvent, ctx: CanvasRenderingContext2D) {
    this.currentTool?.onPointerDown(e, ctx);
  }

  handlePointerMove(e: PointerEvent, ctx: CanvasRenderingContext2D) {
    this.currentTool?.onPointerMove(e, ctx);
  }

  handlePointerUp(e: PointerEvent, ctx: CanvasRenderingContext2D) {
    this.currentTool?.onPointerUp(e, ctx);
  }
}