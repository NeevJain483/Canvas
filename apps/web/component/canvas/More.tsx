"use client";
import React, { useState, useRef, useEffect } from "react";
import { MdOutlineExpandMore, MdOutlineDownload } from "react-icons/md";
import { ExportFormat, ExportUtils } from "@lib/canvas/export";


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

interface MoreProps {
  canvasEngineRef: React.RefObject<HTMLCanvasElement | null>;
}

const More: React.FC<MoreProps> = ({ canvasEngineRef }) => {
  const [toggle, setToggle] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = (format: ExportFormat) => {
    if (!canvasEngineRef?.current) {
      alert("Canvas element not found for export!");
      return;
    }

    try {
      ExportUtils.saveAs(canvasEngineRef.current, format);
      setToggle(false);
    } catch (error) {
      console.error(`Export to ${format.toUpperCase()} failed:`, error);
    }
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        display: "inline-block",
        top: "65px",
        right: "15px",
        zIndex: 4,
      }}
    >
      <button
        onClick={() => setToggle(!toggle)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          borderRadius: "6px",
          border: "1px solid #cbd5e1",
          backgroundColor: toggle ? "#b8cae2" : "#e2e8f0",
          cursor: "pointer",
          color: "#475569",
          transform: toggle ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease, background-color 0.15s ease",
        }}
        title="More Options"
      >
        <MdOutlineExpandMore size={20} />
      </button>

      {toggle && (
        <div
          style={{
            position: "absolute",
            top: "42px",
            right: 0,
            zIndex: 10,
            minWidth: "160px",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format.id}
              onClick={() => handleExport(format.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "14px",
                fontWeight: 500,
                color: "#334155",
                transition: "background-color 0.1s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <MdOutlineDownload size={18} style={{ color: format.iconColor }} />
              {format.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default More;