import React, { SetStateAction } from "react";
import ToolButton from "../ui/ToolButton";
import { CiEraser } from "react-icons/ci";
import { FaBrush, FaPencil, FaRegCircle } from "react-icons/fa6";
import { TbLine } from "react-icons/tb";
import { RiRectangleLine } from "react-icons/ri";
import {
  BrushTool,
  EllipseTool,
  EraserTool,
  LineTool,
  PencilTool,
  RectrangleTool,
  ToolManager,
} from "../script/tools";

type ToolBoxType = {
  toolManagerRef: React.RefObject<ToolManager | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  setShowColor: React.Dispatch<SetStateAction<boolean>>;
};

const ToolBox: React.FC<ToolBoxType> = ({
  canvasRef,
  toolManagerRef,
  setShowColor,
}) => {
  return (
    <>
      <div className="tool-box">
        <ToolButton
          label={<CiEraser />}
          createTool={() => new EraserTool()}
          setTool={(t) => {
            toolManagerRef.current?.setTool(t);
            setShowColor(false);
          }}
        />
        <ToolButton
          label={<FaPencil />}
          createTool={() => new PencilTool()}
          setTool={(t) => {
            toolManagerRef.current?.setTool(t);
            setShowColor(true);
          }}
        />
        <ToolButton
          label={<TbLine />}
          createTool={() =>
            new LineTool(canvasRef.current!.width, canvasRef.current!.height)
          }
          setTool={(t) => {
            toolManagerRef.current?.setTool(t);
            setShowColor(true);
          }}
        />
        <ToolButton
          label={<FaRegCircle />}
          createTool={() =>
            new EllipseTool(canvasRef.current!.width, canvasRef.current!.height)
          }
          setTool={(t) => {
            toolManagerRef.current?.setTool(t);
            setShowColor(true);
          }}
        />
        <ToolButton
          label={<RiRectangleLine />}
          createTool={() =>
            new RectrangleTool(
              canvasRef.current!.width,
              canvasRef.current!.height,
            )
          }
          setTool={(t) => {
            toolManagerRef.current?.setTool(t);
            setShowColor(true);
          }}
        />
        <ToolButton
          label={<FaBrush />}
          createTool={() => new BrushTool()}
          setTool={(t) => {
            toolManagerRef.current?.setTool(t);
            setShowColor(true);
          }}
        />
      </div>
    </>
  );
};

export default ToolBox;
