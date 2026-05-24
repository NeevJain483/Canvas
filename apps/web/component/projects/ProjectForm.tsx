"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useProjectStore } from "@lib/store/projectStore";

type ProjectFormState = {
  title: string;
  description: string;
  thumbnail_url: string;
  is_public: boolean;
  width: number;
  height: number;
  dpi: number;
  color_mode: "RGB" | "CMYK" | "Grayscale";
  background_color: string;
};

const ProjectForm = () => {
  const [form, setForm] = useState<ProjectFormState>({
    title: "",
    description: "",
    thumbnail_url: "",
    is_public: false,
    width: 1920,
    height: 1080,
    dpi: 72,
    color_mode: "RGB",
    background_color: "#ffffff",
  });

  const router = useRouter();

  const { createProject } = useProjectStore(
    useShallow((state) => ({
      createProject: state.createProject,
    })),
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!form.title.trim()) return alert("Please provide a project title.");

      const projectId = await createProject(form);
      router.push(`/dashboard/projects/${projectId}/edit`);
    } catch (error) {
      console.error("Failed to compile project creation:", error);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    let processedValue: string | number | boolean = value;

    if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      processedValue = value === "" ? 0 : Number(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "540px",
        margin: "40px auto",
        padding: "32px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: "#0f172a",
            margin: "0 0 6px 0",
          }}
        >
          Create New Canvas
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Configure your document parameters for your drawing canvas.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Project Title Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            style={{ fontSize: "13px", fontWeight: 500, color: "#475569" }}
          >
            Project Title
          </label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Landscape Vector Illustration"
            style={inputStyle}
          />
        </div>

        {/* Project Description Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            style={{ fontSize: "13px", fontWeight: 500, color: "#475569" }}
          >
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add details regarding this drawing project..."
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            style={{ fontSize: "13px", fontWeight: 500, color: "#475569" }}
          >
            Preset Thumbnail URL
          </label>
          <input
            name="thumbnail_url"
            type="text"
            value={form.thumbnail_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            style={inputStyle}
          />
        </div>

        {/* Multi-Column Layout Grid for Canvas Dimensions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{ fontSize: "13px", fontWeight: 500, color: "#475569" }}
            >
              Width (px)
            </label>
            <input
              name="width"
              type="number"
              value={form.width}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{ fontSize: "13px", fontWeight: 500, color: "#475569" }}
            >
              Height (px)
            </label>
            <input
              name="height"
              type="number"
              value={form.height}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{ fontSize: "13px", fontWeight: 500, color: "#475569" }}
            >
              Resolution (DPI)
            </label>
            <input
              name="dpi"
              type="number"
              value={form.dpi}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label
              style={{ fontSize: "13px", fontWeight: 500, color: "#475569" }}
            >
              Color Profile
            </label>
            <select
              name="color_mode"
              value={form.color_mode}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="RGB">RGB (Digital Screens)</option>
              <option value="CMYK">CMYK (Print Matte)</option>
              <option value="Grayscale">Grayscale (Monochrome)</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                position: "relative",
                width: "32px",
                height: "32px",
                overflow: "hidden",
                borderRadius: "50%",
                border: "2px solid #cbd5e1",
              }}
            >
              <input
                name="background_color"
                type="color"
                value={form.background_color}
                onChange={handleChange}
                style={{
                  position: "absolute",
                  top: "-8px",
                  left: "-8px",
                  width: "48px",
                  height: "48px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            </div>
            <span
              style={{ fontSize: "13px", fontWeight: 500, color: "#334155" }}
            >
              Canvas Base Color
            </span>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#334155",
              cursor: "pointer",
            }}
          >
            <span>Make Project Public</span>
            <input
              name="is_public"
              type="checkbox"
              checked={form.is_public}
              onChange={handleChange}
              style={{
                width: "16px",
                height: "16px",
                accentColor: "#2563eb",
                cursor: "pointer",
              }}
            />
          </label>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "8px",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#ffffff",
            backgroundColor: "#2563eb",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#1d4ed8")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#2563eb")
          }
        >
          Initialize Workspace
        </button>
      </form>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  color: "#1e293b",
  backgroundColor: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: "6px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

export default ProjectForm;
