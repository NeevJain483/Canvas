"use client";
import { useAuthStore } from "@lib/store/authStore";
import Link from "next/link";
import React from "react";
import { useShallow } from "zustand/shallow";

const Navbar = () => {
  const { logout } = useAuthStore(
    useShallow((state) => ({
      logout: state.logout,
    })),
  );

  return (
    <>
      <header className="fixed top-0 w-full flex justify-between items-center py-2 px-6 border-b border-b-[rgba(255,255,255,0.08)] bg-background/70 backdrop-blur-xl z-10">
        <nav className="flex justify-between items-center gap-5">
          <Link
            href={"/"}
            className="text-[32px] text-primary/60 font-sans font-semibold hover:text-primary"
          >
            StudioCanvas
          </Link>
          <Link
            href={"/dashboard"}
            className="text-primary/50 font-mono font-semibold tracking-tighter hover:text-primary/80"
          >
            Dashboard
          </Link>
          <Link
            href={"/dashboard/projects"}
            className="text-primary/50  font-mono font-semibold tracking-tighter hover:text-primary/80"
          >
            Projects
          </Link>
          <Link
            href={"/gallery"}
            className="text-primary/50 font-mono font-semibold tracking-tighter hover:text-primary/80"
          >
            Gallery
          </Link>
        </nav>
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex items-center">
            <span
              className="material-symbols-outlined absolute left-3"
              style={{ fontSize: "20px" }}
            >
              search
            </span>
            <input
              className="border border-[rgba(255,255,255,0.1)] outline-none rounded-xl pl-10 pr-2 py-2 text-[16px] bg-on-surface/20"
              type="text"
              placeholder="Search feature..."
            />
          </div>
          <button className="flex justify-between items-center">
            <span className="material-symbols-outlined hover:cursor-pointer hover:text-primary">
              notifications
            </span>
          </button>
          <button className="flex justify-between items-center">
            <span className="material-symbols-outlined hover:cursor-pointer hover:text-primary">
              settings
            </span>
          </button>
          <button
            onClick={() => logout()}
            className="flex justify-between items-center hover:text-error-container hover:cursor-pointer"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
          <Link
            href={"/dashboard/projects/new"}
            className="py-2 px-4 text-[14px] bg-primary-container/80 rounded-xl uppercase text-on-tertiary font-bold"
          >
            Create project
          </Link>
        </div>
      </header>
    </>
  );
};

export default Navbar;
