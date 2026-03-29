"use client";
import React, { useRef, useEffect } from "react";
import "./index.css";

type SeekbarProps = {
  value: number;              // actual size in px
  max: number;                // max size for active tool
  min: number;                // min size for active tool
  onChange: (value: number) => void;
};

const Seekbar: React.FC<SeekbarProps> = ({ value, onChange, max, min }) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  const getValue = (clientY: number) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    let percent = (rect.bottom - clientY) / rect.height;
    percent = Math.max(0, Math.min(1, percent));
    return Math.round(min + percent * (max - min));
  };

  const handleClick = (e: React.MouseEvent) => {
    onChange(getValue(e.clientY));
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      onChange(getValue(e.clientY));
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [onChange, min, max]);

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="seekbar-container" style={{ touchAction: "none" }}>
      <div className="seekbar-track" ref={trackRef} onClick={handleClick}>
        <div className="seekbar-fill" style={{ height: `${percent}%` }} />
        <div
          className="seekbar-thumb"
          style={{ bottom: `${percent}%` }}
          onPointerDown={() => {
            isDraggingRef.current = true;
          }}
        />
      </div>
      <div>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default Seekbar;