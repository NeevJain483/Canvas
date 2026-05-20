"use client";
import React from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";

import { useCanvasStore } from "../../lib/store/canvasStore";
import { useCanvas } from "../../lib/hooks/useCanvas";
import "../../style/component/dashboard/drawingCanvas.css";
import Toolbar from "./Toolbar";
import { useShallow } from "zustand/shallow";
import ToolSetting from "./ToolSetting";
import More from "./More";

export const DrawingCanvas = () => {
  const { setFullScreenMode, fullScreenMode } = useCanvasStore(
    useShallow((state) => ({
      fullScreenMode: state.fullScreenMode,
      setColor: state.setColor,
      setFullScreenMode: state.setFullScreenMode,
      setBrushSettings: state.setBrushSettings,
    })),
  );

  const { canvasRef, previewRef } = useCanvas();

  return (
    <>
      <div
        className="canvas-container"
        style={{ gridRow: `span ${fullScreenMode ? 2 : 1}` }}
      >
        <div className="full-mode-button">
          <button
            style={{
              padding: "6px",
              backgroundColor: "#c1ccd8",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}
            onClick={() => setFullScreenMode(null)}
          >
            {!fullScreenMode ? (
              <AiOutlineFullscreen size={32} />
            ) : (
              <AiOutlineFullscreenExit size={32} />
            )}
          </button>
        </div>
        <More canvasEngineRef={canvasRef}/>
        {!fullScreenMode && (
          <>
            <div className="toolbar">
              <Toolbar />
            </div>
            <div className="toolsetting">
              <ToolSetting />
            </div>
          </>
        )}
        <canvas className="main-canvas" ref={canvasRef}></canvas>
        <canvas className="preview-canvas" ref={previewRef}></canvas>
        <div></div>
      </div>
    </>
  );
};
