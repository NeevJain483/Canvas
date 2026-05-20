"use client";
import React from "react";
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/navigation";

import "@style/component/dashboard/recentactivity.css";
import { useProjectStore } from "@lib/store/projectStore";
import { useShallow } from "zustand/shallow";
import Card from "../common/Card";

const RecentActivity = () => {
  const router = useRouter();
  const { projects, fetchProjects } = useProjectStore(
    useShallow((state) => ({
      projects: state.projects,
      fetchProjects: state.fetchProjects,
    })),
  );

  React.useEffect(() => {
    (async () => {
      await fetchProjects(1, 3);
    })();
  }, [fetchProjects]);

  React.useEffect(() => {
    console.log("Projects updated in store: ", projects);
  }, [projects]);

  return (
    <>
      <div className="recent-activity">
        <button
          onClick={() => router.push("/dashboard/projects/new")}
          className="recent-activity-card recent-activity-card-create-new"
        >
          <IoMdAdd size={48} />
          <p>Create new 2D design</p>
        </button>
        {projects.map((el, idx) => {
          return <Card key={idx} src={el.thumbnail_url || ""} title={el.title}></Card>;
        })}
      </div>
    </>
  );
};

export default RecentActivity;
