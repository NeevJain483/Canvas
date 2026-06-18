"use client";
import React, { ChangeEvent, useEffect, useEffectEvent, useState } from "react";
import ToolThicknessSlider from "@component/canvas/ToolThicknessSlider";
import ToolColorSelector from "@component/canvas/ToolColorSelector";
import { BrushSettings, useCanvasStore } from "@lib/store/canvasStore";
import { useShallow } from "zustand/shallow";

const ToolSetting = () => {
  const [brushData, setBrushData] = useState<Partial<BrushSettings>>({
    brushSize: 18,
    brushOpacity: 1,
    brushHardness: 1,
    currentColor: "#fffff",
  });

  const {
    currentColor,
    setBrushSettings,
    brushHardness,
    brushOpacity,
    brushSize,
  } = useCanvasStore(
    useShallow((state) => ({
      currentColor: state.currentColor,
      setBrushSettings: state.setBrushSettings,
      brushHardness: state.brushHardness,
      brushOpacity: state.brushOpacity,
      brushSize: state.brushSize,
    })),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: number | string;
    if (name === "brushOpacity" || name === "brushHardness") {
      parsedValue = Number(value) / 100;
    } else if (name === "currentColor") {
      parsedValue = value;
    } else parsedValue = Number(value);

    const updatedData = {
      ...brushData,
      [name]: parsedValue,
    };
    setBrushData(updatedData);
    setBrushSettings(updatedData);
  };

  const currentOpacity =
    brushData.brushOpacity !== undefined ? brushData.brushOpacity : 1;
  const currentHardness =
    brushData.brushHardness !== undefined ? brushData.brushHardness : 1;

  const opacityPercent = Math.round(currentOpacity * 100);
  const hardnessPercent = Math.round(currentHardness * 100);

  useEffect(() => {
    setBrushData({
      ...brushData,
      currentColor,
      brushHardness,
      brushOpacity,
      brushSize,
    });
  }, []);

  return (
    <section className="border-l border-l-[rgba(255,255,255,0.1)] h-full p-4 flex flex-col gap-3">
      <h2 className="py-6 uppercase font-semibold border-b border-b-[rgba(255,255,255,0.1)]">
        Inspector
      </h2>

      <div>
        <p className="text-[12px] font-semibold uppercase mb-1">stroke width</p>
        <div className="flex justify-between items-center gap-3 w-54.25">
          <input
            className="w-40 cursor-pointer"
            type="range"
            min="1"
            max="100"
            onChange={handleChange}
            value={brushData.brushSize || 18}
            name="brushSize"
          />
          <span className="tabular-nums">{brushData.brushSize}px</span>
        </div>
      </div>

      <div>
        <p className="text-[12px] font-semibold uppercase mb-1">Opacity</p>
        <div className="flex justify-between items-center gap-3">
          <input
            className="w-40 cursor-pointer"
            type="range"
            min="0"
            max="100"
            onChange={handleChange}
            value={opacityPercent}
            name="brushOpacity"
          />
          <span className="tabular-nums">{opacityPercent}%</span>
        </div>
      </div>
      <div>
        <p className="text-[12px] font-semibold uppercase mb-1">
          Brush Hardness
        </p>
        <div className="flex justify-between items-center gap-3">
          <input
            className="w-40 cursor-pointer"
            type="range"
            min="0"
            max="100"
            onChange={handleChange}
            value={hardnessPercent}
            name="brushHardness"
          />
          <span className="tabular-nums">{hardnessPercent}%</span>
        </div>
      </div>
      <div>
        <p className="text-[12px] font-semibold uppercase mb-1">Color Picker</p>
        <div className="flex justify-center items-center gap-3">
          <input
            className="w-10 h-10 cursor-pointer"
            type="color"
            onChange={handleChange}
            value={brushData.currentColor}
            name="currentColor"
          />
        </div>
      </div>
    </section>
  );
};

export default ToolSetting;
