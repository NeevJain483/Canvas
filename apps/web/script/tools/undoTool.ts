import { replayStroke } from "../replayStates";
import { Stack } from "../stack";
import { StatesType } from "../types";
import { redoStack } from "./redoTool";

const size = 10;
export const undoStack = new Stack<StatesType>(size);

export function pushUndoState(state: StatesType) {
  if (undoStack.isFull()) return;
  undoStack.push(state);
}

export function onClickUndoState(ctx: CanvasRenderingContext2D) {
  if (undoStack.isEmpty()) return;
  const snapShot = undoStack.pop();
  if (!snapShot) return;
  redoStack.push(snapShot);
  replayStroke(ctx,redoStack);
}

export function emptyUndoStack() {
  while (undoStack.size() > 0) {
    undoStack.pop();
  }
}
