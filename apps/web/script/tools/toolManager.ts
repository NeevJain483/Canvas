import { ToolManagerType } from "../types";
import { redoStack } from "../functions";

export type ToolType = {
  name: string;
  size: number;
  min: number;
  max: number;
};

export const tools: Record<string, ToolType> = {
  brush: { name: "brush", size: 10, min: 2, max: 48 },
  eraser: { name: "eraser", size: 20, min: 2, max: 96 },
};

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
    if (this.currentTool && this.currentTool.setColor) {
      this.currentTool.setColor(color);
    }
  }

  setLineWidth(width: number) {
    if (this.currentTool && this.currentTool.setStockWidth) {
      this.currentTool.setStockWidth(width);
    }
  }

  handleMouseDown(e: MouseEvent, ctx: CanvasRenderingContext2D) {
    this.currentTool?.onMouseDown(e, ctx);
  }
  handleMouseMove(e: MouseEvent, ctx: CanvasRenderingContext2D) {
    this.currentTool?.onMouseMove(e, ctx);
  }
  handleMouseUp(e: MouseEvent, ctx: CanvasRenderingContext2D) {
    this.currentTool?.onMouseUp(e, ctx);
  }
}
