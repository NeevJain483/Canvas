import React from "react";
import { CiEraser } from "react-icons/ci";
import { FaBrush, FaRegCircle } from "react-icons/fa6";
import { TbLine } from "react-icons/tb";
import { RiRectangleLine } from "react-icons/ri";
// import { FaPencil, FaPenFancy } from "react-icons/fa6";
// import { TbHandGrab } from "react-icons/tb";
// import { PiPaintBucketFill, PiSelectionPlusBold } from "react-icons/pi";
// import { IoText } from "react-icons/io5";

import ToolButton from "@ui/ToolButton";
import { useShallow } from "zustand/shallow";
import { useCanvasStore } from "@lib/store/canvasStore";

const Toolbar = () => {
  const { currentTool, setTool } = useCanvasStore(
    useShallow((state) => ({
      currentTool: state.currentTool,
      setTool: state.setTool,
    })),
  );

  return (
    <>
      <div
        className="canvas-toolbar"
        style={{
          display: "flex",
          gap: "6px",
          padding: "6px",
          backgroundColor: "#e9f4ff",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        <ToolButton
          onClick={() => setTool("eraser")}
          label={<CiEraser />}
          isActive={currentTool === "eraser"}
        />
        <ToolButton
          onClick={() => setTool("brush")}
          label={<FaBrush />}
          isActive={currentTool === "brush"}
        />
        <ToolButton
          onClick={() => setTool("line")}
          label={<TbLine />}
          isActive={currentTool === "line"}
        />
        <ToolButton
          onClick={() => setTool("ellipse")}
          label={<FaRegCircle />}
          isActive={currentTool === "ellipse"}
        />
        <ToolButton
          onClick={() => setTool("rectangle")}
          label={<RiRectangleLine />}
          isActive={currentTool === "rectangle"}
        />
        {/* <ToolButton onClick={() => setTool("pen")} label={<FaPenFancy />} isActive={currentTool === "pen"} /> */}
        {/* <ToolButton onClick={() => setTool("pencil")} label={<FaPencil />} isActive={currentTool === "pencil"} /> */}
        {/* <ToolButton onClick={() => setTool("pan")} label={<TbHandGrab />} isActive={currentTool === "pan"} /> */}
        {/* <ToolButton
          onClick={() => setTool("select")}
          label={<PiSelectionPlusBold />}
          isActive={currentTool === "select"}
        /> */}
        {/* <ToolButton onClick={() => setTool("text")} label={<IoText />} isActive={currentTool === "text"} /> */}
        {/* <ToolButton onClick={() => setTool("fill")} label={<PiPaintBucketFill />} isActive={currentTool === "fill"} /> */}
      </div>
    </>
  );
};

export default Toolbar;
