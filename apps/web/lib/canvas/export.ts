export type ExportFormat = "png" | "jpeg" | "webp";

export const ExportCanvas = {
  saveAs: (mainCanvas: HTMLCanvasElement, format: "png" | "webp" | "jpeg") => {
    const offscreen = document.createElement("canvas");
    offscreen.width = mainCanvas.width;
    offscreen.height = mainCanvas.height;

    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);

    ctx.drawImage(mainCanvas, 0, 0);

    const link = document.createElement("a");

    const fileExtension = format === "jpeg" ? "jpg" : format;
    link.download = `drawing-${Date.now()}.${fileExtension}`;

    link.href = offscreen.toDataURL(`image/${format}`, 1.0);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
