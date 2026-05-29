"use client";

import { useRef, useEffect } from "react";
import { useCanvasStore } from "@lib/store/canvasStore";
import { CanvasEngine } from "@lib/canvas/canvasEngine";
import { TOOL_PROPERTIES, ToolLogic } from "@lib/canvas/tools";
import { BrushEngine } from "@lib/canvas/brushEngine";
import { useProjectStore } from "@lib/store/projectStore";
import { updateCurrentProject } from "@lib/utils";
import { CanvasElementType } from "@repo/common/types";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const canvasEngineRef = useRef<CanvasEngine | null>(null);
  const brushEngineRef = useRef<BrushEngine | null>(null);

  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const currentPoint = useRef<{ x: number; y: number } | null>(null);

  const currentProject = useProjectStore((state) => state.currentProject);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const currentProjectRef = useRef(currentProject);
  const setCurrentProjectRef = useRef(setCurrentProject);
  
  const currentTool = useCanvasStore((state) => state.currentTool);
  const currentToolRef = useRef(currentTool);

  const pointsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    currentToolRef.current = currentTool;
  }, [currentTool]);

  useEffect(() => {
    currentProjectRef.current = currentProject;
    setCurrentProjectRef.current = setCurrentProject;
  }, [currentProject, setCurrentProject]);

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

      if (activeTool === "brush" || activeTool === "eraser") {
        pointsRef.current = [{ x, y }];
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
            pointsRef.current.push({ x, y });
            break;
          case "eraser":
            ToolLogic.eraser(mainCtx, lastPoint.current, { x, y });
            pointsRef.current.push({ x, y });
            break;
        }
        lastPoint.current = { x, y };
      }
    };

    const handleUp = (e: PointerEvent) => {
      const state = useCanvasStore.getState();
      const activeTool = currentToolRef.current;

      if (!isDrawing.current) return;
      isDrawing.current = false;

      try {
        preview.releasePointerCapture(e.pointerId);
      } catch (err) {
        console.log(err);
      }

      if (!TOOL_PROPERTIES[activeTool].canDraw || !mainCtx) return;

      const startX = lastPoint.current?.x || 0;
      const startY = lastPoint.current?.y || 0;
      const endX = currentPoint.current?.x || 0;
      const endY = currentPoint.current?.y || 0;

      if (
        TOOL_PROPERTIES[activeTool].requiresPreview &&
        lastPoint.current &&
        currentPoint.current
      ) {
        brush.applyBrushState(mainCtx);
        mainCtx.beginPath();

        engine.commitPreviewToMain((ctx) => {
          brush.drawPreviewShape(activeTool, ctx, startX, startY, endX, endY);
        });
      } else {
        if (activeTool === "brush" && pointsRef.current.length === 1) {
          const point = pointsRef.current[0]!;
          ToolLogic.brush(
            mainCtx,
            point,
            point,
            state.brushSize,
            state.brushHardness,
          );
        }

        if (activeTool === "eraser" && pointsRef.current.length === 1) {
          const point = pointsRef.current[0]!;
          ToolLogic.eraser(mainCtx, point, point);
        }

        mainCtx.closePath();
      }

      engine.clearPreview();
      if (!currentProjectRef.current) return;
      if (activeTool === "brush") {
        updateCurrentProject(currentProjectRef.current, setCurrentProjectRef.current, {
          type: "brush",
          color: state.currentColor,
          width: state.brushSize,
          points: [...pointsRef.current],
        });
      } else if (activeTool === "eraser") {
        updateCurrentProject(currentProjectRef.current, setCurrentProjectRef.current, {
          type: "eraser",
          width: state.brushSize,
          points: [...pointsRef.current],
        });
      } else if (
        activeTool === "line" ||
        activeTool === "rectangle" ||
        activeTool === "ellipse"
      ) {
        updateCurrentProject(currentProjectRef.current, setCurrentProjectRef.current, {
          type: activeTool,
          color: state.currentColor,
          width: state.brushSize,
          start_x: startX,
          start_y: startY,
          last_x: endX,
          last_y: endY,
        } as CanvasElementType);
      }
      pointsRef.current = [];
      lastPoint.current = null;
      currentPoint.current = null;
      console.log(currentProjectRef.current.canvasState)
    };

    preview.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      preview.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  return { canvasRef, previewRef, canvasEngineRef };
}
