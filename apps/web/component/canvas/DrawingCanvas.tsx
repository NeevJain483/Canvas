"use client";
import React, { useEffect, useRef } from "react";
import { useCanvas } from "@lib/hooks/useCanvas";
import Toolbar from "@component/canvas/Toolbar";
import ToolSetting from "@component/canvas/ToolSetting";
import { useProjectStore } from "@lib/store/projectStore";
import { loadCanvas } from "@lib/utils";
import DownloadOptions from "@component/canvas/DownloadOptions";

export const DrawingCanvas = ({ mode }: { mode: "edit" | "review" }) => {
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
  if (mode === "edit")
    return (
      <main className="flex w-screen h-screen justify-between items-center">
        <Toolbar />
        <section className="flex justify-center items-center">
          <div className="relative flex-1">
            <canvas
              className="main-canvas w-270 h-180"
              ref={canvasRef}
            ></canvas>
            <canvas
              className="preview-canvas absolute top-0 left-0 z-10 border w-270 h-180"
              ref={previewRef}
            ></canvas>
          </div>
        </section>
        <section className="border-l border-l-[rgba(255,255,255,0.1)] h-full p-4 flex flex-col gap-3">
          <ToolSetting />
          <DownloadOptions
            canvasRef={canvasRef}
            reviewCanvasRef={reviewCanvasRef}
          />
        </section>
      </main>
    );
  if (mode === "review")
    return (
      <main className="flex w-screen h-screen justify-center items-center">
        <section className="flex justify-center items-center flex-1">
          <canvas
            className="main-canvas w-270 h-180"
            ref={reviewCanvasRef}
          ></canvas>
        </section>
        <DownloadOptions
          canvasRef={canvasRef}
          reviewCanvasRef={reviewCanvasRef}
        />
      </main>
    );
};
