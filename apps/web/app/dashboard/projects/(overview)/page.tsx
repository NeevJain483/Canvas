"use client";
import ProjectGrid from "@component/projects/ProjectGrid";
import { useAuthStore } from "@lib/store/authStore";
import { useProjectStore } from "@lib/store/projectStore";
import { UUID } from "@repo/common/types";
import React, { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const user = useAuthStore((state) => state.user);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { totalPages, projects, fetchProjectsByUser } = useProjectStore(
    useShallow((state) => ({
      projects: state.projects,
      totalPages: state.totalPages,
      fetchProjectsByUser: state.fetchProjectsByUser,
    })),
  );

  const handleFetch = useCallback(
    (targetPage: number) => {
      if (!user) return;
      fetchProjectsByUser(user.id as UUID, targetPage, 12);
    },
    [fetchProjectsByUser, user],
  );

  useEffect(() => {
    if (!user) return;
    handleFetch(currentPage);
  }, [user]);
  
  return (
    <>
      <ProjectGrid
        projects={projects}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(targetPage) => {
          setCurrentPage(targetPage);
          handleFetch(targetPage);
        }}
      />
    </>
  );
};

export default Page;
