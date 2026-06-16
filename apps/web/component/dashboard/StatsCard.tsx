"use client";
import React from "react";
import { FaStar } from "react-icons/fa";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { MdOutlinePublic } from "react-icons/md";
import { LuRuler } from "react-icons/lu";

import { useProjectStore } from "@lib/store/projectStore";
import { useShallow } from "zustand/shallow";

const StatsCard = () => {
  const { total, publicCount, privateCount } = useProjectStore(
    useShallow((state) => ({
      total: state.totalProjects,
      publicCount: state.publicProjects || 0,
      privateCount: state.privateProjects || 0,
    })),
  );

  const iconStyle = { transform: "translateY(-50%)" };

  React.useEffect(() => {}, [total, publicCount, privateCount]);

  return (
    <>
      <div className="statscard">
        <div className="statscard-card">
          <LuRuler size={20} style={iconStyle} />
          <div>
            <p className="statscard-card-number">{total}</p>
            Projects
          </div>
        </div>

        <div className="statscard-card">
          <RiGitRepositoryPrivateLine size={20} style={iconStyle} />
          <div>
            <p className="statscard-card-number">{privateCount}</p>
            Private
          </div>
        </div>
        <div className="statscard-card">
          <MdOutlinePublic size={20} style={iconStyle} />
          <div>
            <p className="statscard-card-number">{publicCount}</p>
            Public
          </div>
        </div>

        {/* Favorites Card */}
        <div className="statscard-card">
          <FaStar size={20} style={iconStyle} />
          <div>
            <p className="statscard-card-number">0</p>
            Favorites
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsCard;
