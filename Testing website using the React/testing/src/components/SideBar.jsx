import React from "react";
import styles from "./sidebar.module.css";

const Sidebar = ({ showDivTestcase, setshowDivTestcase }) => {
  const onRepositoryClick = () => {
    console.log("clicked the repository");
    setshowDivTestcase(!showDivTestcase);
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <p className="text-center fs-1" style={{ color: "white" }}>
          New Project
        </p>
        <hr style={{ color: "white" }} />
        <ul>
          <li>
            <a href="#" id="New" style={{ color: "white", fontSize: "20px" }}>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" style={{ color: "white", fontSize: "20px" }}>
              Orders
            </a>
          </li>
          <li>
            <a
              href="#"
              id="repository"
              style={{ color: "white", cursor: "pointer", fontSize: "20px" }}
              onClick={onRepositoryClick}
            >
              Repository
            </a>
          </li>
          <li>
            <a href="#" id="graph" style={{ color: "white", fontSize: "20px" }}>
              Graph
            </a>
          </li>
        </ul>
        <hr style={{ color: "white" }} />
      </div>
    </div>
  );
};

export default Sidebar;
