import { Tool } from "../types";

export class ToolManager {
  private currentTool: Tool | null = null;
  private color: string = "#000";

  setTool(tool: Tool) {
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
