"use client";
import ProjectCard from "@component/projects/ProjectCard";
import { useAuthStore } from "@lib/store/authStore";
import { useProjectStore } from "@lib/store/projectStore";
import { UUID } from "@repo/common/types";
import Link from "next/link";
import React, { useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const user = useAuthStore((state) => state.user);
  const { projects, fetchProjectsByUser } = useProjectStore(
    useShallow((state) => ({
      projects: state.projects,
      fetchProjectsByUser: state.fetchProjectsByUser,
    })),
  );

  const handleFetch = useCallback(
    (targetPage: number) => {
      if (!user) return;
      fetchProjectsByUser(user.id as UUID, targetPage, 20);
    },
    [fetchProjectsByUser, user],
  );

  useEffect(() => {
    if (!user) return;
    if (!projects.length) handleFetch(1);
  }, [user]);

  return (
    <main className="pt-24 flex-1">
      <section className="flex flex-col mb-xl px-6">
        <h1 className="text-[32px] font-semibold">Active Projects</h1>
        <p className="text-[14px]">
          Manage and iterate on your latest creative works.
        </p>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-6 gap-6">
        {projects.map((el) => {
          return <ProjectCard key={el.id} project={el} type="solid" />;
        })}
        <Link
          href={"/dashboard/projects/new"}
          className="flex flex-col justify-center items-center border-2 border-[rgba(255,255,255,0.1)] border-dashed rounded-xl overflow-hidden hover:border-primary/40 transition-all h-85 w-full"
        >
          <span className="material-symbols-outlined text-primary mb-md">
            add
          </span>
          <p className="font-label-md uppercase tracking-widest text-[11px]">
            Start New Project
          </p>
        </Link>
      </section>
    </main>
  );
};

export default Page;
