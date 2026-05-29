import { ToolLogic } from "@lib/canvas/tools";
import { CanvasElementType, CurrentProjectType } from "@repo/common/types";

export function getCanvasImageAsBase64(canvas: HTMLCanvasElement) {
  if (!canvas) return;
  const base64Image = canvas.toDataURL("image/png");
  console.log(base64Image);
  return base64Image;
}

export function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: CanvasElementType,
) {
  ctx.save();
  
  if (stroke.type === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
  } else {
    ctx.globalCompositeOperation = "source-over";
    if ("color" in stroke) {
      ctx.strokeStyle = stroke.color;
    }
  }

  ctx.lineWidth = stroke.width;
  console.log("Width",stroke.width)

  switch (stroke.type) {
    case "brush":
      ctx.fillStyle = stroke.color;
      ctx.globalAlpha = 1;
      if (stroke.points.length === 1) {
        const point = stroke.points[0]!;
        ToolLogic.brush(
          ctx,
          point,
          point,
          stroke.width,
          0.2,
        );
      } else {
        for (let i = 0; i < stroke.points.length - 1; i++) {
          ToolLogic.brush(
            ctx,
            { x: stroke.points[i]?.x || 0, y: stroke.points[i]?.y || 0 },
            { x: stroke.points[i + 1]?.x || 0, y: stroke.points[i + 1]?.y || 0 },
            stroke.width,
            0.2,
          );
        }
      }
      break;
    case "eraser":
      if (stroke.points.length === 1) {
        const point = stroke.points[0]!;
        ToolLogic.eraser(ctx, point, point);
      } else {
        for (let i = 0; i < stroke.points.length - 1; i++) {
          ToolLogic.eraser(
            ctx,
            { x: stroke.points[i]?.x || 0, y: stroke.points[i]?.y || 0 },
            { x: stroke.points[i + 1]?.x || 0, y: stroke.points[i + 1]?.y || 0 },
          );
        }
      }
      break;
    case "line":
      ToolLogic.line(
        ctx,
        { x: stroke.start_x, y: stroke.start_y },
        { x: stroke.last_x, y: stroke.last_y },
      );
      break;
    case "ellipse":
      ToolLogic.ellipse(
        ctx,
        { x: stroke.start_x, y: stroke.start_y },
        { x: stroke.last_x, y: stroke.last_y },
      );
      break;
    case "rectangle":
      ToolLogic.rectangle(
        ctx,
        { x: stroke.start_x, y: stroke.start_y },
        { x: stroke.last_x, y: stroke.last_y },
      );
      break;
  }
  
  ctx.restore();
}

export function updateCurrentProject(
  currentProject: CurrentProjectType,
  setCurrentProject: (project: CurrentProjectType) => void,
  newStroke: CanvasElementType,
) {
  const updatedProject: CurrentProjectType = {
    ...currentProject,
    canvasState: {
      ...currentProject.canvasState,
      strokes: [...currentProject.canvasState.strokes, newStroke],
    },
  };

  const w = currentProject.project.width;
  const h = currentProject.project.height;

  if (updatedProject.canvasState.strokes.length > 10) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = w;
    canvas.height = h;

    const base64Image = updatedProject.canvasState.baseImageUrl;

    const bakeAndSave = () => {
      const excessCount = updatedProject.canvasState.strokes.length - 10;
      const strokesToBake = updatedProject.canvasState.strokes.slice(0, excessCount);
      const remainingStrokes = updatedProject.canvasState.strokes.slice(excessCount);

      for (const strokeToBake of strokesToBake) {
        drawStroke(ctx, strokeToBake);
      }

      updatedProject.canvasState.strokes = remainingStrokes;
      updatedProject.canvasState.baseImageUrl = canvas.toDataURL("image/png");
      setCurrentProject(updatedProject);
    };

    if (base64Image) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h);
        bakeAndSave();
      };
      img.src = base64Image;
    } else {
      bakeAndSave();
    }
  } else {
    setCurrentProject(updatedProject);
  }
}

export function loadCanvas(
  ctx: CanvasRenderingContext2D,
  currentProject: CurrentProjectType,
) {
  if (!ctx || !currentProject) return;

  const canvas = ctx.canvas;
  const { baseImageUrl, strokes } = currentProject.canvasState;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const drawVectorLayer = () => {
    strokes.forEach((stroke) => {
      // Cleaner architectural abstraction: drawStroke handles its own isolation completely
      drawStroke(ctx, stroke);
    });
  };

  if (baseImageUrl) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawVectorLayer();
    };
    img.src = baseImageUrl;
  } else {
    drawVectorLayer();
  }
}