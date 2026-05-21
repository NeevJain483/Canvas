"use client";

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

    const getCanvasCoordinates = (
      e: PointerEvent,
    ): { x: number; y: number } => {
      const rect = preview.getBoundingClientRect();

      const x = ((e.clientX - rect.left) / rect.width) * preview.width;
      const y = ((e.clientY - rect.top) / rect.height) * preview.height;

      return { x, y };
    };

    const handleDown = (e: PointerEvent) => {
      if (!mainCtx || !previewCtx) return;

      preview.setPointerCapture(e.pointerId);

      isDrawing.current = true;
      const { x, y } = getCanvasCoordinates(e);

      lastPoint.current = { x, y };
      currentPoint.current = { x, y };

      const state = useCanvasStore.getState();
      const activeTool = currentToolRef.current;

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
        previewCtx.moveTo(x, y);
      } else {
        brush.applyBrushState(mainCtx);
        mainCtx.beginPath();
        mainCtx.moveTo(x, y);
      }
    };

    const handleMove = (e: PointerEvent) => {
      if (!isDrawing.current || !mainCtx || !lastPoint.current) return;

      const { x, y } = getCanvasCoordinates(e);

      currentPoint.current = { x, y };
      const state = useCanvasStore.getState();
      const activeTool = currentToolRef.current;

      if (!TOOL_PROPERTIES[activeTool].canDraw) return;

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
              state.brushHardness,
            );
            break;
          case "eraser":
            ToolLogic.eraser(mainCtx, lastPoint.current, { x, y });
            break;
        }
        lastPoint.current = { x, y };
      }
    };

    const handleUp = (e: PointerEvent) => {
      const activeTool = currentToolRef.current;

      if (!isDrawing.current) return;
      isDrawing.current = false;

      try {
        preview.releasePointerCapture(e.pointerId);
      } catch (err) {
        console.log(err);
      }

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

    preview.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      preview.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [canvasRef, previewRef]);

  return { canvasRef, previewRef, canvasEngineRef };
}
