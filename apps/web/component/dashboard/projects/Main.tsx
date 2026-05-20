"use client";
import React, { useEffect } from "react";
import { useProjectStore } from "@lib/store/projectStore";
import { UUID } from "crypto";
import { useAuthStore } from "@lib/store/authStore";
import { useShallow } from "zustand/shallow";
import { DrawingCanvas } from "@component/canvas/DrawingCanvas";

type Input = {
  id: string;
};

const Main: React.FC<Input> = ({ id }) => {
  const { currentProject, fetchProjectById } = useProjectStore(
    useShallow((state) => ({
      currentProject: state.currentProject,
      fetchProjectById: state.fetchProjectById,
    })),
  );
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    (async () => {
      await fetchProjectById(id as UUID, {});
    })();
  }, [fetchProjectById, id]);

  if (user?.id == currentProject?.owner_id) {
    console.log("ower");
  }

  return (
    <>
      <DrawingCanvas />
    </>
  );
};

export default Main;
