"use client";
import { useProjectStore } from "@lib/store/projectStore";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, ChangeEventHandler, useState } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const [data, setData] = useState<{
    title: string;
    description: string;
    width: number;
    height: number;
    background_color: string;
    is_public: boolean;
    dpi: number;
    color_mode: "RGB" | "CMYK" | "Grayscale";
  }>({
    title: "Untitled Masterpiece",
    description: "No description provided yet.",
    width: 1080,
    height: 720,
    background_color: "#ffffff",
    is_public: false,
    dpi: 72,
    color_mode: "CMYK",
  });
  const { createProject } = useProjectStore(
    useShallow((state) => ({
      createProject: state.createProject,
      error: state.projectError,
      projectsLoading: state.projectsLoading,
    })),
  );
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData({ ...data, [name]: type === "checkbox" ? checked : value });
  };
  const handleChangeSelect =(e:ChangeEvent<HTMLSelectElement>)=>{
    const {name,value} = e.target;
    setData({...data,[name]:value})
  }

  return (
    <main className="flex-1 p-xl overflow-y-auto pt-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-xl">
          <h1 className="font-display-lg text-[48px] text-on-surface mb-xs font-semibold">
            Create New Canvas
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant/70">
            Configure your workspace with precision.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          <div className="lg:col-span-8 space-y-lg">
            <section className="border border-[rgba(255,255,255,0.1)] p-lg rounded-xl">
              <h2 className="font-label-md uppercase text-primary mb-md">
                Project Identity
              </h2>
              <input
                className="outline-none w-full bg-surface-container-lowest border border-white/10 rounded-lg px-md py-md font-headline-md text-on-surface"
                type="text"
                value={data.title}
                name="title"
                onChange={handleChange}
              />
            </section>
            <section className="border border-[rgba(255,255,255,0.1)] p-lg rounded-xl">
              <h2 className="font-label-md uppercase text-primary mb-md">
                Project description
              </h2>
              <input
                className="outline-none w-full bg-surface-container-lowest border border-white/10 rounded-lg px-md py-md font-headline-md text-on-surface"
                type="text"
                value={data.description}
                name="description"
                onChange={handleChange}
              />
            </section>
            <section className="border border-[rgba(255,255,255,0.1)] p-lg rounded-xl">
              <h2 className="font-label-md uppercase text-primary mb-md">
                Custom Dimensions
              </h2>
              <div className="grid grid-cols-2 gap-lg mb-4">
                <div className="space-y-xs">
                  <label className="font-label-md text-[10px] text-on-surface-variant block uppercase">
                    Width
                  </label>
                  <input
                    className="outline-none w-full bg-surface-container-lowest border border-white/10 rounded px-md py-sm"
                    type="number"
                    value={data.width}
                    name="width"
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-[10px] text-on-surface-variant block uppercase">
                    Height
                  </label>
                  <input
                    className="outline-none w-full bg-surface-container-lowest border border-white/10 rounded px-md py-sm"
                    type="number"
                    value={data.height}
                    name="height"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-md text-[10px] text-on-surface-variant block uppercase">
                    Dpi
                  </label>
                  <input
                    className="outline-none w-full bg-surface-container-lowest border border-white/10 rounded px-md py-sm"
                    type="number"
                    value={data.dpi}
                    name="dpi"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>
            <section className="border border-[rgba(255,255,255,0.1)] p-lg rounded-xl">
              <div className="space-y-md">
                <h3 className="font-label-md text-label-md uppercase text-secondary tracking-widest">
                  Technical
                </h3>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Color Mode
                  </label>
                  <select
                    defaultValue={"RGB"}
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none neon-glow-cyan transition-all font-body-md appearance-none"
                    onChange={handleChangeSelect}
                    name="color_mode"
                  >
                    <option value={"Grayscale"}>Grayscale</option>
                    <option value={"RGB"}>RGB</option>
                    <option value={"CMYK"}>CMYK</option>
                  </select>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant">
                    Background Color
                  </label>
                  <div className="flex gap-sm">
                    <input
                      className="h-10 w-16 bg-surface-container-lowest border border-white/10 rounded cursor-pointer p-1"
                      type="color"
                      name="background_color"
                      value={data.background_color}
                      onChange={handleChange}
                    />
                    <input
                      className="grow bg-surface-container-lowest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none neon-glow-cyan transition-all font-label-md"
                      type="text"
                      value={data.background_color}
                      name="background_color"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-md mt-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    name="is_public"
                    checked={data.is_public}
                    onChange={handleChange}
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 font-label-md text-label-md text-on-surface">
                    Is Public
                  </span>
                </label>
                <span className="text-xs text-on-surface-variant max-w-50">
                  Public canvases are visible in the global discovery feed.
                </span>
              </div>
            </section>
          </div>
          <div className="lg:col-span-4">
            <section className="border border-[rgba(255,255,255,0.1)] p-lg rounded-xl flex flex-col">
              <h2 className="font-label-md uppercase text-primary mb-md">
                Preview
              </h2>
              <div className="flex-1 min-h-50 bg-surface-container-lowest border border-white/10 rounded-lg flex items-center justify-center">
                <div
                  className="w-3/4 aspect-video shadow-2xl"
                  style={{ backgroundColor: data.background_color }}
                ></div>
              </div>
              <div className="mt-lg space-y-md">
                <button
                  className="w-full bg-primary-container text-on-primary-container py-md rounded-lg font-bold shadow-lg active:scale-95 transition-all"
                  onClick={async () => {
                    const projectId = await createProject({ ...data });
                    router.push(`${projectId}/edit`);
                  }}
                >
                  Initialize Canvas
                </button>
                <button className="w-full text-on-surface-variant font-label-md">
                  Discard
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
