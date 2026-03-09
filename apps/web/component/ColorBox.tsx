import React from "react";
import ColorButton from "../app/ui/ColorButton";
import { ToolManager } from "../script/tools";

type ColorBoxType = {
    toolManagerRef: React.RefObject<ToolManager | null>,
}

const ColorBox:React.FC<ColorBoxType> = ({toolManagerRef}) => {
  return (
    <>
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
    </>
  );
};

export default ColorBox;
