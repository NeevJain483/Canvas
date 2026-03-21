import React, { ReactNode } from "react";
import { Tool } from "../script/types";

import "./index.css";

type ToolButton = {
  label: ReactNode;
  createTool: () => Tool;
  setTool(tool: Tool): void;
};
const ToolButton = ({ label, createTool, setTool }: ToolButton) => {
  return (
    <div>
      <button className="tool-button" onClick={() => setTool(createTool())}>
        {label}
      </button>
    </div>
  );
};

export default ToolButton;
