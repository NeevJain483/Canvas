"use client";
import { DrawingCanvas } from "@component/canvas/DrawingCanvas";
import { useProjectStore } from "@lib/store/projectStore";
import { UUID } from "@repo/common/types";
import React, { use, useEffect } from "react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const currentProject = useProjectStore((state) => state.currentProject);
  const fetchProjectById = useProjectStore((state) => state.fetchProjectById);

  useEffect(() => {
    if (
      !currentProject ||
      !currentProject.project ||
      currentProject.project.id !== id
    ) {
      fetchProjectById(id as UUID, {});
    }
  }, [id, currentProject, fetchProjectById]);
  return (
      <DrawingCanvas mode="review" />
  );
};

export default Page;
