"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";

import { useProjectStore } from "../../../../lib/store/projectStore";

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

const Page = () => {
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
      const id = await createProject(form);
      console.log(id);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, type, name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type == "checkbox" ? checked : value,
    }));
  };

  const handleTextAndSelectChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { value, name } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Project Title"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleTextAndSelectChange}
          placeholder="Description"
        />
        <input
          name="thumbnail_url"
          value={form.thumbnail_url}
          onChange={handleChange}
          placeholder="Thumbnail URL"
        />
        <label>
          Public:
          <input
            type="checkbox"
            name="is_public"
            checked={form.is_public}
            onChange={handleChange}
          />
        </label>
        <div>
          <input
            type="number"
            name="width"
            value={form.width}
            onChange={handleChange}
          />
          <input
            type="number"
            name="height"
            value={form.height}
            onChange={handleChange}
          />
        </div>
        <input
          type="number"
          name="dpi"
          value={form.dpi}
          onChange={handleChange}
        />
        <select
          name="color_mode"
          value={form.color_mode}
          onChange={handleTextAndSelectChange}
        >
          <option value="RGB">RGB</option>
          <option value="CMYK">CMYK</option>
          <option value="Grayscale">Grayscale</option>
        </select>
        <input
          type="color"
          name="background_color"
          value={form.background_color}
          onChange={handleChange}
        />
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default Page;
