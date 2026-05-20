import React from "react";
import ToolThicknessSlider from "./ToolThicknessSlider";
import ToolColorSelector from "./ToolColorSelector";

const ToolSetting = () => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 4,
          right: "50%",
          translate: "50%",
          display: "flex",
          alignItems: "center",
          top: "8px",
          gap: "6px",
          padding: "6px",
          backgroundColor: "#e9f4ff",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        <ToolColorSelector />
        <ToolThicknessSlider />
      </div>
    </>
  );
};

export default ToolSetting;
