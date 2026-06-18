"use client";
import ProjectCard from "@component/projects/ProjectCard";
import { useAuthStore } from "@lib/store/authStore";
import { useProjectStore } from "@lib/store/projectStore";
import Link from "next/link";
import React, { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    })),
  );
  const { projects, fetchProjects } = useProjectStore(
    useShallow((state) => ({
      projects: state.projects,
      fetchProjects: state.fetchProjects,
    })),
  );

  useEffect(() => {
    if (!projects) fetchProjects(1, 12);
  }, [fetchProjects,projects]);

  return (
    <>
      <main className="pt-20 px-6 w-full max-h-screen flex flex-col">
        <h1 className="text-[48px] font-semibold">
          Welcome,{user?.firstName || user?.username}
        </h1>
        <p className="text-primary/60">Your creative workspace is ready.</p>
        <section className="py-3 grid grid-cols-3 flex-1">
          <div className="col-span-2 flex flex-col">
            <div className="grid grid-cols-3 gap-4 py-4 items-center justify-center">
              <Link
                href={"/dashboard/projects/new"}
                className="flex flex-col col-span-1 border rounded-xl border-[rgba(255,255,255,0.08)] w-fit px-6 py-4 gap-3 bg-on-tertiary/40"
              >
                <span className="flex justify-center items-center bg-surface-bright/50 w-fit p-2 text-primary-fixed-dim border rounded-xl border-[rgba(255,255,255,0.08)]">
                  <span className="material-symbols-outlined">draw</span>
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold">New Canvas</h3>
                  <p className="text-[14px] font-medium text-primary/30">
                    Start form zero
                  </p>
                </div>
              </Link>
              <button className="flex flex-col col-span-1 border rounded-xl border-[rgba(255,255,255,0.08)] w-fit px-6 py-4 gap-3 bg-on-tertiary/40 hover:cursor-pointer">
                <span className="flex justify-center items-center bg-surface-bright/50 w-fit p-2 text-primary-fixed-dim border rounded-xl border-[rgba(255,255,255,0.08)]">
                  <span className="material-symbols-outlined">upload_file</span>
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold">Import Sketch</h3>
                  <p className="text-[14px] font-medium text-primary/30 text-start">
                    PSD,AI,SVG
                  </p>
                </div>
              </button>
              <Link
                href={"/gallery"}
                className="flex flex-col col-span-1 border rounded-xl border-[rgba(255,255,255,0.08)] w-fit px-6 py-4 gap-3 bg-on-tertiary/40"
              >
                <span className="flex justify-center items-center bg-surface-bright/50 w-fit p-2 text-primary-fixed-dim border rounded-xl border-[rgba(255,255,255,0.08)]">
                  <span className="material-symbols-outlined">explore</span>
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold">Gallery</h3>
                  <p className="text-[14px] font-medium text-primary/30">
                    UI/UX, Illustration
                  </p>
                </div>
              </Link>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center py-3 pr-6">
                <h2 className="text-[32px]">Recent Projects</h2>
                <Link
                  href={"/dashboard/projects"}
                  className="text-primary-fixed-dim hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 flex-1">
                <div className="col-span-1">
                  {projects[0] && <ProjectCard project={projects[0]} />}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 p-4">
            <div className="p-4 w-full h-full border rounded-xl border-[rgba(255,255,255,0.2)]">
              <h2 className="text-[24px] bont-semibold">Creative Activity</h2>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Page;
