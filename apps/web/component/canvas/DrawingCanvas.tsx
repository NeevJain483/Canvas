"use client";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";

import { useCanvasStore } from "@lib/store/canvasStore";
import { useCanvas } from "@lib/hooks/useCanvas";
import Toolbar from "@component/canvas/Toolbar";
import { useShallow } from "zustand/shallow";
import ToolSetting from "@component/canvas/ToolSetting";
import More from "@component/canvas/More";
import { useProjectStore } from "@lib/store/projectStore";
import { loadCanvas } from "@lib/utils";
import { ExportCanvas } from "@lib/canvas/export";

export const DrawingCanvas = ({ mode }: { mode: "edit" | "review" }) => {
  // const { setColor, setBrushSettings } = useCanvasStore(
  //   useShallow((state) => ({
  //     setColor: state.setColor,
  //     setBrushSettings: state.setBrushSettings,
  //   })),
  // );

  const currentProject = useProjectStore((state) => state.currentProject);
  const { canvasRef, previewRef } = useCanvas();
  const reviewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!currentProject || !canvasRef.current || !previewRef.current) return;
    const tempCtx = canvasRef.current.getContext("2d");
    if (!tempCtx) return;

    const { width, height } = currentProject.project;
    // const width = 3840;
    // const height = 2160;

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
  }, [currentProject?.project.id, canvasRef, previewRef]);

  useEffect(() => {
    if (!currentProject || !reviewCanvasRef.current) return;
    const tempCtx = reviewCanvasRef.current.getContext("2d");
    if (!tempCtx) return;

    const { width, height } = currentProject.project;
    // 3840 x 2160
    // const width = 3840;
    // const height = 2160;

    if (
      reviewCanvasRef.current.width !== width ||
      reviewCanvasRef.current.height !== height
    ) {
      reviewCanvasRef.current.width = width;
      reviewCanvasRef.current.height = height;
    }

    loadCanvas(tempCtx, currentProject);
  }, [currentProject, reviewCanvasRef]);

  // return (
  //   <>
  //     <div
  //       className="canvas-container"
  //       style={{ gridRow: `span ${fullScreenMode ? 2 : 1}` }}
  //     >
  //       <div className="full-mode-button">
  //         <button
  //           style={{
  //             padding: "6px",
  //             backgroundColor: "#c1ccd8",
  //             borderRadius: "8px",
  //             border: "1px solid #e2e8f0",
  //             cursor: "pointer",
  //           }}
  //           onClick={() => setFullScreenMode(null)}
  //         >
  //           {!fullScreenMode ? (
  //             <AiOutlineFullscreen size={32} />
  //           ) : (
  //             <AiOutlineFullscreenExit size={32} />
  //           )}
  //         </button>
  //       </div>

  //       <More canvasEngineRef={canvasRef} />

  //       {!fullScreenMode && (
  //         <>
  //           <div className="toolbar">
  //             <Toolbar />
  //           </div>
  //           <div className="toolsetting">
  //             <ToolSetting />
  //           </div>
  //         </>
  //       )}

  //       <canvas
  //         style={{ border: "2px solid red" }}
  //         className="main-canvas"
  //         ref={canvasRef}
  //       ></canvas>
  //       <canvas
  //         style={{ border: "2px solid black" }}
  //         className="preview-canvas"
  //         ref={previewRef}
  //       ></canvas>
  //       <div></div>
  //     </div>
  //   </>
  // );
  if (mode === "edit")
    return (
      <main className="flex w-screen h-screen justify-between items-center">
        {mode === "edit" && <Toolbar />}
        <section className="flex justify-center items-center">
          <div className="relative flex-1">
            <canvas
              className="main-canvas w-[1080px] h-[720px]"
              ref={mode === "edit" ? canvasRef : reviewCanvasRef}
            ></canvas>
            {mode === "edit" && (
              <canvas
                className="preview-canvas absolute top-0 left-0 z-10 border w-[1080px] h-[720px]"
                ref={previewRef}
              ></canvas>
            )}
          </div>
        </section>
        {mode === "edit" && <ToolSetting />}
      </main>
    );
  if (mode === "review")
    return (
      <main className="flex w-screen h-screen justify-center items-center">
        <section className="flex justify-center items-center flex-1">
          <canvas
            className="main-canvas w-[1080px] h-[720px]"
            ref={reviewCanvasRef}
          ></canvas>
        </section>
        <section>
          {/* --- Export Actions Group --- */}
          <div className="px-3 py-1 text-[10px] font-bold text-neutral-500 uppercase tracking-wider select-none">
            Export Canvas
          </div>

          <button
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-neutral-300 rounded-lg hover:bg-white/5 active:scale-[0.98] transition-all duration-150 group"
            onClick={(e) => {
              e.stopPropagation();
              if (canvasRef && canvasRef.current)
                ExportCanvas.saveAs(canvasRef.current, "png");
              if (reviewCanvasRef && reviewCanvasRef.current)
                ExportCanvas.saveAs(reviewCanvasRef.current, "png");
            }}
          >
            <div className="flex items-center gap-3 mr-1">
              <span className="material-symbols-outlined text-base text-neutral-500 group-hover:text-cyan-400 transition-colors">
                image
              </span>
              Export as PNG
            </div>
            <span className="text-[10px] text-neutral-500 bg-neutral-900 border border-white/5 px-1.5 py-0.5 rounded uppercase font-mono group-hover:border-cyan-400/20 group-hover:text-cyan-400 transition-colors">
              Lossless
            </span>
          </button>

          <button
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-neutral-300 rounded-lg hover:bg-white/5 active:scale-[0.98] transition-all duration-150 group"
            onClick={(e) => {
              e.stopPropagation();
              if (canvasRef && canvasRef.current)
                ExportCanvas.saveAs(canvasRef.current, "webp");
              if (reviewCanvasRef && reviewCanvasRef.current)
                ExportCanvas.saveAs(reviewCanvasRef.current, "webp");
            }}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-base text-neutral-500 group-hover:text-cyan-400 transition-colors">
                photo_library
              </span>
              Export as WebP
            </div>
            <span className="text-[10px] text-neutral-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase font-mono">
              Fast
            </span>
          </button>

          <button
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-neutral-300 rounded-lg hover:bg-white/5 active:scale-[0.98] transition-all duration-150 group"
            onClick={(e) => {
              e.stopPropagation();
              if (canvasRef && canvasRef.current)
                ExportCanvas.saveAs(canvasRef.current, "jpeg");
              if (reviewCanvasRef && reviewCanvasRef.current)
                ExportCanvas.saveAs(reviewCanvasRef.current, "jpeg");
            }}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-base text-neutral-500 group-hover:text-cyan-400 transition-colors">
                collections
              </span>
              Export as JPG
            </div>
            <span className="text-[10px] text-neutral-500 bg-neutral-900 border border-white/5 px-1.5 py-0.5 rounded uppercase font-mono">
              Flat
            </span>
          </button>
        </section>
      </main>
    );
};
