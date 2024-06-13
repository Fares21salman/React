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
            <button
              type="button"
              id="New"
              className={styles.linkButton}
              style={{ color: "white", fontSize: "20px" }}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.linkButton}
              style={{ color: "white", fontSize: "20px" }}
            >
              Orders
            </button>
          </li>
          <li>
            <button
              type="button"
              id="repository"
              className={styles.linkButton}
              style={{ color: "white", cursor: "pointer", fontSize: "20px" }}
              onClick={onRepositoryClick}
            >
              Repository
            </button>
          </li>
          <li>
            <button
              type="button"
              id="graph"
              className={styles.linkButton}
              style={{ color: "white", fontSize: "20px" }}
            >
              Graph
            </button>
          </li>
        </ul>
        <hr style={{ color: "white" }} />
      </div>
    </div>
  );
};

export default Sidebar;
