import React from "react";
import ColorButton from "../ui/ColorButton";
import { ToolManager } from "../script/tools";

type ColorBoxType = {
  toolManagerRef: React.RefObject<ToolManager | null>;
};

const ColorBox: React.FC<ColorBoxType> = ({ toolManagerRef }) => {
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
        <ColorButton
          color="#FF7F00"
          setColor={() => toolManagerRef.current!.setColor("#FF7F00")}
        />
        <ColorButton
          color="#FFFF00"
          setColor={() => toolManagerRef.current!.setColor("#FFFF00")}
        />
        <ColorButton
          color="#7FFF00"
          setColor={() => toolManagerRef.current!.setColor("#7FFF00")}
        />
        <ColorButton
          color="#00FF7F"
          setColor={() => toolManagerRef.current!.setColor("#00FF7F")}
        />
        <ColorButton
          color="#00FFFF"
          setColor={() => toolManagerRef.current!.setColor("#00FFFF")}
        />
        <ColorButton
          color="#007FFF"
          setColor={() => toolManagerRef.current!.setColor("#007FFF")}
        />
        <ColorButton
          color="#7F00FF"
          setColor={() => toolManagerRef.current!.setColor("#7F00FF")}
        />
        <ColorButton
          color="#FF00FF"
          setColor={() => toolManagerRef.current!.setColor("#FF00FF")}
        />
        <ColorButton
          color="#FF007F"
          setColor={() => toolManagerRef.current!.setColor("#FF007F")}
        />
      </div>
    </>
  );
};

export default ColorBox;
