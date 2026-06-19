"use client";
import { ExportFormat, ExportCanvas } from "@lib/canvas/export";

interface FormatOption {
  id: ExportFormat;
  label: string;
  iconColor: string;
}

const EXPORT_FORMATS: FormatOption[] = [
  { id: "png", label: "Export PNG", iconColor: "#2563eb" },
  { id: "jpeg", label: "Export JPEG", iconColor: "#16a34a" },
  { id: "webp", label: "Export WEBP", iconColor: "#ea580c" },
];

interface DownloadOptionsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  reviewCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ canvasRef, reviewCanvasRef }) => {
  return (
    <section>
      {/* --- Export Actions Group --- */}
      <div className="text-[12px] font-semibold uppercase mb-1">
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
  );
};

export default DownloadOptions;
