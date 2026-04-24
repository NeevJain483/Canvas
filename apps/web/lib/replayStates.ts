import { Stack } from "./stack";
import { StatesType } from "./types";

export function replayStroke(
  ctx: CanvasRenderingContext2D,
  stack: Stack<StatesType>,
) {
  if (stack.isEmpty()) return;
  const snapShot = stack.peek();
  if (snapShot == undefined) return;
  ctx.putImageData(snapShot, 0, 0);
}
