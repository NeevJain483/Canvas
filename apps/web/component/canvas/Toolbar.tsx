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
