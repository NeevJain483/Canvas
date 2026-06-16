"use client";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/navigation";

import { useProjectStore } from "@lib/store/projectStore";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "@lib/store/authStore";
import { UUID } from "@repo/common/types";
import ProjectCard from "@component/projects/ProjectCard";

const RecentActivity = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { projects, fetchProjectsByUser } = useProjectStore(
    useShallow((state) => ({
      projects: state.projects,
      fetchProjectsByUser: state.fetchProjectsByUser,
    })),
  );

  React.useEffect(() => {
    (async () => {
      if (!user) return;
      await fetchProjectsByUser(user.id as UUID, 1, 3);
    })();
  }, [fetchProjectsByUser, user]);

  React.useEffect(() => {
    console.log("Projects updated in store: ", projects);
  }, [projects]);

  return (
    <>
      <div className="recent-activity">
        <button
          style={{ height: "100%" }}
          onClick={() => router.push("/dashboard/projects/new")}
          className="recent-activity-card recent-activity-card-create-new"
        >
          <IoMdAdd size={48} />
          <p>Create new 2D design</p>
        </button>
        {projects.map((el, idx) => {
          return <ProjectCard key={idx} project={el} />;
        })}
      </div>
    </>
  );
};

export default RecentActivity;
