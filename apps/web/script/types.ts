export interface ToolManagerType {
  name: string;

  // Optional configuration
  setColor?(color: string): void;
  setStrokeWidth?(width: number): void;

  // Unified pointer events (mouse, touch, stylus)
  onPointerDown(event: PointerEvent, ctx: CanvasRenderingContext2D): void;
  onPointerMove(event: PointerEvent, ctx: CanvasRenderingContext2D): void;
  onPointerUp(event: PointerEvent, ctx: CanvasRenderingContext2D): void;
}

type Point = {
  x: number;
  y: number;
};

type BaseShape = {
  name: "Pencil" | "Ellipse" | "Brush" | "";
  color: string;
};

export type Pencil = BaseShape & {
  coordinates: Point[];
  color: string;
  lineWidth: number;
};

export type Ellipse = BaseShape & {
  name: "Ellipse";
  center: Point;
  radiusX: number;
  radiusY: number;
};

export type Rectrangle = BaseShape & {
  name: "Rectrangle";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StatesType = ImageData;
