import React, { RefObject } from "react";
import { onClickRedoState, onClickUndoState } from "../script/functions";
import { IoIosUndo, IoIosRedo } from "react-icons/io";

type FunctionType = {
  canvas: RefObject<HTMLCanvasElement | null>;
};

const Function: React.FC<FunctionType> = ({ canvas }) => {
  return (
    <div id="function-box">
      <button className="function-btn redo-btn"
        onClick={() => onClickRedoState(canvas.current!.getContext("2d")!)}
      >
        <IoIosUndo/>
      </button>
      <button className="function-btn undo-btn"
        onClick={() => onClickUndoState(canvas.current!.getContext("2d")!)}
      >
        <IoIosRedo />
      </button>
    </div>
  );
};

export default Function;
