import React from "react";
import Styles from "./counts.module.css";

const TestcasesDiv = ({ projectName, versionName, onVersionClick }) => {
  console.log(projectName, versionName, onVersionClick);
  return (
    <div
      style={{
        backgroundColor: "whitesmoke",
        width: "90%",
        marginLeft: "70px",
      }}
    >
      <div
        className={Styles.bg}
        style={{
          marginTop: "50px",
          color: "white",
          fontSize: "20px",
          padding: "5px",
          borderRadius: "5px",
        }}
      >
        {projectName}
      </div>
      <div
        className={Styles.bg}
        style={{
          marginTop: "10px",
          color: "white",
          fontSize: "20px",
          padding: "5px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
        onClick={onVersionClick}
      >
        {versionName}
      </div>
    </div>
  );
};

export default TestcasesDiv;
