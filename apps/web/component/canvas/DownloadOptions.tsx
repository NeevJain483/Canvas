"use client";
import { ExportFormat, ExportCanvas } from "@lib/canvas/export";

interface FormatOption {
  id: ExportFormat;
  label: string;
  label_2: string;
  iconColor: string;
}

const EXPORT_FORMATS: FormatOption[] = [
  {
    id: "png",
    label: "Export as PNG",
    label_2: "Lossless",
    iconColor: "#2563eb",
  },
  { id: "jpeg", label: "Export as JPEG", label_2: "", iconColor: "#16a34a" },
  { id: "webp", label: "Export as WEBP", label_2: "", iconColor: "#ea580c" },
];

interface DownloadOptionsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  reviewCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({
  canvasRef,
  reviewCanvasRef,
}) => {
  return (
    <section>
      {/* --- Export Actions Group --- */}
      <div className="text-[12px] font-semibold uppercase mb-1">
        Export Canvas
      </div>
      {EXPORT_FORMATS.map((el) => {
        return (
          <button
            key={el.iconColor}
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
              <span
                className="material-symbols-outlined text-base group-hover:text-cyan-400 transition-colors"
                style={{ color: el.iconColor }}
              >
                download_2
              </span>
              {el.label}
            </div>
          </button>
        );
      })}
    </section>
  );
};

export default DownloadOptions;
