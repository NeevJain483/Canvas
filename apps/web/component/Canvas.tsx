"use client";
import { useRef, useEffect, useState } from "react";
import { ToolManager } from "../script/tools";
import { ToolType } from "../script/functions";
import { FaPlus } from "react-icons/fa";
import "./index.css";

import ColorBox from "./ColorBox";
import ToolBox from "./ToolBox";
import Function from "./function";
import Seekbar from "../ui/Seekbar";

const Draw = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const toolManagerRef = useRef<ToolManager | null>(null);
  const beforeShapeRef = useRef<HTMLSpanElement | null>(null);
  const afterShapeRef = useRef<HTMLSpanElement | null>(null);
  const showBoxRef = useRef<HTMLButtonElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType | undefined>(undefined);
  const [showColor, setShowColor] = useState(false);
  const [showBox, setShowBox] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.putImageData(snapshot, 0, 0);
    };

    resizeCanvas();

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
    window.addEventListener("resize", resizeCanvas);

    setTimeout(() => setLoading(false), 500);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", resizeCanvas);
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

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!beforeShapeRef.current) return;
    setDragging(true);
    beforeShapeRef.current.setPointerCapture(e.pointerId);
    beforeShapeRef.current.style.cursor = "grabbing";
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (
      !dragging ||
      !showBoxRef.current ||
      !afterShapeRef.current ||
      !beforeShapeRef.current
    )
      return;
    const x = e.clientX - 9;
    const y = e.clientY - 9;
    beforeShapeRef.current.style.left = `${x - 1}px`;
    beforeShapeRef.current.style.top = `${y}px`;
    afterShapeRef.current.style.left = `${x + 2.5}px`;
    afterShapeRef.current.style.top = `${y + 12}px`;
    showBoxRef.current.style.left = `${x - 12}px`;
    showBoxRef.current.style.top = `${y + 30}px`;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!beforeShapeRef.current) return;
    setDragging(false);
    beforeShapeRef.current.releasePointerCapture(e.pointerId);
    beforeShapeRef.current.style.cursor = "grab";
  };

  // setLoading(false);

  return (
    <>
      {loading && <div className="loading">Loading...</div>}
      <div style={{ height: "100vh", overflow: "hidden" }}>
        {showBox && showColor && <ColorBox toolManagerRef={toolManagerRef} />}
        {showBox && (
          <ToolBox
            setActiveTool={setActiveTool}
            setShowColor={setShowColor}
            canvasRef={canvasRef}
            toolManagerRef={toolManagerRef}
          />
        )}
        {showBox && <Function canvasRef={canvasRef} />}
        {showBox && activeTool && (
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
        <span
          ref={beforeShapeRef}
          className="before-shape"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        ></span>
        <span className="after-shape" ref={afterShapeRef}></span>
        <button
          ref={showBoxRef}
          className="show-all-btn"
          onClick={() =>
            setShowBox((t) => {
              return !t;
            })
          }
        >
          <FaPlus
            size={20}
            style={{
              transform: showBox ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </button>
      </div>
    </>
  );
};

export default Draw;
