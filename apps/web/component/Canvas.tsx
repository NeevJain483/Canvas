"use client";
import { useRef, useEffect, useState } from "react";
import { ToolManager } from "../script/tools";
import { ToolType } from "../script/functions";
import "./index.css";

import ColorBox from "./ColorBox";
import ToolBox from "./ToolBox";
import Function from "./function";
import Seekbar from "../ui/Seekbar";

const Draw = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const toolManagerRef = useRef<ToolManager | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType | undefined>(undefined);
  const [showColor, setShowColor] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const toolManager = new ToolManager(ctx);
    toolManagerRef.current = toolManager;

    // Pointer event functions
    const handlePointerDown = (e: PointerEvent) =>
      toolManager.handlePointerDown(e, ctx);
    const handlePointerMove = (e: PointerEvent) =>
      toolManager.handlePointerMove(e, ctx);
    const handlePointerUp = (e: PointerEvent) =>
      toolManager.handlePointerUp(e, ctx);

    // Add listeners
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  useEffect(() => {
    if (!toolManagerRef.current || !activeTool) return;
    toolManagerRef.current.setLineWidth(
      ((activeTool.max - activeTool.min) * progress) / 100 + activeTool.min,
    );
  }, [activeTool, progress]);

  useEffect(() => {
    if (!activeTool) return;
    const defaultProgress =
      ((activeTool.size - activeTool.min) / (activeTool.max - activeTool.min)) *
      100;
    setProgress(Math.ceil(defaultProgress));
  }, [activeTool]);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      {showColor && <ColorBox toolManagerRef={toolManagerRef} />}
      <ToolBox
        setActiveTool={setActiveTool}
        setShowColor={setShowColor}
        canvasRef={canvasRef}
        toolManagerRef={toolManagerRef}
      />
      <Function canvas={canvasRef} />
      {activeTool && (
        <Seekbar
          value={progress}
          onChange={(value: number) => {
            setProgress(value);
            
          }}
          max={activeTool.max}
          min={activeTool.min}
        />
      )}
      <canvas ref={canvasRef} id="canvas"></canvas>
    </div>
  );
};

export default Draw;
