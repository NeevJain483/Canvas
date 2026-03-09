export interface Tool {
  name: string;
  setColor?(color: string): void;
  onMouseDown(event: MouseEvent, ctx: CanvasRenderingContext2D): void;
  onMouseMove(event: MouseEvent, ctx: CanvasRenderingContext2D): void;
  onMouseUp(event: MouseEvent, ctx: CanvasRenderingContext2D): void;
}

type Point = {
  x: number;
  y: number;
};

type BaseShape = {
  name: string;
};

type Ellipse = BaseShape & {
  name: "Ellipse";
  center: Point;
  radiusX: number;
  radiusY: number;
};

type Rectrangle = BaseShape & {
  name: "Rectrangle";
  x: number;
  y: number;
  width: number;
  height: number;
};

type Snapshot = BaseShape & {
  image: ImageData;
};

export type ArtObject = Ellipse | Rectrangle | ImageData | Snapshot;
