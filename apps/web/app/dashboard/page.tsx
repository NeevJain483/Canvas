import React from "react";
import RecentActivity from "../../component/dashboard/RecentActivity";
import { LuRuler } from "react-icons/lu";

import "../../style/component/dashboard/index.css";
import StatsCard from "../../component/dashboard/StatsCard";

const page = () => {
  return (
    <>
      <main>
        <StatsCard />
        <p className="dashboard-recent-activity-heading">
          <LuRuler size={20} style={{ translate: "0 5px" }} /> 2D design
        </p>
        <RecentActivity />
      </main>
    </>
  );
};

export default page;
