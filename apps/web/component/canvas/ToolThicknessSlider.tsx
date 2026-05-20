"use client";
import React, { useEffect, useState } from "react";
import { useCanvasStore } from "@lib/store/canvasStore";

const ToolThicknessSlider = () => {
  const [min, setMin] = useState<number>(2);
  const [max, setMax] = useState<number>(20);

  const brushSize = useCanvasStore((state) => state.brushSize);
  const currentTool = useCanvasStore((state) => state.currentTool);
  const setBrushSettings = useCanvasStore((state) => state.setBrushSettings);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize)) {
      setBrushSettings({ brushSize: newSize });
    }
  };

  useEffect(() => {
    switch (currentTool) {
      case "brush":
        setMin(2);
        setMax(48);
        break;

      default:
        setMin(2);
        setMax(16);
        setBrushSettings({brushSize:(min+max)/2})
        break;
    }
  }, [currentTool]);

  return (
    <div
      className="tool-slider"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px",
        fontFamily: "sans-serif",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#475569",
          minWidth: "80px",
        }}
      >
        Thickness: <strong style={{ color: "#2563eb" }}>{brushSize}px</strong>
      </span>

      <input
        type="range"
        min={min}
        max={max}
        value={brushSize || (min + max) / 2}
        onChange={handleSliderChange}
        style={{
          cursor: "pointer",
          flex: "1",
          accentColor: "#2563eb", // Themes the slider track handle cleanly
        }}
      />
    </div>
  );
};

export default ToolThicknessSlider;
