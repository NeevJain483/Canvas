"use client";
import React, { useState, useRef, useEffect } from "react";
import { MdOutlineExpandMore, MdOutlineDownload } from "react-icons/md";
import { ExportFormat, ExportUtils } from "@lib/canvas/export";
import { MoreBtn, OptionForMore } from "@ui/MoreBtn";
import { FaSave } from "react-icons/fa";

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
      <MoreBtn icon={MdOutlineExpandMore} onClick={() => setToggle(!toggle)} />

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
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {EXPORT_FORMATS.map((format) => (
            <OptionForMore
              key={format.id}
              onClick={() => handleExport(format.id)}
              format={format}
              icon={MdOutlineDownload}
            />
          ))}
          {/* <OptionForMore key={Math.random()} format={{iconColor:"#2563eb",label:"Save"}} onClick={()=>console.log("")} icon={FaSave}/> */}
        </div>
      )}
    </div>
  );
};

export default More;
