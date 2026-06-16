"use client";
import { useAuthStore } from "@lib/store/authStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useShallow } from "zustand/shallow";

const Sidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuthStore(
    useShallow((state) => ({ logout: state.logout })),
  );

  return (
    <aside className="h-screen pt-20 flex flex-col justify-between border-r border-r-[rgba(255,255,255,0.1)]">
      <section className="flex-1">
        <nav>
          <ul className="flex flex-col">
            <li>
              <Link
                href={"/dashboard/projects/new"}
                className={`flex items-center px-7 md:pr-20 gap-4 font-semibold py-4 hover:bg-primary/10 ${pathname === "/dashboard/projects/new" && "bg-primary/20 border-l-4 border-l-primary-fixed-dim/30"}`}
              >
                {" "}
                <span className="material-symbols-outlined">add_box</span>
                New Canvas
              </Link>
            </li>
            <li>
              <Link
                href={"/dashboard/projects"}
                className={`flex items-center px-7 md:pr-20 gap-4 font-semibold py-4 hover:bg-primary/10 ${pathname === "/dashboard/projects" && "bg-primary/20 border-l-4 border-l-primary-fixed-dim/30"}`}
              >
                {" "}
                <span className="material-symbols-outlined">
                  folder_open
                </span>{" "}
                Projects
              </Link>
            </li>
            <li>
              <Link
                href={"/dashboard"}
                className={`flex items-center px-7 md:pr-20 gap-4 font-semibold py-4 hover:bg-primary/10 ${pathname === "/dashboard" && "bg-primary/20 border-l-4 border-l-primary-fixed-dim/30"}`}
              >
                {" "}
                <span className="material-symbols-outlined">
                  dashboard
                </span>{" "}
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href={"/gallery"}
                className={`flex items-center px-7 md:pr-20 gap-4 font-semibold py-4 hover:bg-primary/10 ${pathname === "/gallery" && "bg-primary/20 border-l-4 border-l-primary-fixed-dim/30"}`}
              >
                {" "}
                <span className="material-symbols-outlined">explore</span>{" "}
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href={""}
                className="flex items-center px-7 md:pr-20 gap-4 font-semibold py-4 hover:bg-primary/10"
              >
                {" "}
                <span className="material-symbols-outlined">cloud</span> Cloud
                Sync
              </Link>
            </li>
          </ul>
        </nav>
      </section>
      <section className="flex flex-col w-full px-4 gap-4 py-6">
        <Link
          href={""}
          className="w-full p-4 rounded-lg border border-blue-500/50 flex justify-center items-center text-cyan-500 font-mono font-semibold bg-blue-300/20"
        >
          Upgrade to pro
        </Link>
        <div className="border-b border-b-[rgba(255,255,255,0.08)]"></div>
        <button className="w-full p-3 flex items-center gap-3 text-primary/30 hover:text-primary hover:cursor-pointer" onClick={()=>logout()}>
          <span className="material-symbols-outlined">logout</span>Logout
        </button>
      </section>
    </aside>
  );
};

export default Sidebar;
