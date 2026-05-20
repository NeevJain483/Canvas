import Image from "next/image";
import React from "react";

import { IoImageOutline } from "react-icons/io5";

import "@style/component/dashboard/recentactivity.css";

type Type = {
  src?: string;
  title: string;
};

const Card: React.FC<Type> = ({ src, title }) => {
  return (
    <>
      <div className="recent-activity-card">
        {src ? (
          <Image
            src={src}
            alt="img"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          ></Image>
        ) : (
          <IoImageOutline size={"100%"} />
        )}
        <p style={{ padding: "0 0 0 15px" }}>{title}</p>
      </div>
    </>
  );
};

export default Card;
