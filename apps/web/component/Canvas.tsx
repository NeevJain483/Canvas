"use client";
import { useRef, useEffect, useState } from "react";
import { ToolManager, ToolType } from "../script/tools";
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
  const [progress, setProgress] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const toolManager = new ToolManager(ctx);
    toolManagerRef.current = toolManager;

    const handleMouseDown = (e: MouseEvent) =>
      toolManager.handleMouseDown(e, ctx);
    const handleMouseMove = (e: MouseEvent) =>
      toolManager.handleMouseMove(e, ctx);
    const handleMouseUp = (e: MouseEvent) => toolManager.handleMouseUp(e, ctx);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    setProgress(3);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!toolManagerRef.current || !activeTool) return;
    toolManagerRef.current.setLineWidth(
      ((activeTool.max - activeTool.min) * progress) / 100 + activeTool.min,
    );
  }, [activeTool, progress]);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      {showColor && <ColorBox toolManagerRef={toolManagerRef}></ColorBox>}
      <ToolBox
        setActiveTool={setActiveTool}
        setShowColor={setShowColor}
        canvasRef={canvasRef}
        toolManagerRef={toolManagerRef}
      />
      <Function canvas={canvasRef}></Function>
      {activeTool && (
        <Seekbar
          value={progress}
          onChange={setProgress}
          max={activeTool?.max}
          min={activeTool?.min}
        />
      )}
      <canvas ref={canvasRef} id="canvas"></canvas>
    </div>
  );
};

export default Draw;
