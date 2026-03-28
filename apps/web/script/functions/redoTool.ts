import { replayStroke } from "../replayStates";
import { Stack } from "../stack";
import { StatesType } from "../types";
import { pushUndoState } from "./";

const size = 11;
export const redoStack = new Stack<StatesType>(size);

export function emptyRedoStack() {
  while (redoStack.size() > 0) {
    redoStack.pop();
  }
}

export function pushRedoState(state: StatesType) {
  if (redoStack.size() == size) {
    redoStack.popBottom();
  }
  redoStack.push(state);
}

export function onClickRedoState(ctx: CanvasRenderingContext2D) {
  if (redoStack.size() == 1) return;

  const state = redoStack.pop();
  if (state) {
    pushUndoState(state);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    replayStroke(ctx, redoStack);
  }
}
