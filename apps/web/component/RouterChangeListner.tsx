"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@lib/store/authStore";
import { useShallow } from "zustand/shallow";
import { useCanvasStore } from "@lib/store/canvasStore";

const RouterChangeListner = () => {
  const params = useParams();
  const search = useSearchParams();
  const { clearMessage } = useAuthStore(
    useShallow((state) => ({ clearMessage: state.clearMessage })),
  );
  const { setFullScreenMode } = useCanvasStore(
    useShallow((state) => ({
      setFullScreenMode: state.setFullScreenMode,
    })),
  );
  React.useEffect(() => {
    clearMessage();
    setFullScreenMode(false);
  }, [params, search, clearMessage, setFullScreenMode]); 
  return null;
};

export default RouterChangeListner;
