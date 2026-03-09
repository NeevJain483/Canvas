"use client";
import { useRef, useEffect, useState } from "react";
import { ToolManager } from "../script/tools";
import "./index.css";
import ColorBox from "./ColorBox";
import ToolBox from "./ToolBox";
const Draw = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const toolManagerRef = useRef<ToolManager | null>(null);
  const [showColor,setShowColor] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const toolManager = new ToolManager();
    toolManagerRef.current = toolManager;

    const handleMouseDown = (e: MouseEvent) =>
      toolManager.handleMouseDown(e, ctx);
    const handleMouseMove = (e: MouseEvent) =>
      toolManager.handleMouseMove(e, ctx);
    const handleMouseUp = (e: MouseEvent) => toolManager.handleMouseUp(e, ctx);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      {showColor && <ColorBox toolManagerRef={toolManagerRef}></ColorBox>}
      <ToolBox setShowColor={setShowColor} canvasRef={canvasRef} toolManagerRef={toolManagerRef} />
      <canvas ref={canvasRef} id="canvas"></canvas>
    </div>
  );
};

export default Draw;
