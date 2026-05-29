"use client";
import React, { useEffect, useState } from "react";
import { useCanvasStore } from "@lib/store/canvasStore";

const ToolThicknessSlider = () => {
  const [min, setMin] = useState<number>(2);
  const [max, setMax] = useState<number>(48);

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
    if (currentTool === "brush") {
      setMin(2);
      setMax(48);
    } else {
      setMin(2);
      setMax(16);
      // Clamp brush size to new max if needed
      if (brushSize > 16) {
        setBrushSettings({ brushSize: 16 });
      }
    }
  }, [currentTool, brushSize, setBrushSettings]);

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
        value={brushSize || 8}
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
