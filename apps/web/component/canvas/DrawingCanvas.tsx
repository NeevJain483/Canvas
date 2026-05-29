"use client";
import React, { useEffect } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";

import { useCanvasStore } from "@lib/store/canvasStore";
import { useCanvas } from "@lib/hooks/useCanvas";
import "@style/component/dashboard/drawingCanvas.css";
import Toolbar from "@component/canvas/Toolbar";
import { useShallow } from "zustand/shallow";
import ToolSetting from "@component/canvas/ToolSetting";
import More from "@component/canvas/More";
import { useProjectStore } from "@lib/store/projectStore";
import { loadCanvas } from "@lib/utils";

export const DrawingCanvas = () => {
  const { setFullScreenMode, fullScreenMode } = useCanvasStore(
    useShallow((state) => ({
      fullScreenMode: state.fullScreenMode,
      setColor: state.setColor,
      setFullScreenMode: state.setFullScreenMode,
      setBrushSettings: state.setBrushSettings,
    })),
  );

  const currentProject = useProjectStore((state) => state.currentProject);
  const { canvasRef, previewRef } = useCanvas();

  useEffect(() => {
    if (!currentProject || !canvasRef.current || !previewRef.current) return;
    const tempCtx = canvasRef.current.getContext("2d");
    if (!tempCtx) return;

    const { width, height } = currentProject.project;

    if (
      canvasRef.current.width !== width ||
      canvasRef.current.height !== height
    ) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      previewRef.current.width = width;
      previewRef.current.height = height;
    }

    loadCanvas(tempCtx, currentProject);
  }, [currentProject, canvasRef, previewRef]);

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
              cursor: "pointer",
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

        <More canvasEngineRef={canvasRef} />

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

        <canvas
          style={{ border: "2px solid red" }}
          className="main-canvas"
          ref={canvasRef}
        ></canvas>
        <canvas
          style={{ border: "2px solid black" }}
          className="preview-canvas"
          ref={previewRef}
        ></canvas>
        <div></div>
      </div>
    </>
  );
};
