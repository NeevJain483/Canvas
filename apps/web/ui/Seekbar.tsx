"use client";
import React, { useRef, useEffect } from "react";
import "./index.css";

type SeekbarProps = {
  value: number;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
};

const Seekbar: React.FC<SeekbarProps> = ({
  value,
  onChange,
  max = 48,
  min = 2,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);

  const getValue = (clientY: number) => {
    if (!trackRef.current) return value;

    const rect = trackRef.current.getBoundingClientRect();
    let percent = (rect.bottom - clientY) / rect.height;

    percent = Math.max(0, Math.min(1, percent));

    return min + percent * (max - min);
  };

  const handleClick = (e: React.MouseEvent) => {
    onChange(Math.floor(getValue(e.clientY)));
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      onChange(Math.floor(getValue(e.clientY)));
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onChange]);

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="seekbar-container">
      <div className="seekbar-track" ref={trackRef} onClick={handleClick}>
        <div
          className="seekbar-fill"
          style={{ height: `${percent}%` }}
        />
        <div
          className="seekbar-thumb"
          style={{ bottom: `${percent}%` }}
          onMouseDown={handleMouseDown}
        />
      </div>

      <div>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default Seekbar;