import React from "react";
import ProjectCard from "./ProjectCard";
import { ProjectDataType } from "@repo/common/types";

interface ProjectGridProps {
  projects: ProjectDataType[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <>
      <div
        style={{
          height: "100%",
          border: "1px solid #e2e8f0",
          padding: "4px",
          display: "grid",
          gridTemplateRows: "1fr 48px",
          gap: "5px",
        }}
      >
        <div
          style={{
            border: "1px solid #e2e8f0",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(266px, 1fr))",
            gridAutoRows: "minmax(200px, auto)",
            rowGap: "6px",
            columnGap: "8px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {projects.map((el) => {
            return <ProjectCard key={el.id} project={el} />;
          })}
        </div>
        <div
          style={{
            border: "1px solid #e2e8f0",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            backgroundColor: "#f8fafc",
            borderRadius: "6px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            Page <strong>{currentPage}</strong> of{" "}
            <strong>{totalPages || 1}</strong>
          </span>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #cbd5e1",
                backgroundColor: currentPage <= 1 ? "#f1f5f9" : "#ffffff",
                color: currentPage <= 1 ? "#94a3b8" : "#334155",
                cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              style={{
                padding: "6px 12px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #cbd5e1",
                backgroundColor:
                  currentPage >= totalPages ? "#f1f5f9" : "#ffffff",
                color: currentPage >= totalPages ? "#94a3b8" : "#334155",
                cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectGrid;
