"use client";
import { useProjectStore } from "@lib/store/projectStore";
import { ProjectDataType, UUID } from "@repo/common/types";
import { MoreBtn, OptionForMore } from "@ui/MoreBtn";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { IconType } from "react-icons";
import { IoImageOutline } from "react-icons/io5";
import {
  MdOutlineEdit,
  MdOutlineDeleteOutline,
  MdOutlineExpandMore,
} from "react-icons/md";
import { useShallow } from "zustand/shallow";

const ProjectCard = ({ project }: { project: ProjectDataType }) => {
  const [toggle, setToggle] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { deleteProject } = useProjectStore(
    useShallow((state) => ({
      deleteProject: state.deleteProject,
    })),
  );

  const optionsConfig: {
    icon: IconType;
    format: {
      iconColor: string;
      label: string;
    };
    action: () => void;
  }[] = [
    {
      icon: MdOutlineEdit,
      format: {
        iconColor: "#475569",
        label: "Edit",
      },
      action: () => router.push(`/dashboard/projects/${project.id}/edit`),
    },
    {
      icon: MdOutlineDeleteOutline,
      format: {
        iconColor: "#ef4444",
        label: "Delete",
      },
      action: async () => {
        deleteProject(project.id as UUID);
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        maxHeight: "200px",
        maxWidth: "266px",
        height: "100%",
        justifySelf: "center",
        width: "100%",
      }}
      ref={dropdownRef}
    >
      <div
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          zIndex: 4,
        }}
      >
        <MoreBtn
          icon={MdOutlineExpandMore}
          onClick={(e) => {
            e.stopPropagation();
            setToggle(!toggle);
          }}
        />

        {toggle && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "0px",
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "4px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              minWidth: "120px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {optionsConfig.map((el) => (
              <div
                key={el.format.label}
                onClick={(e) => {
                  e.stopPropagation();
                  el.action();
                  setToggle(false);
                }}
                style={{ cursor: "pointer" }}
              >
                <OptionForMore format={el.format} icon={el.icon} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: "100%" }}>
        <button
          className="recent-activity-card"
          style={{
            cursor: "pointer",
            width: "100%",
            height: "100%",
            textAlign: "left",
            border: "none",
            background: "none",
            padding: 0,
          }}
          onClick={() => {
            router.push(`/dashboard/projects/${project.id}/edit`);
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              borderRadius: "6px",
            }}
          >
            {project.thumbnail_url ? (
              <Image
                src={project.thumbnail_url}
                alt={project.title || "Project preview"}
                sizes="100vw"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                }}
              >
                <IoImageOutline size={48} />
              </div>
            )}
          </div>

          <p style={{ marginTop: "8px", fontWeight: 500, color: "#1e293b" }}>
            {project.title || "Untitled Project"}
          </p>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
