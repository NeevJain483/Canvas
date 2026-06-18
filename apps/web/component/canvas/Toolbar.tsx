import React from "react";
import { useShallow } from "zustand/shallow";
import { ToolType, useCanvasStore } from "@lib/store/canvasStore";

const Toolbar = () => {
  const { currentTool, setTool } = useCanvasStore(
    useShallow((state) => ({
      currentTool: state.currentTool,
      setTool: state.setTool,
    })),
  );

  const tools = [
    { icon: "ink_eraser", name: "eraser" },
    { icon: "brush", name: "brush" },
    { icon: "diagonal_line", name: "line" },
    { icon: "circle", name: "ellipse" },
    { icon: "rectangle", name: "rectangle" },
  ];

  // return (
  //   <>
  //     <div
  //       className="canvas-toolbar"
  //       style={{
  //         display: "flex",
  //         gap: "6px",
  //         padding: "6px",
  //         backgroundColor: "#e9f4ff",
  //         borderRadius: "8px",
  //         border: "1px solid #e2e8f0",
  //         width: "fit-content",
  //       }}
  //     >
  //       <ToolButton
  //         onClick={() => setTool("eraser")}
  //         label={<CiEraser />}
  //         isActive={currentTool === "eraser"}
  //       />
  //       <ToolButton
  //         onClick={() => setTool("brush")}
  //         label={<FaBrush />}
  //         isActive={currentTool === "brush"}
  //       />
  //       <ToolButton
  //         onClick={() => setTool("line")}
  //         label={<TbLine />}
  //         isActive={currentTool === "line"}
  //       />
  //       <ToolButton
  //         onClick={() => setTool("ellipse")}
  //         label={<FaRegCircle />}
  //         isActive={currentTool === "ellipse"}
  //       />
  //       <ToolButton
  //         onClick={() => setTool("rectangle")}
  //         label={<RiRectangleLine />}
  //         isActive={currentTool === "rectangle"}
  //       />
  //       {/* <ToolButton onClick={() => setTool("pen")} label={<FaPenFancy />} isActive={currentTool === "pen"} /> */}
  //       {/* <ToolButton onClick={() => setTool("pencil")} label={<FaPencil />} isActive={currentTool === "pencil"} /> */}
  //       {/* <ToolButton onClick={() => setTool("pan")} label={<TbHandGrab />} isActive={currentTool === "pan"} /> */}
  //       {/* <ToolButton
  //         onClick={() => setTool("select")}
  //         label={<PiSelectionPlusBold />}
  //         isActive={currentTool === "select"}
  //       /> */}
  //       {/* <ToolButton onClick={() => setTool("text")} label={<IoText />} isActive={currentTool === "text"} /> */}
  //       {/* <ToolButton onClick={() => setTool("fill")} label={<PiPaintBucketFill />} isActive={currentTool === "fill"} /> */}
  //     </div>
  //   </>
  // );
  return (
    <section className="flex flex-col p-6 gap-3 border-r border-r-[rgba(255,255,255,0.1)] h-full">
      {tools.map((el) => {
        return (
          <button
            key={Math.random()}
            onClick={()=>
              setTool(el.name as ToolType)
            }
            className="flex justify-center items-center p-2 border border-[rgba(255,255,255,0.1)] rounded-lg cursor-pointer bg-primary/10 hover:bg-primary/30"
            style={{backgroundColor:el.name === currentTool ? "color-mix(in oklab, var(--color-primary) 30%, transparent)":"transparent"}}
          >
            <span className="material-symbols-outlined">{el.icon}</span>
          </button>
        );
      })}
    </section>
  );
};

export default Toolbar;
