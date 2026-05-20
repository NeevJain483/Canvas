"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import "@style/component/dashboard/quickactions.css";

const QuickActions = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isChecked = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <section className="dashboard-layout-quick-actions">
      <form className="dashboard-layout-quick-actions-form">
        
        <label>
          <input
            type="radio"
            name="quick-action"
            checked={isChecked("/dashboard")}
            onChange={() => handleNavigation("/dashboard")}
          />
          Home
        </label>

        <label>
          <input
            type="radio"
            name="quick-action"
            checked={isChecked("/dashboard/projects")}
            onChange={() => handleNavigation("/dashboard/projects")}
          />
          Projects
        </label>

        <label>
          <input
            type="radio"
            name="quick-action"
            checked={isChecked("/dashboard/artworks")}
            onChange={() => handleNavigation("/dashboard/artworks")}
          />
          Artworks
        </label>

        <label>
          <input
            type="radio"
            name="quick-action"
            checked={isChecked("/dashboard/favorites")}
            onChange={() => handleNavigation("/dashboard/favorites")}
          />
          Favorites
        </label>
      </form>
    </section>
  );
};

export default QuickActions;
