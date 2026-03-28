export interface ToolManagerType {
  name: string;
  setColor?(color: string): void;
  setStockWidth?(width: number): void;
  onMouseDown(event: MouseEvent, ctx: CanvasRenderingContext2D): void;
  onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D): void;
  onMouseUp(event: MouseEvent, ctx: CanvasRenderingContext2D): void;
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
