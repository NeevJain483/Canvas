import { useRef, useEffect } from "react";
import { useCanvasStore } from "@lib/store/canvasStore";
import { CanvasEngine } from "@lib/canvas/canvasEngine";
import { TOOL_PROPERTIES, ToolLogic } from "@lib/canvas/tools";
import { BrushEngine } from "@lib/canvas/brushEngine";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const canvasEngineRef = useRef<CanvasEngine | null>(null);
  const brushEngineRef = useRef<BrushEngine | null>(null);

  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const currentPoint = useRef<{ x: number; y: number } | null>(null);
  const panStartPoint = useRef<{ x: number; y: number } | null>(null);

  const currentTool = useCanvasStore((state) => state.currentTool);
  const currentToolRef = useRef(currentTool);

  useEffect(() => {
    currentToolRef.current = currentTool;
  }, [currentTool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const preview = previewRef.current;
    if (!canvas || !preview) return;

    if (!canvasEngineRef.current) {
      canvasEngineRef.current = new CanvasEngine(canvas, preview);
      canvasEngineRef.current.resize();
    }

    if (!brushEngineRef.current) {
      const state = useCanvasStore.getState();
      brushEngineRef.current = new BrushEngine({
        brushBlendMode: state.brushBlendMode,
        brushHardness: state.brushHardness,
        brushOpacity: state.brushOpacity,
        brushSize: state.brushSize,
        currentColor: state.currentColor,
      });
    }
    const engine = canvasEngineRef.current;
    const brush = brushEngineRef.current;
    const mainCtx = engine.mainCtx;
    const previewCtx = engine.previewCtx;

    const handleDown = (e: PointerEvent) => {
      const state = useCanvasStore.getState();
      const activeTool = currentToolRef.current;

      if (!mainCtx || !previewCtx) return;

      isDrawing.current = true;
      const { offsetX, offsetY } = e;
      lastPoint.current = { x: offsetX, y: offsetY };
      currentPoint.current = { x: offsetX, y: offsetY };
      panStartPoint.current = { x: offsetX, y: offsetY };
      if (!TOOL_PROPERTIES[activeTool].canDraw) return;

      brush.updateSettings({
        currentColor: state.currentColor,
        brushSize: state.brushSize,
        brushOpacity: state.brushOpacity,
        brushHardness: state.brushHardness,
        brushBlendMode: state.brushBlendMode,
      });

      if (TOOL_PROPERTIES[activeTool].requiresPreview) {
        brush.applyBrushState(previewCtx);
        previewCtx.beginPath();
        previewCtx.moveTo(offsetX, offsetY);
      } else {
        brush.applyBrushState(mainCtx);
        mainCtx.beginPath();
        mainCtx.moveTo(offsetX, offsetY);
      }
    };

    const handleMove = (e: PointerEvent) => {
      if (!isDrawing.current || !mainCtx || !lastPoint.current) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      currentPoint.current = { x, y };
      const state = useCanvasStore.getState();
      const activeTool = currentToolRef.current;

      if (!TOOL_PROPERTIES[activeTool].canDraw || !lastPoint.current) return;

      if (TOOL_PROPERTIES[activeTool].requiresPreview) {
        engine.clearPreview();
        brush.drawPreviewShape(
          activeTool,
          previewCtx,
          lastPoint.current.x,
          lastPoint.current.y,
          x,
          y,
        );
      } else {

        switch (activeTool) {
          case "brush":
            ToolLogic.brush(
              mainCtx,
              lastPoint.current,
              { x, y },
              state.brushSize,
              state.brushHardness
            );
            break;
          case "eraser":
            ToolLogic.eraser(mainCtx, lastPoint.current, { x, y });
            break;
        }
        lastPoint.current = { x, y };
      }
    };

    const handleUp = () => {
      const state = useCanvasStore.getState();
      const activeTool = currentToolRef.current; 

      if (!isDrawing.current) return;
      isDrawing.current = false;

      if (!TOOL_PROPERTIES[activeTool].canDraw || !mainCtx) return;

      if (
        TOOL_PROPERTIES[activeTool].requiresPreview &&
        lastPoint.current &&
        currentPoint.current
      ) {
        brush.applyBrushState(mainCtx);
        mainCtx.beginPath();

        const startX = lastPoint.current.x;
        const startY = lastPoint.current.y;
        const endX = currentPoint.current.x;
        const endY = currentPoint.current.y;

        engine.commitPreviewToMain((ctx) => {
          brush.drawPreviewShape(activeTool, ctx, startX, startY, endX, endY);
        });
      } else {
        mainCtx.closePath();
      }

      engine.clearPreview();

      lastPoint.current = null;
      currentPoint.current = null;
    };

    const handleResize = () => engine.resize();

    preview.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("resize", handleResize);

    return () => {
      preview.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { canvasRef, previewRef, canvasEngineRef };
}
