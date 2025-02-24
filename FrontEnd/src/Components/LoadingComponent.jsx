import React from "react";
import "../Css/loading.css";
const LoadingComponent = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingComponent;
