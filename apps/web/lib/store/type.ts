import { UUID } from "crypto";

export type ToolState = {
  currentTool:
    | "brush" // Standard freehand
    | "pencil" // Hard-edged freehand
    | "eraser" // Destination-out drawing
    | "rect" // Shape: Rectangle
    | "ellipse" // Shape: Circle/Ellipse
    | "line" // Shape: Straight line
    | "fill" // Bucket fill (Flood fill)
    | "text" // Text input
    | "pan" // View manipulation
    | "select";
  brushSize: number; // give it a range from 1 to 100
  brushOpacity: number; // give it a range from 0 to 1
  brushHardness: number; // give it a range from 0 to 1
  currentColor: string; // can be hex or rgb only
  brushBlendMode: "normal" | "multiply" | "screen" | "overlay";
};

type Coordinates = {
  startPos: {
    x: number;
    y: number;
  };
  lastPos: {
    x: number;
    y: number;
  };
  currentPos: {
    x: number;
    y: number;
  };
};

type ShapeSetting = {
    fillShape:boolean;
    snapToGrid:boolean;
}

export type State = ToolState & Coordinates & ShapeSetting;

export type Layer = {
  uuid: UUID;
  name: string;
  hidden: boolean;
  states: State[];
  locked: boolean;
};

export type Project = {
  project_id: UUID;
  last_state: {
    layers: Layer[];
    current_layer_id: UUID;
    zoom: number;
    pan: { x: number; y: number };
  };
  last_updated: Date;
  updated_by: UUID;
};

// Tool settings
