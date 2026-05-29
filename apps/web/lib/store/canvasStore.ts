import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type ToolType =
  | "eraser" // Destination-out drawing
  | "brush" // Standard freehand
  | "rectangle" // Shape: Rectangle
  | "ellipse" // Shape: Circle/Ellipse
  | "line"; // Shape: Straight line
// | "pencil" // Hard-edged freehand
// | "fill" // Bucket fill (Flood fill)
// | "pan" // View manipulation
// | "text" // Text input
// | "select"
// | "pen";

export type BrushSettings = {
  brushSize: number; // give it a range from 2 to 48
  brushOpacity: number; // give it a range from 0 to 1
  brushHardness: number; // give it a range from 0 to 1
  currentColor: string; // can be hex or rgb only
  brushBlendMode: GlobalCompositeOperation;
};

type CanvasStoreType = BrushSettings & {
  fullScreenMode: boolean;
  //Drawing State
  currentTool: ToolType;

  // History & Undo/Redo
  canvasHistory: ImageData[];
  canvasHistoryIndex: number;
  maxHistorySize: number;
  isDirty: boolean;

  // Layer Management
  // layers: Layer[];
  // currentLayerId: UUID;
  // layerOrder: UUID[];

  //
  setFullScreenMode(value: boolean | null): void;

  // Drawing Actions
  setTool(tool: ToolType): void;
  setBrushSettings(settings: Partial<BrushSettings>): void;
  setColor(color: string): void;
  setBlendMode(mode: GlobalCompositeOperation): void;

  // History Actions
  addToHistory(state: ImageData): void;
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;

  // Layer Action
  // addLayer(name?: string): UUID;
  // deleteLayer(id: UUID): void;
  // selectLayer(id: UUID): void;
  // reorderLayers(newOrder: UUID[]): void;
  // mergeDown(layerId: UUID): void;
  // duplicateLayer(id: UUID): void;
  // updateLayerProperties(id: UUID, props: LayerProperties): void

  // Batch Operations
  // lockLayer(id: UUID): void;
  // hideLayer(id: UUID): void;
  // renameLayer(id: UUID, name: string): void;
};

export const useCanvasStore = create<CanvasStoreType>()(
  persist(
    immer((set, get) => ({
      fullScreenMode: false,

      // Drawing state
      currentTool: "brush",
      brushSize: 8,
      brushOpacity: 1,
      brushHardness: 0.5,
      currentColor: "#000",
      brushBlendMode: "source-over",

      // History & Undo/Redo
      canvasHistory: [],
      canvasHistoryIndex: -1,
      maxHistorySize: 50,
      isDirty: true,

      //
      setFullScreenMode: (value: boolean | null = null) => {
        set((state) => ({
          fullScreenMode: value === null ? !state.fullScreenMode : value,
        }));
      },

      //Drawing Action
      setTool(tool: ToolType) {
        set((state) => {
          state.currentTool = tool;
        });
      },
      setColor(color: string) {
        console.log("color");
        set((state) => {
          state.currentColor = color;
        });
      },
      setBlendMode(mode: GlobalCompositeOperation) {
        set((state) => {
          state.brushBlendMode = mode;
        });
      },
      setBrushSettings(settings: Partial<BrushSettings>) {
        set((state) => {
          state.brushSize = settings.brushSize ?? state.brushSize;
          state.brushOpacity = settings.brushOpacity ?? state.brushOpacity;
          state.brushHardness = settings.brushHardness ?? state.brushHardness;
          state.currentColor = settings.currentColor ?? state.currentColor;
        });
      },

      //History Action
      addToHistory(imageData: ImageData) {
        set((state) => {
          if (state.canvasHistoryIndex < state.canvasHistory.length - 1) {
            state.canvasHistory = state.canvasHistory.slice(
              0,
              state.canvasHistoryIndex + 1,
            );
          }

          // Add new state
          state.canvasHistory.push(imageData);
          state.canvasHistoryIndex = state.canvasHistory.length - 1;

          // Limit history size
          if (state.canvasHistory.length > state.maxHistorySize) {
            state.canvasHistory.shift();
            state.canvasHistoryIndex = state.canvasHistory.length - 1;
          }

          state.isDirty = true;
        });
      },

      undo() {
        set((state) => {
          if (state.canvasHistoryIndex > 0) {
            state.canvasHistoryIndex--;
            state.isDirty = true;
          }
        });
      },

      redo() {
        set((state) => {
          if (state.canvasHistoryIndex < state.canvasHistory.length - 1) {
            state.canvasHistoryIndex++;
            state.isDirty = true;
          }
        });
      },

      canUndo() {
        return get().canvasHistoryIndex > 0;
      },

      canRedo() {
        return get().canvasHistoryIndex < get().canvasHistory.length - 1;
      },
    })),
    {
      name: "canvas-store",
      partialize: (state) => ({
        currentColor: state.currentColor,
      }),
    },
  ),
);
