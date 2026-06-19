"use client";
import { useProjectStore } from "@lib/store/projectStore";
import { ProjectDataType, UUID } from "@repo/common/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const ProjectCard = ({
  project,
  type,
}: {
  project: ProjectDataType;
  type?: "solid";
}) => {
  const [isOption, setIsOption] = useState(false);
  const { deleteProject } = useProjectStore(
    useShallow((state) => ({
      deleteProject: state.deleteProject,
    })),
  );
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("click", () => {
      setIsOption(false);
    });
  }, []);

  if (type === "solid")
    return (
      <div className="relative w-fit h-fit">
        {isOption && (
          <div className="absolute right-0 top-0 z-10">
            <Option
              deleteProject={() => deleteProject(project.id as UUID)}
              edit={() => router.push(`projects/${project.id}/edit`)}
              settings={()=>router.push(`projects/${project.id}/settings`)}
            />
          </div>
        )}
        <Link
          href={`/dashboard/projects/${project.id}/edit`}
          className="border border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden hover:border-primary/40 transition-all flex flex-col h-85"
        >
          <div className="aspect-video relative overflow-hidden bg-surface-container-high">
            <img
              className="w-full h-full object-cover"
              src={"/canvas/alternate.png"}
            />
          </div>
          <div className="p-md flex-1 flex flex-col justify-between">
            <h3 className="font-headline-md text-body-lg text-on-surface truncate">
              {project.title}
            </h3>
            <div className="flex items-center justify-between border-t border-white/5 pt-md">
              <span className="text-label-md text-on-surface-variant">
                Edited recently
              </span>
              <button
                className="material-symbols-outlined p-2 border border-[rgba(255,255,255,0.08)] shadow-sm shadow-primary bg-primary/10 rounded-xl"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOption(!isOption);
                }}
              >
                more_vert
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  return (
    <Link
      href={`dashboard/projects/${project.id}/edit`}
      className="inline-block border border-[rgba(255,255,255,0.1)] w-full rounded-xl overflow-hidden"
    >
      <div className="aspect-video relative overflow-hidden bg-surface-container-high">
        <img
          className="w-full h-full object-cover"
          src={"/canvas/alternate.png"}
        />
      </div>
      <p className="text-[18px] p-2 pb-6">
        {project.title || "Untitled Project"}
      </p>
    </Link>
  );
};

type OptionType = {
  deleteProject: () => void;
  edit: () => void;
  settings: () => void;
};

const Option: React.FC<OptionType> = ({ deleteProject, edit, settings }) => {
  return (
    <>
      <div className="w-fit bg-neutral-950 border border-white/10 rounded-xl p-1.5 shadow-2xl flex flex-col gap-0.5 backdrop-blur-md">
        {/* --- Management Actions Group --- */}
        <button
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-neutral-300 rounded-lg hover:bg-white/5 active:scale-[0.98] transition-all duration-150 group"
          onClick={(e) => {
            e.stopPropagation();
            edit();
          }}
        >
          <span className="material-symbols-outlined text-base text-neutral-500 group-hover:text-primary transition-colors">
            edit
          </span>
          Edit&nbsp;Project
        </button>

        <button
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 active:scale-[0.98] transition-all duration-150 group"
          onClick={(e) => {
            e.stopPropagation();
            deleteProject();
          }}
        >
          <span className="material-symbols-outlined text-base text-red-400/50 group-hover:text-red-400 transition-colors">
            delete
          </span>
          Delete
        </button>
        <button
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 active:scale-[0.98] transition-all duration-150 group"
          onClick={(e) => {
            e.stopPropagation();
            settings();
          }}
        >
          <span className="material-symbols-outlined text-base text-red-400/50 group-hover:text-red-400 transition-colors">
            settings
          </span>
          Setting
        </button>
      </div>
    </>
  );
};

export default ProjectCard;
