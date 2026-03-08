"use client";
import { useRef, useEffect } from "react";
import {
  PencilTool,
  ToolManager,
  RectrangleTool,
  EllipseTool,
  BrushTool,
  LineTool,
} from "../script/tools";
import ToolButton from "../app/ui/ToolButton";
import { FaRegCircle, FaPencil, FaBrush } from "react-icons/fa6";
import { RiRectangleLine } from "react-icons/ri";
import { TbLine } from "react-icons/tb";
import "./index.css";
import ColorButton from "../app/ui/ColorButton";

const Draw = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const toolManagerRef = useRef<ToolManager | null>(null);

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
      <div className="edit-box">
        <div className="color-box">
          <ColorButton
            color="#000"
            setColor={() => toolManagerRef.current!.setColor("#000")}
          />
          <ColorButton
            color="#fff"
            setColor={() => toolManagerRef.current!.setColor("#fff")}
          />
          <ColorButton
            color="#f00"
            setColor={() => toolManagerRef.current!.setColor("#f00")}
          />
          <ColorButton
            color="#0f0"
            setColor={() => toolManagerRef.current!.setColor("#0f0")}
          />
          <ColorButton
            color="#00f"
            setColor={() => toolManagerRef.current!.setColor("#00f")}
          />
        </div>
        <div className="tool-box">
          <ToolButton
            label={<FaPencil />}
            createTool={() => new PencilTool()}
            setTool={(t) => toolManagerRef.current?.setTool(t)}
          />
          <ToolButton
            label={<TbLine />}
            createTool={() =>
              new LineTool(canvasRef.current!.width, canvasRef.current!.height)
            }
            setTool={(t) => toolManagerRef.current?.setTool(t)}
          />
          <ToolButton
            label={<FaRegCircle />}
            createTool={() =>
              new EllipseTool(
                canvasRef.current!.width,
                canvasRef.current!.height,
              )
            }
            setTool={(t) => toolManagerRef.current?.setTool(t)}
          />
          <ToolButton
            label={<RiRectangleLine />}
            createTool={() =>
              new RectrangleTool(
                canvasRef.current!.width,
                canvasRef.current!.height,
              )
            }
            setTool={(t) => toolManagerRef.current?.setTool(t)}
          />
          <ToolButton
            label={<FaBrush />}
            createTool={() => new BrushTool()}
            setTool={(t) => toolManagerRef.current?.setTool(t)}
          />
        </div>
      </div>
      <canvas ref={canvasRef} id="canvas"></canvas>
    </div>
  );
};

export default Draw;
