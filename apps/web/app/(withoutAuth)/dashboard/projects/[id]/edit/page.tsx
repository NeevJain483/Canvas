"use client";

import { DrawingCanvas } from "@component/canvas/DrawingCanvas";
import { useAuthStore } from "@lib/store/authStore";
import { useProjectStore } from "@lib/store/projectStore";
import { UUID } from "@repo/common/types";
import { useEffect, use } from "react";
import { useShallow } from "zustand/shallow";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { user } = useAuthStore(
    useShallow((state) => ({ user: state.user, error: state.error })),
  );

  const autoSave = useProjectStore((state) => state.autoSave);
  const currentProject = useProjectStore((state) => state.currentProject);
  const fetchProjectById = useProjectStore((state) => state.fetchProjectById);

  useEffect(() => {
    if (!user) return;

    if (
      !currentProject ||
      !currentProject.project ||
      currentProject.project.id !== id
    ) {
      fetchProjectById(id as UUID, { owner_id: user.id });
    }
  }, [id, currentProject, fetchProjectById, user]);

  useEffect(() => {
    if (currentProject?.project.id === id) {
      autoSave();
    }
    return () => {
      const activeId = useProjectStore.getState().autoSaveIntervalId;
      if (activeId) {
        clearInterval(activeId);
        useProjectStore.setState({ autoSaveIntervalId: null });
      }
    };
  }, [autoSave, id, currentProject?.project.id]);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        Please login to view this page.
      </div>
    );
  if (!currentProject?.project || currentProject.project.id !== id)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading project workspace...
      </div>
    );
  if (user.id !== currentProject.project.owner_id)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        You are not authorized to edit this project.
      </div>
    );

  return <DrawingCanvas mode="edit" />;
}
