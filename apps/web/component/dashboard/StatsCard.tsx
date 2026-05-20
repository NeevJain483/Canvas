import React from "react";
import { FaStar } from "react-icons/fa";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { MdOutlinePublic } from "react-icons/md";
import { LuRuler } from "react-icons/lu";

import "@style/component/dashboard/statscard.css";

const StatsCard = () => {
  return (
    <>
      <div className="statscard">
        <div className="statscard-card">
          <LuRuler size={20} style={{ translate: "0 -50%" }} />
          <div>
            <p className="statscard-card-number">0</p>Projects
          </div>
        </div>
        <div className="statscard-card">
          <RiGitRepositoryPrivateLine
            size={20}
            style={{ translate: "0 -50%" }}
          />
          <div>
            <p className="statscard-card-number">0</p>Private
          </div>
        </div>
        <div className="statscard-card">
          <MdOutlinePublic size={20} style={{ translate: "0 -50%" }} />
          <div>
            <p className="statscard-card-number">0</p>
            Public
          </div>
        </div>
        <div className="statscard-card">
          <FaStar size={20} style={{ translate: "0 -50%" }} />
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
