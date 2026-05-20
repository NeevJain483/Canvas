import React from "react";
import "@style/component/common/loading.css";

const Loading = () => {
  return (
    <>
      <div className="loading-container">
        <div className="spinner">
          <svg viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20"></circle>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Loading;
