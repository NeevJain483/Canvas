import React, { RefObject } from "react";
import { onClickRedoState, onClickUndoState } from "../script/tools";

type FunctionType = {
  canvas: RefObject<HTMLCanvasElement | null>;
};

const Function: React.FC<FunctionType> = ({ canvas }) => {
  return (
    <div>
      <button
        onClick={() => onClickRedoState(canvas.current!.getContext("2d")!)}
      >
        redo
      </button>
      <button
        onClick={() => onClickUndoState(canvas.current!.getContext("2d")!)}
      >
        undo
      </button>
    </div>
  );
};

export default Function;
