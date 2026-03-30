import React, { RefObject } from "react";
import { onClickRedoState, onClickUndoState } from "../script/functions";
import { IoIosUndo, IoIosRedo } from "react-icons/io";
import { IoSave } from "react-icons/io5";
import { MdSaveAs } from "react-icons/md";
type FunctionType = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

const Function: React.FC<FunctionType> = ({ canvasRef }) => {
  const handleSaveAs = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.png";
    link.click();
  };

  return (
    <div id="function-box">
      <button className="function-btn saveas-btn" onClick={handleSaveAs}>
        <MdSaveAs />
      </button>
      <button
        className="function-btn redo-btn"
        onClick={() => onClickRedoState(canvasRef.current!.getContext("2d")!)}
      >
        <IoIosUndo />
      </button>
      <button
        className="function-btn undo-btn"
        onClick={() => onClickUndoState(canvasRef.current!.getContext("2d")!)}
      >
        <IoIosRedo />
      </button>
    </div>
  );
};

export default Function;
