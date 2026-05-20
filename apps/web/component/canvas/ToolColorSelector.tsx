import React from "react";
import { useCanvasStore } from "../../lib/store/canvasStore";

const PALETTE_COLORS = [
  "#000000", // Black
  "#ffffff", // White
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#64748b", // Slate Gray
];

const ToolColorSelector = () => {
  const currentColor = useCanvasStore((state) => state.currentColor);
  const setColor = useCanvasStore((state) => state.setColor);

  return (
    <div
      className="color-selector-wrapper"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "4px",
      }}
    >
      <div
        className="color-grid"
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          maxWidth: "240px",
        }}
      >
        {PALETTE_COLORS.map((color) => {
          const isActive = currentColor?.toLowerCase() === color.toLowerCase();

          return (
            <button
              key={color}
              title={color}
              onClick={() => setColor(color)}
              className={`color-btn ${isActive ? "active" : ""}`}
              style={{
                backgroundColor: color,
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                cursor: "pointer",
                border: isActive ? "3px solid #3b82f6" : "1px solid #cbd5e1",
                outline: isActive ? "2px solid white" : "none",
                transform: isActive ? "scale(1.1)" : "scale(1)",
                transition:
                  "transform 0.1s ease, border-color 0.1s ease, outline 0.1s ease",
              }}
            />
          );
        })}
      </div>
      <div
        className="custom-picker"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderLeft: "1px solid #e2e8f0",
          borderRight: "1px solid #e2e8f0",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#64748b",
            userSelect: "none",
          }}
        >
          Custom:
        </span>
        <input
          type="color"
          value={currentColor?.startsWith("#") ? currentColor : "#000000"}
          onChange={(e) => setColor(e.target.value)}
          style={{
            cursor: "pointer",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            width: "44px",
            height: "32px",
            padding: "0 2px",
            backgroundColor: "transparent",
          }}
        />
      </div>
    </div>
  );
};

export default ToolColorSelector;
